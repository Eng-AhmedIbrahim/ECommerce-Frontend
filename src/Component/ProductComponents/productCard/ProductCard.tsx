import { useCallback, useState } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
  FaArrowRight,
} from "react-icons/fa";
import "./ProductCard.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { updateProductLove } from "../../../features/product/ProductSlice";
import { useAppDispatch, useAppSelector } from "../../../app/Hooks";
import {
  useAddToWishListApiMutation,
  useRemoveFromWishListApiMutation,
} from "../../../Services/WishlistApi";
import type { AppProduct } from "../../../common/ProductTypes";
import { addItemToCart } from "../../../features/cart/CartSlice";
import type { CartItem } from "../../../common/CartTypes";
import VariantDialog from "../../Dialogs/variantDialog/VariantDialog";
import {
  useAddToCartMutation,
  useGetCartQuery,
} from "../../../Services/CartService";

import SnackbarMessage from "../../../helpersComponents/snackBar/SnackbarMessage";
import useGenerateRandomNumber from "../../../Hooks/GenerateRandomNumber/useGenerateRandomNumber";

const ProductCard = ({ Product, Love }: AppProduct) => {
  const user = useAppSelector((state) => state.authSlice?.user);
  const guestCart = useAppSelector((state) => state.cartSlice);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "en";
  const dispatch = useAppDispatch();

  // ❤️ المفضلة
  const [isFav, setIsFav] = useState<boolean>(Love);
  const [addToWishListApi, { isLoading: isAdding }] =
    useAddToWishListApiMutation();
  const [removeFromWishListApi, { isLoading: isRemoving }] =
    useRemoveFromWishListApiMutation();

  // 🛒 Cart
  const [addToCartApi] = useAddToCartMutation();
  const { refetch: refetchCart } = useGetCartQuery(user?.userId!, {
    skip: !user?.userId,
  });

  // 🔔 Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success" as "success" | "error" | "warning" | "info",
  });

  const showSnackbar = (
    message: string,
    type: "success" | "error" | "info" | "warning" = "info"
  ) => {
    setSnackbar({ open: true, message, type });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // ❤️ Handle favorite
  const handleFavClick = useCallback(async () => {
    const newValue = !isFav;
    setIsFav(newValue);
    dispatch(updateProductLove({ id: Product.id, love: newValue }));

    if (!user?.userId) {
      let wishlist: AppProduct[] = JSON.parse(
        localStorage.getItem("wishlist") || "[]"
      );
      if (newValue) {
        const exists = wishlist.some((p) => p.Product.id === Product.id);
        if (!exists) wishlist.push({ Product, Love: true });
        showSnackbar(
          lang === "ar" ? "تمت الإضافة إلى المفضلة ✅" : "Added to wishlist ✅",
          "success"
        );
      } else {
        wishlist = wishlist.filter((p) => p.Product.id !== Product.id);
        showSnackbar(
          lang === "ar"
            ? "تمت الإزالة من المفضلة ❌"
            : "Removed from wishlist ❌",
          "warning"
        );
      }
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      return;
    }

    try {
      const payload = { productId: Product.id, userId: user.userId };
      if (newValue) await addToWishListApi(payload).unwrap();
      else await removeFromWishListApi(payload).unwrap();

      showSnackbar(
        newValue
          ? lang === "ar"
            ? "تمت الإضافة للمفضلة ✅"
            : "Added to wishlist ✅"
          : lang === "ar"
          ? "تم الإزالة من المفضلة ❌"
          : "Removed from wishlist ❌",
        "success"
      );
    } catch (err) {
      console.error("❌ Wishlist API Error:", err);
      setIsFav((prev) => !prev);
      dispatch(updateProductLove({ id: Product.id, love: !newValue }));
      showSnackbar(
        lang === "ar" ? "حدث خطأ، حاول مرة أخرى" : "Error updating wishlist",
        "error"
      );
    }
  }, [
    dispatch,
    isFav,
    Product,
    user,
    addToWishListApi,
    removeFromWishListApi,
    lang,
  ]);

  // 🛒 Handle Cart
  const [showVariantDialog, setShowVariantDialog] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string[]>
  >({});

  const addToCart = async (item: CartItem) => {
    if (user?.userId) {
      try {
        await addToCartApi({ userId: user.userId, item }).unwrap();
        refetchCart();
        showSnackbar(
          lang === "ar" ? "تمت الإضافة للسلة ✅" : "Added to cart ✅",
          "success"
        );
      } catch (err) {
        console.error("❌ Add to Cart API Error:", err);
        showSnackbar(
          lang === "ar" ? "حدث خطأ، حاول مرة أخرى" : "Error adding to cart",
          "error"
        );
      }
    } else {
      item.id = useGenerateRandomNumber();
      dispatch(addItemToCart(item));
      localStorage.setItem("cart", JSON.stringify({ ...guestCart }));
      showSnackbar(
        lang === "ar" ? "تمت الإضافة للسلة ✅" : "Added to cart ✅",
        "success"
      );
    }
  };

  const handelAddItemToCart = useCallback(() => {
    if (Product.variants && Product.variants.length > 0) {
      setShowVariantDialog(true);
      return;
    }

    const newItem: CartItem = {
      productId: Product.id,
      productName: Product.englishName ?? "",
      productNameAr: Product.arabicName ?? "",
      imageUrl: Product.images?.[0] ?? "",
      quantity: 1,
      selectedVariants,
      originalPrice: Product.price ?? 0,
      discountPercentage: Product.discountPercentage ?? 0,
      price:
        (Product.price ?? 0) -
        ((Product.price ?? 0) * (Product.discountPercentage ?? 0)) / 100,
    };

    addToCart(newItem);
  }, [Product, selectedVariants, addToCart]);

  const handleVariantSelectionDone = (variants: Record<string, string[]>) => {
    setSelectedVariants(variants);
    setShowVariantDialog(false);

    const newItem: CartItem = {
      productId: Product.id,
      productName: Product.englishName ?? "",
      productNameAr: Product.arabicName ?? "",
      imageUrl: Product.images?.[0] ?? "",
      quantity: 1,
      selectedVariants: variants,
      originalPrice: Product.price ?? 0,
      discountPercentage: Product.discountPercentage ?? 0,
      price:
        (Product.price ?? 0) -
        ((Product.price ?? 0) * (Product.discountPercentage ?? 0)) / 100,
    };

    addToCart(newItem);
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={Product.images?.[0]}
          alt={Product.englishName}
          className="product-image"
        />
        {Product.discountPercentage && (
          <div className="discount-badge">
            {Product.discountPercentage}% {lang === "en" ? "OFF" : "خصم"}
          </div>
        )}
        <button
          className={`fav-button ${isFav ? "active" : ""}`}
          onClick={handleFavClick}
          disabled={isAdding || isRemoving}
        >
          {isAdding || isRemoving ? (
            <span>...</span>
          ) : isFav ? (
            <FaHeart />
          ) : (
            <FaRegHeart />
          )}
        </button>
      </div>

      <div className="product-details">
        <h3 className="product-title">
          {lang === "en" ? Product.englishName : Product.arabicName}
        </h3>
        <p className="product-desc">
          {lang === "en"
            ? Product.englishDescription
            : Product.arabicDescription}
        </p>

        <div className="product-bottom">
          <span className="product-price">{Product.price} EGP</span>
          <div className="buttons">
            <button className="cart-button" onClick={handelAddItemToCart}>
              <FaShoppingCart />
              <span>{t("AddtoCart")}</span>
            </button>

            <button
              className="details-button"
              onClick={() => navigate(`/productDetails/${Product.id}`)}
            >
              <span>{t("More")}</span>
              <FaArrowRight
                className="arrow-icon"
                style={{
                  transform: lang === "ar" ? "rotate(180deg)" : "rotate(0deg)",
                  marginLeft: lang === "ar" ? "0" : "0.5rem",
                  marginRight: lang === "ar" ? "0.5rem" : "0",
                }}
              />
            </button>
          </div>
        </div>
      </div>

      {showVariantDialog && (
        <VariantDialog
          product={Product}
          onClose={() => setShowVariantDialog(false)}
          onConfirm={handleVariantSelectionDone}
        />
      )}

      {/* ✅ Snackbar Message */}
      <SnackbarMessage
        open={snackbar.open}
        message={snackbar.message}
        type={snackbar.type}
        onClose={handleCloseSnackbar}
      />
    </div>
  );
};

export default ProductCard;
