import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { FaBars, FaSearch, FaSun, FaMoon } from "react-icons/fa";
import { IoLanguage } from "react-icons/io5";
import {
  lazy,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  Suspense,
} from "react";
import ThemeContext from "../../Context/themeContext/ThemeContext";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "./Header.css";
import { useAppSelector } from "../../app/Hooks";
import { useGetCartQuery } from "../../Services/CartService";

const HeaderActions = lazy(() => import("./headerActions/HeaderActions"));
const CartSidebar = lazy(() => import("../cart/CartSidebar"));

export default function Header() {
  const [isMobile, setIsMobile] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeContext not provided");
  const [theme, setTheme] = context;

  const { t, i18n } = useTranslation();
  const lang = i18n.language || "en";

  const getCartItemsCount = (): number => {
    const user = useAppSelector((select) => select.authSlice.user);
    let cartItemCount = 0;
    if (!user) {
      cartItemCount = useAppSelector((select) => select.cartSlice.items.length);
    } else {
      const { data: userCart } = useGetCartQuery(user.userId, {
        skip: !user.userId,
      });

      if (userCart) cartItemCount = userCart.totalItems;
    }
    return cartItemCount;
  };

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
  const toggleLanguage = () => {
    const newLang = lang === "en" ? "ar" : "en";
    localStorage.setItem("lang", newLang);
    i18n.changeLanguage(newLang);
  };

  const handleCartToggle = () => {
    setIsCartOpen((prev) => !prev);
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 992);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useLayoutEffect(() => {
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", dir);
    document.body.setAttribute("dir", dir);
  }, [lang]);

  return (
    <>
      <Navbar expand="lg" className="navbar-custom px-4 fixed-top">
        <Container fluid>
          <Navbar.Brand
            as={Link}
            to="/"
            className="me-3 mx-3 navbar-brand-custom" 
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            {t("MyWebsite")}
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="navbarSupportedContent">
            <FaBars
              style={{
                color: theme === "light" ? "#1e293b" : "#f5f5f5",
                fontSize: "1.25rem",
              }}
            />
          </Navbar.Toggle>

          <Navbar.Collapse id="navbarSupportedContent">
            <Nav
              className={`nav-links-container ${
                lang === "en" ? "me-auto" : "ms-auto"
              }`}
            >
              <Nav.Link as={Link} to="/">
                {t("Home")}
              </Nav.Link>
              <Nav.Link as={Link} to="/shop">
                {t("Shop")}
              </Nav.Link>
              <Nav.Link as={Link} to="/wishlist">
                {t("Wishlist")}
              </Nav.Link>
              <Nav.Link as={Link} to="/about">
                {t("About")}
              </Nav.Link>
            </Nav>

            <form
              className={`d-flex align-items-center search-style search-form-container ${
                isMobile ? "my-3" : ""
              }`}
            >
              <input
                type="text"
                placeholder={t("Search")}
                className="form-control me-2"
              />
              <Button className="icon-btn" aria-label="Search">
                <FaSearch />
              </Button>
            </form>

            <div className="d-none d-lg-flex header-actions-container">
              <HeaderActions
                CartItemCount={getCartItemsCount()}
                onCartClick={handleCartToggle}
              />
            </div>

            <div
              className={`d-lg-flex mx-2 language-theme-container ${
                isMobile
                  ? "d-flex align-items-center justify-content-center gap-3"
                  : ""
              }`}
            >
              {isMobile && (
                <>
                  <Button
                    className="icon-btn"
                    aria-label="Language"
                    onClick={toggleLanguage}
                  >
                    <IoLanguage />
                  </Button>
                  <Button
                    className="theme-btn"
                    onClick={toggleTheme}
                    aria-label="Toggle Theme"
                  >
                    {theme === "light" ? <FaMoon /> : <FaSun />}
                  </Button>
                </>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="mobile-bottom-nav d-flex d-lg-none">
        <HeaderActions
          isMobile={true}
          CartItemCount={getCartItemsCount()}
          onCartClick={handleCartToggle}
        />
      </div>

      <Suspense fallback={null}>
        <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </Suspense>
    </>
  );
}
