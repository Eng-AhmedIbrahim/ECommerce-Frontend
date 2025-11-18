import React, { useState, useMemo } from "react";
import { FaTimes } from "react-icons/fa";
import type {
  Variant,
  AppProduct,
  SelectedVariantData,
} from "../../../common/ProductTypes";
import "./VariantDialog.css";
import { useTranslation } from "react-i18next";

type VariantDialogProps = {
  product: AppProduct["Product"];
  onClose: () => void;
  onConfirm: (
    variants: Record<
      string,
      { arabicName: string; englishName: string; price: number }
    >
  ) => void;
};

const VariantDialog: React.FC<VariantDialogProps> = ({
  product,
  onClose,
  onConfirm,
}) => {
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, SelectedVariantData>
  >({});

  const [_, lang] = useTranslation();

  const groupedVariants = useMemo(() => {
    const groups: Record<string, Variant[]> = {};
    product.variants?.forEach((variant) => {
      const attrName =
        lang.language === "ar"
          ? variant.attributeArabicName
          : variant.attributeEnglishName;
      if (!groups[attrName]) groups[attrName] = [];
      groups[attrName].push(variant);
    });
    return groups;
  }, [product, lang.language]);

  const handleSelectVariant = (
    combinedAttrKey: string,
    variant: Variant,
    variantPrice: number
  ) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [combinedAttrKey]: {
        arabicName: variant.arabicValue,
        englishName: variant.englishValue,
        price: variantPrice,
      },
    }));
  };
  const handleConfirm = () => {
    if (
      Object.keys(selectedVariants).length < Object.keys(groupedVariants).length
    ) {
      alert(
        lang.language === "ar"
          ? "من فضلك اختر كل الخصائص المطلوبة قبل الإضافة إلى السلة"
          : "Please select all required options before adding to cart"
      );
      return;
    }
    onConfirm(selectedVariants);
  };

  return (
    <div className="variant-dialog-overlay">
      <div className="variant-dialog">
        <div className="variant-dialog-header">
          <h3>
            {lang.language === "ar" ? "اختيار الخصائص" : "Select Variants"}
          </h3>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className="variant-dialog-body">
          {Object.keys(groupedVariants).length > 0 ? (
            Object.entries(groupedVariants).map(([attr, variants]) => (
              <div key={attr} className="variant-group">
                <h4>{attr}:</h4>
                <div className="variant-options">
                  {variants.map((v) => {
                    const selected = selectedVariants[attr];

                    const isSelected =
                      selected &&
                      selected.arabicName === v.arabicValue &&
                      selected.englishName === v.englishValue;
                    return (
                      <button
                        key={v.id}
                        className={`variant-btn ${
                          isSelected ? "selected" : ""
                        }`}
                        onClick={() =>
                          handleSelectVariant(
                            `${v.attributeArabicName},${v.attributeEnglishName}`,
                            v,
                            v.price
                          )
                        }
                      >
                        {lang.language === "en"
                          ? v.englishValue
                          : v.arabicValue}

                        <span className="variant-price">
                          &nbsp;({v.price.toFixed(2)}{" "}
                          {lang.language === "ar" ? "ج.م." : "LE"})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <p>
              {lang.language === "ar"
                ? "لا توجد خصائص متاحة لهذا المنتج"
                : "No variants available"}
            </p>
          )}
        </div>
        <div className="variant-dialog-footer">
          <button className="confirm-btn" onClick={handleConfirm}>
            {lang.language === "ar" ? "تأكيد الإضافة" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VariantDialog;
