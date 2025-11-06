import { useState, useEffect } from "react";
import { FaTrash, FaShoppingCart, FaHeart } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "../../app/Hooks";
import {
  useGetWishlistForUserApiQuery,
  useRemoveFromWishListApiMutation,
} from "../../Services/WishlistApi";
import { addItemToCart } from "../../features/cart/CartSlice";
import {
  useAddToCartMutation,
  useGetCartQuery,
} from "../../Services/CartService";
import VariantDialog from "../../Component/Dialogs/variantDialog/VariantDialog";
import SnackbarMessage from "../../helpersComponents/snackBar/SnackbarMessage";
import type { AppProduct } from "../../common/ProductTypes";
import type { CartItem } from "../../common/CartTypes";
import "./Wishlist.css";
import useGenerateRandomNumber from "../../Hooks/GenerateRandomNumber/useGenerateRandomNumber";

const WishlistPage = (): JSX.Element => {
  const [wishlist, setWishlist] = useState<AppProduct[]>([]);
  const [showVariantDialog, setShowVariantDialog] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string[]>
  >({});
  const [currentProduct, setCurrentProduct] = useState<AppProduct | null>(null);

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const showNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const dispatch = useAppDispatch();
  const guestCart = useAppSelector((state) => state.cartSlice);
  const user = useAppSelector((state) => state.authSlice.user);
  const userId = user?.userId ?? "";

  const { data: favProductsIds, isLoading } = useGetWishlistForUserApiQuery(
    userId,
    {
      skip: !userId,
    }
  );
  const [removeFromWishListApi] = useRemoveFromWishListApiMutation();
  const [addToCartApi] = useAddToCartMutation();
  const { refetch: refetchCart } = useGetCartQuery(user?.userId!, {
    skip: !user?.userId,
  });

  useEffect(() => {
    loadWishlist();
  }, [user, favProductsIds, location.key]);

  const loadWishlist = () => {
    try {
      let storedWishlist: AppProduct[] = [];

      if (user && Array.isArray(favProductsIds)) {
        const root = localStorage.getItem("persist:root");
        if (root) {
          const parsedRoot = JSON.parse(root);
          if (parsedRoot.productData) {
            const parsedProductData = JSON.parse(parsedRoot.productData);
            if (Array.isArray(parsedProductData.value)) {
              storedWishlist = parsedProductData.value.filter((p: AppProduct) =>
                favProductsIds.includes(p.Product.id)
              );
            }
          }
        }
      } else {
        const localWishlist = localStorage.getItem("wishlist");
        if (localWishlist) {
          const parsedLocal = JSON.parse(localWishlist);
          if (Array.isArray(parsedLocal)) storedWishlist = parsedLocal;
        }
      }

      setWishlist(storedWishlist);
    } catch (err) {
      console.error("❌ Error parsing wishlist:", err);
    }
  };

  const updateLocalStorage = (updated: AppProduct[]) => {
    localStorage.setItem("wishlist", JSON.stringify(updated));
    setWishlist(updated);
  };

  const handleRemove = async (id: number) => {
    if (user) {
      try {
        await removeFromWishListApi({
          userId: user.userId,
          productId: id,
        }).unwrap();
        setWishlist((prev) => prev.filter((p) => p.Product.id !== id));
        showNotification(
          lang === "ar" ? "تم إزالة المنتج من المفضلة" : "Removed from wishlist"
        );
      } catch (err) {
        console.error("❌ Error removing from server:", err);
        showNotification(
          lang === "ar" ? "حدث خطأ، حاول مرة أخرى" : "Error removing item"
        );
      }
    } else {
      const updated = wishlist.filter((p) => p.Product.id !== id);
      updateLocalStorage(updated);
      showNotification(
        lang === "ar" ? "تم إزالة المنتج من المفضلة" : "Removed from wishlist"
      );
    }
  };

  const addToCart = async (item: CartItem) => {
    if (user?.userId) {
      try {
        await addToCartApi({ userId: user.userId, item }).unwrap();
        refetchCart();
        showNotification(
          lang === "ar"
            ? "تم إضافة المنتج إلى السلة!"
            : "Item Added Successfully"
        );
      } catch (err) {
        console.error("❌ Add to Cart API Error:", err);
        showNotification(
          lang === "ar" ? "حدث خطأ، حاول مرة أخرى!" : "❌ Add to Cart API Error"
        );
      }
    } else {
      dispatch(addItemToCart(item));
      localStorage.setItem("cart", JSON.stringify({ ...guestCart }));
      showNotification(
        lang === "ar" ? "تم إضافة المنتج إلى السلة!" : "Item Added Successfully"
      );
    }
  };

  const handleAddToCart = (product: AppProduct) => {
    if (product.Product.variants && product.Product.variants.length > 0) {
      setCurrentProduct(product);
      setShowVariantDialog(true);
      return;
    }

    const newItem: CartItem = {
      id: useGenerateRandomNumber(),
      productId: product.Product.id,
      productName: product.Product.englishName ?? "",
      productNameAr: product.Product.arabicName ?? "",
      imageUrl: product.Product.images?.[0] ?? "",
      quantity: 1,
      selectedVariants,
      originalPrice: product.Product.price ?? 0,
      discountPercentage: product.Product.discountPercentage ?? 0,
      price:
        (product.Product.price ?? 0) -
        ((product.Product.price ?? 0) *
          (product.Product.discountPercentage ?? 0)) /
          100,
    };

    addToCart(newItem);
  };

  const handleVariantSelectionDone = (variants: Record<string, string[]>) => {
    if (!currentProduct) return;

    setSelectedVariants(variants);
    setShowVariantDialog(false);

    const newItem: CartItem = {
      productId: currentProduct.Product.id,
      productName: currentProduct.Product.englishName ?? "",
      productNameAr: currentProduct.Product.arabicName ?? "",
      imageUrl: currentProduct.Product.images?.[0] ?? "",
      quantity: 1,
      selectedVariants: variants,
      originalPrice: currentProduct.Product.price ?? 0,
      discountPercentage: currentProduct.Product.discountPercentage ?? 0,
      price:
        (currentProduct.Product.price ?? 0) -
        ((currentProduct.Product.price ?? 0) *
          (currentProduct.Product.discountPercentage ?? 0)) /
          100,
    };

    addToCart(newItem);
  };

  const handleGoToProduct = (id: number) => {
    navigate(`/productDetails/${id}`);
  };

  if (isLoading)
    return <p className="loading-text">Loading your wishlist...</p>;

  if (wishlist.length === 0)
    return (
      <div className="wishlist-page">
        <h2>
          {t("YourWishlist")} <FaHeart className="wishlist-heart" />
        </h2>
        <p className="no-wishlist">{t("NoProductInWishlist")}</p>
      </div>
    );

  return (
    <main>
      <div className="wishlist-page">
        <h2>
          {t("YourWishlist")} <FaHeart className="wishlist-heart" />
        </h2>

        <div className="wishlist-grid">
          {wishlist.map((item) => (
            <div key={item.Product.id} className="wishlist-card">
              <img
                src={item.Product.images[0]}
                alt={
                  lang === "en"
                    ? item.Product.englishName
                    : item.Product.arabicName
                }
                onClick={() => handleGoToProduct(item.Product.id)}
              />

              <button
                className="remove-btn"
                onClick={() => handleRemove(item.Product.id)}
              >
                <FaTrash />
              </button>

              <div className="wishlist-info">
                <h3>
                  {lang === "en"
                    ? item.Product.englishName
                    : item.Product.arabicName}
                </h3>
                <span className="price">{item.Product.price} EGP</span>
              </div>

              <button
                className="add-to-cart-btn"
                onClick={() => handleAddToCart(item)}
              >
                <FaShoppingCart />
                <span>{t("AddtoCart")}</span>
              </button>
            </div>
          ))}
        </div>

        {showVariantDialog && currentProduct && (
          <VariantDialog
            product={currentProduct.Product}
            onClose={() => setShowVariantDialog(false)}
            onConfirm={handleVariantSelectionDone}
          />
        )}

        <SnackbarMessage
          open={showToast}
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
          duration={3000}
        />
      </div>
    </main>
  );
};

export default WishlistPage;
