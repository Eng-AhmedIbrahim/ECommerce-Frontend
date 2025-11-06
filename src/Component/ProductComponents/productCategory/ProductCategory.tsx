import { useMemo, useEffect, lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../app/Hooks";
import { useGetProductsQuery } from "../../../Services/Product";
import { useGetCategoriesQuery } from "../../../Services/Category";
import { setProducts } from "../../../features/product/ProductSlice";
import { useGetWishlistForUserApiQuery } from "../../../Services/WishlistApi";
import ErrorPage from "../../../error/errorPage/ErrorPage";
import Loading from "../../../helpersComponents/loading/Loading";
import type { AppProduct } from "../../../common/ProductTypes";
import "./ProductCategory.css";

const ProductSection = lazy(() => import("../productSection/ProductSection"));

const ProductCategory = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const {
    data: categories,
    error: catError,
    isLoading: catIsLoading,
  } = useGetCategoriesQuery();
  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useGetProductsQuery();

  const userId =
    useAppSelector((state) => state?.authSlice?.user?.userId) ?? "";
  const {
    data: favProductsIds,
    error: wishlistError,
    isLoading: wishlistIsLoading,
  } = useGetWishlistForUserApiQuery(userId, { skip: !userId });

  const productsInStore = useAppSelector((state) => state.productData.value);

  useEffect(() => {
    if (!productsData) return;

    let productsWithLove: AppProduct[] = [];

    if (userId && Array.isArray(favProductsIds)) {
      productsWithLove = productsData.map((product) => ({
        Product: product,
        Love: favProductsIds.includes(product.id),
      }));
    } else if (!userId) {
      const lovedFromLocalStorage: AppProduct[] = JSON.parse(
        localStorage.getItem("wishlist") ?? "[]"
      );
      productsWithLove = productsData.map((product) => {
        const isLoved = lovedFromLocalStorage.some(
          (p) => p.Product.id === product.id
        );
        return { Product: product, Love: isLoved };
      });
    }

    const areEqual =
      productsInStore.length === productsWithLove.length &&
      productsInStore.every(
        (p, i) =>
          p.Product.id === productsWithLove[i].Product.id &&
          p.Love === productsWithLove[i].Love
      );

    if (!areEqual) dispatch(setProducts(productsWithLove));
  }, [productsData, favProductsIds, userId, dispatch]);

  const products = useAppSelector((state) => state.productData.value);

  const categorizedProducts = useMemo(() => {
  if (!categories || !products) return [];

  return [...categories]
    .sort((a, b) => {
      const aIndex = a?.index ?? Infinity;
      const bIndex = b?.index ?? Infinity;
      return aIndex - bIndex;
    })
    .map((cat) => {
      const catProducts = products.filter(
        (p) => p?.Product?.categoryId === cat.id
      );

      return {
        id: cat.id,
        title: lang === "ar" ? cat.arabicName : cat.englishName,
        items: catProducts,
      };
    })
    .filter((cat) => cat.items.length > 0);
}, [categories, products, lang]);


  if (catIsLoading || productsLoading || wishlistIsLoading) return <Loading />;
  if (catError || productsError || wishlistError) return <ErrorPage />;

  return (
    <div className="product-category-page fade-in">
      <Suspense fallback={<Loading />}>
        {categorizedProducts.length > 0 ? (
          categorizedProducts.map((cat) => (
            <ProductSection
              key={cat.id}
              title={cat.title}
              AppProducts={cat.items}
            />
          ))
        ) : (
          <p className="no-products">{t("NoProductMessage")}</p>
        )}
      </Suspense>
    </div>
  );
};

export default ProductCategory;
