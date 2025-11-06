import "./ProductSection.css";
import ProductCard from "../productCard/ProductCard";
import type { AppProduct } from "../../../common/ProductTypes";
import ErrorBoundry from "../../../error/ErrorBoundry";
import { t } from "i18next";

type ProductSectionType = {
  title: string;
  AppProducts: AppProduct[];
};

const ProductSection = ({ title, AppProducts }: ProductSectionType): JSX.Element => {
  return (
    <section className="product-section">
      <div className="container">
        <div className="product-header">
          <h2>{title}</h2>
        </div>

        {AppProducts.length > 0 ? (
          <div className="product-scroll">
            {AppProducts.map((appProduct) => (
              <ErrorBoundry key={appProduct.Product.id}>
                <ProductCard Product={appProduct.Product} Love={appProduct.Love} />
              </ErrorBoundry>
            ))}
          </div>
        ) : (
          <p className="no-products-text">
            {t("NoProductFound")}
          </p>
        )}
      </div>
    </section>
  );
};

export default ProductSection;
