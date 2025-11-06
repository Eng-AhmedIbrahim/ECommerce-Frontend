import { useTranslation } from "react-i18next";
import "./Shop.css";



const Shop = () => {
  const {t} =useTranslation();
  return (
    <div className="container shop-style">
      <div className="line-with-text mt-5">
        <span>{t("Shop")}</span>
      </div>
    </div>
  );
};

export default Shop;
