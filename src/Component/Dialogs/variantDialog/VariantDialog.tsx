import React, { useState, useMemo } from "react";
import { FaTimes } from "react-icons/fa";
import type { Variant, AppProduct } from "../../../common/ProductTypes";
import "./VariantDialog.css";
import { useTranslation } from "react-i18next";

type VariantDialogProps = {
  product: AppProduct["Product"];
  onClose: () => void;
  onConfirm: (variants: Record<string, string[]>) => void;
};

const VariantDialog: React.FC<VariantDialogProps> = ({
  product,
  onClose,
  onConfirm,
}) => {
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string[]>
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

  const handleSelectVariant = (attr: string, variant: Variant) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [attr]: [variant.arabicValue, variant.englishValue],
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
                      selected[0] === v.arabicValue &&
                      selected[1] === v.englishValue;
                    return (
                      <button
                        key={v.id}
                        className={`variant-btn ${
                          isSelected ? "selected" : ""
                        }`}
                        onClick={() =>
                          handleSelectVariant(
                            `${v.attributeArabicName},${v.attributeEnglishName}`,
                            v
                          )
                        }
                      >
                        {lang.language === "en"
                          ? v.englishValue
                          : v.arabicValue}
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
