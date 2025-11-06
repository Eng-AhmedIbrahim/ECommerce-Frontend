import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      MyWebsite: "Menem Store",
      Home: "Home",
      Shop: "Shop",
      Wishlist: "Wishlist",
      About: "About Us",
      Search: "Search...",
      Offers: "Exclusive Offers",
      AddtoCart: "Add To Cart",
      More: "More",
      AllProducts: "All Products",
      NoProductMessage: "There Are No Product",
      All: "All",
      Signin: "Sign In",
      Signup: "Sign Up",
      ChangeUsername: "Change Username",
      ChangePassword: "Change Password",
      SignOut: "Sign Out",
      NoAccountText: "Sign in to access your account and settings.",
      YourWishlist: "Your Wishlist",
      NoProductInWishlist: "No Products In Wishlist",
      Review: "Client Reviews",
      AddCommant:"Add Review",
      AddCommantPlaceholder : "Write Your Commant ...",
      SendReview:"Send Review",
      ReviewAlert:"Please add a rating and review",
      NoProductFound:"No Products In This Category",
      AddComment :"Add Comment",
      AddCommentPlaceholder : "Add Comment Placeholder"
    },
  },
  ar: {
    translation: {
      MyWebsite: "منعم",
      Home: "الرئيسية",
      Shop: "المتجر",
      Wishlist: "المفضلة",
      About: "من نحن",
      Search: "ابحث...",
      Offers: "عروض مميزة",
      AddtoCart: "اضف للسلة",
      More: "المزيد",
      AllProducts: "كل المنتجات",
      NoProductMessage: "لا توجد منتجات في هذه الفئة",
      All: "الكل",
      Signin: "تسجيل الدخول",
      Signup: "إنشاء حساب",
      ChangeUsername: "تغيير اسم المستخدم",
      ChangePassword: "تغيير كلمة المرور",
      SignOut: "تسجيل الخروج",
      NoAccountText: "سجّل الدخول للوصول إلى حسابك وإعداداتك.",
      YourWishlist: "المفضلات",
      NoProductInWishlist: "لا توجد منتجات في قائمة المفضلات",
      Review: "آراء العملاء",
      AddCommant:"أضف تقييمك",
      AddCommantPlaceholder:"اكتب رأيك في المنتج...",
      SendReview:"إرسال التقييم",
      ReviewAlert:"من فضلك أضف تقييمًا ومراجعة",
      NoProductFound:"لا يوجد منتجات في هذه الفئة",
      AddComment:"اضف تعليق",
      AddCommentPlaceholder : "قم باضافة تعليق الان"
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("lang") || "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
