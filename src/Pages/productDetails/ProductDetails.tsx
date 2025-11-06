import { useParams, type Params } from "react-router-dom";
import type {
  ProductReviewDto,
  ProductReviewToReturnDto,
  Variant,
} from "../../common/ProductTypes";
import { Carousel } from "react-bootstrap";
import { useState } from "react";
import { FaStar, FaRegStar, FaShippingFast } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../app/Hooks";
import type { CartItem } from "../../common/CartTypes";
import { useAddReviewMutation } from "../../Services/Product";

import "./ProductDetails.css";
import ErrorPage from "../../error/errorPage/ErrorPage";

const ProductDetails = (): JSX.Element => {
  const { id }: Readonly<Params<string>> = useParams();
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, Variant>
  >({});
  const [showVariantImage, setShowVariantImage] = useState<Variant | null>(
    null
  );

  const productId = id ? +id : 0;
  const AppProduct = useAppSelector((state) =>
    state.productData.value.find((p) => p.Product.id === productId)
  );
  const Product = AppProduct?.Product ?? null;

  const user = useAppSelector((state) => state.authSlice.user);

  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const groupedVariants = (Product?.variants ?? []).reduce(
    (acc: Record<string, Variant[]>, variant: Variant) => {
      const key =
        lang === "en"
          ? variant.attributeEnglishName
          : variant.attributeArabicName;
      if (!acc[key]) acc[key] = [];
      acc[key].push(variant);
      return acc;
    },
    {} as Record<string, Variant[]>
  );

  const handleSelectVariant = (attr: string, variant: Variant) => {
    setSelectedVariants((prev) => ({ ...prev, [attr]: variant }));
    if (variant.imageUrl) setShowVariantImage(variant);
  };

  const handleAddToCart = () => {
    if (!Product) return;

    const allAttrs = Object.keys(groupedVariants);
    const allSelected = allAttrs.every((a) => selectedVariants[a]);
    if (!allSelected) {
      return alert(
        lang === "en"
          ? "Please select all variants before adding to cart"
          : "من فضلك اختر كل الخصائص قبل الإضافة للسلة"
      );
    }

    const item: CartItem = {
      productId: Product.id ?? 0,
      productName: Product.englishName ?? "",
      productNameAr: Product.arabicName ?? "",
      imageUrl: Product.images[0] ?? "",
      quantity: 1,
      selectedVariants: {},
      originalPrice: Product.price ?? 0,
      discountPercentage: Product.discountPercentage ?? 0,
      price:
        (Product.price ?? 0) -
        ((Product.price ?? 0) * (Product.discountPercentage ?? 0)) / 100,
    };

    console.log("🛒 Added to cart:", item);
  };

  const [reviews, setReviews] = useState<ProductReviewToReturnDto[]>(
    Product?.productReviews?.map((r) => ({
      ...r,
      createdOn: r.createdOn ?? new Date().toISOString(),
    })) ?? []
  );

  const [userRating, setUserRating] = useState<number>(0);
  const [formData, setFormData] = useState<{ comment: string; rating: number }>(
    { comment: "", rating: 0 }
  );
  const [addReview, { isLoading: addingReview, error: reviewError }] =
    useAddReviewMutation();

  const handleAddReview = async () => {
    if (!formData.comment || formData.rating === 0) {
      return alert(t("ReviewAlert"));
    }

    const reviewPayload: ProductReviewDto = {
      productId: Product?.id ?? 0,
      userId: user?.userId ?? null,
      userName: user?.userName ?? "Unknown",
      comment: formData.comment,
      rating: formData.rating,
    };

    try {
      const newReview = await addReview(reviewPayload).unwrap();
      // نضيف الريفيو الجديد مع التاريخ الحالي
      setReviews((prev) => [
        { ...newReview, createdAt: new Date().toISOString() },
        ...prev,
      ]);
      setFormData({ comment: "", rating: 0 });
      setUserRating(0);
      console.log("Review Added");
    } catch (err) {
      console.log("Can't Add Review", err);
    }
  };

  if (!Product) return <ErrorPage />;

  return (
    <div className="product-details-page">
      {/* --- PRODUCT IMAGES & INFO --- */}
      <div className="product-details-container">
        <div className="product-images">
          <Carousel interval={3000} indicators controls>
            {Product?.images?.map((img, i) => (
              <Carousel.Item key={i}>
                <img
                  className="d-block w-100"
                  src={img}
                  alt={`${
                    lang === "en" ? Product.englishName : Product.arabicName
                  } - image ${i + 1}`}
                  style={{ maxHeight: "400px", objectFit: "cover" }}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </div>

        <div className="product-info">
          <h2 className="product-name">
            {lang === "en" ? Product?.englishName : Product?.arabicName}
          </h2>
          <p className="product-desc">
            {lang === "en"
              ? Product?.englishDescription
              : Product?.arabicDescription}
          </p>

          <div className="product-price-container">
            {Product?.discountPercentage ?? 0 > 0 ? (
              <div className="price-wrapper discount">
                <span className="discounted">
                  {Product?.discountedPrice} {lang === "en" ? "EGP" : "جنيه"}
                </span>
                <span className="old-price">
                  {Product?.price} {lang === "en" ? "EGP" : "جنيه"}
                </span>
                <span className="discount-badge">
                  {Product?.discountPercentage}% {lang === "en" ? "OFF" : "خصم"}
                </span>
              </div>
            ) : (
              <div className="price-wrapper">
                <span className="price">
                  {Product?.price} {lang === "en" ? "EGP" : "جنيه"}
                </span>
              </div>
            )}

            <div
              className={`stock ${
                Product?.stockQuantity! > 0 ? "in-stock" : "out-stock"
              }`}
            >
              {Product?.stockQuantity! > 0
                ? lang === "en"
                  ? "In Stock"
                  : "متوفر"
                : lang === "en"
                ? "Out of Stock"
                : "غير متوفر"}
            </div>
          </div>

          {Object.entries(groupedVariants).map(([attr, variants]) => (
            <div key={attr} className="product-variant">
              <h4>{attr}:</h4>
              <div className="variant-options">
                {variants.map((v) => {
                  const isSelected = selectedVariants[attr]?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      className={`variant-btn ${isSelected ? "selected" : ""}`}
                      onClick={() => handleSelectVariant(attr, v)}
                    >
                      {lang === "en" ? v.englishValue : v.arabicValue}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <button
            className={`add-to-cart ${
              Product?.stockQuantity! > 0 ? "" : "disabled"
            }`}
            onClick={handleAddToCart}
            disabled={Product?.stockQuantity! <= 0}
          >
            {t("AddtoCart")} <FaShippingFast />
          </button>
        </div>
      </div>

      {/* --- VARIANT POPUP --- */}
      {showVariantImage && (
        <div className="variant-popup">
          <div className="variant-popup-content">
            <button
              className="close-btn"
              onClick={() => setShowVariantImage(null)}
            >
              ✖
            </button>
            <img src={showVariantImage.imageUrl!} alt="Variant" />
          </div>
        </div>
      )}

      {/* --- REVIEWS --- */}
      <div className="reviews-section">
        <h3>{t("Review")}</h3>
        <div className="reviews-list">
          {reviews.map((r, index) => (
            <div key={index} className="review-card">
              <div className="review-header">
                <img
                  src={r.userAvatar ?? "/images/default-avatar.png"}
                  alt={r.userName}
                  className="review-avatar"
                />
                <div>
                  <h5 className="review-username">{r.userName}</h5>
                  <span className="review-date">
                    {new Date(r.createdOn!).toLocaleDateString(lang, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
              <div className="review-stars">
                {[...Array(5)].map((_, i) =>
                  i < r.rating ? (
                    <FaStar key={i} className="star filled" />
                  ) : (
                    <FaRegStar key={i} className="star" />
                  )
                )}
              </div>
              <p className="review-comment">{r.comment ?? ""}</p>
            </div>
          ))}
        </div>

        {/* --- ADD REVIEW FORM --- */}
        <div className="add-review">
          <h4>{t("AddComment")}</h4>

          <div className="rating-input">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                onClick={() => {
                  setFormData({ ...formData, rating: i + 1 });
                  setUserRating(i + 1);
                }}
                className={i < userRating ? "star filled" : "star"}
              >
                <FaStar />
              </span>
            ))}
          </div>

          <textarea
            value={formData.comment}
            onChange={(e) =>
              setFormData({ ...formData, comment: e.target.value })
            }
            placeholder={t("AddCommentPlaceholder")}
          ></textarea>

          <button onClick={handleAddReview} disabled={addingReview}>
            {t("SendReview")}
          </button>

          {reviewError && <p className="error">Error adding review!</p>}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
