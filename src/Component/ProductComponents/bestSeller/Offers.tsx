import "./Offers.css";
import ProductSection from "../productSection/ProductSection";
import { useTranslation } from "react-i18next";
import type { AppProduct, Product } from "../../../common/ProductTypes";
const Offers = () => {
  const products: Product[] = [];
  //   {
  //     id: 1,
  //     arabicName: "عرض اشتري 1 وخد 1 مجانًا",
  //     englishName: "Buy 1 Get 1 Free",
  //     arabicDescription: "احصل على مشروب قهوة إضافي مجانًا عند شراء أي مشروب.",
  //     englishDescription:
  //       "Get another coffee drink for free when you buy any one.",
  //     price: 8.99,
  //     discountPercentage: 50,
  //     discountedPrice: 4.49,
  //     stockQuantity: 20,
  //     images: ["/images/offer1.jpg"],
  //     variants: [],
  //     categoryId: 1,
  //   },
  //   {
  //     id: 2,
  //     arabicName: "تخفيضات نهاية الأسبوع",
  //     englishName: "Weekend Sale",
  //     arabicDescription:
  //       "استمتع بأفضل وجباتنا مع خصم 30% طوال عطلة نهاية الأسبوع.",
  //     englishDescription: "Enjoy our best meals with 30% off all weekend long.",
  //     price: 12.5,
  //     discountPercentage: 30,
  //     discountedPrice: 8.75,
  //     stockQuantity: 35,
  //     images: ["/images/offer2.jpg"],
  //     variants: [],
  //     categoryId: 1,
  //   },
  //   {
  //     id: 3,
  //     arabicName: "عروض الكومبو",
  //     englishName: "Combo Deals",
  //     arabicDescription: "احصل على وجبة كومبو ووفّر حتى 25% فورًا.",
  //     englishDescription: "Grab a combo meal and save up to 25% instantly.",
  //     price: 10.0,
  //     discountPercentage: 25,
  //     discountedPrice: 7.5,
  //     stockQuantity: 40,
  //     images: ["/images/offer3.jpg"],
  //     variants: [],
  //     categoryId: 1,
  //   },
  // ];

  const AppProducts: AppProduct[] = products?.map((p) => ({
    Product: p,
    Love: false,
  }));
  const { t } = useTranslation();

  return <ProductSection title={t("Offers")} AppProducts={AppProducts} />;
};

export default Offers;
