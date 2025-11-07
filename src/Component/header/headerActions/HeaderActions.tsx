import { Badge, Button } from "react-bootstrap";
import { FaHeart, FaSun, FaMoon, FaShoppingCart, FaHome } from "react-icons/fa";
import { lazy, useContext } from "react";
import { IoLanguage } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ThemeContext from "../../../Context/themeContext/ThemeContext";
import "./HeaderActions.css";

const UserDropdown = lazy(() => import("../../userDropdown/UserDropdown"));

type HeaderActionsProps = {
  isMobile?: boolean;
  CartItemCount: number;
  onCartClick?: () => void;
};

export default function HeaderActions({
  isMobile = false,
  CartItemCount,
  onCartClick,
}: HeaderActionsProps) {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("Cant Provide Context");
  const [theme, setTheme] = context;

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const lang = i18n.language || "en";

  const toggleLanguage = () => {
    const newLang = lang === "en" ? "ar" : "en";
    localStorage.setItem("lang", newLang);
    i18n.changeLanguage(newLang);
  };

  const CartButton = (
    <div style={{ position: "relative", display: "inline-block" }}>
      <Button className="icon-btn" aria-label="Shop" onClick={onCartClick}>
        <FaShoppingCart />
      </Button>
      {CartItemCount > 0 && (
        <Badge
          pill
          className="position-absolute top-0 start-100 translate-middle CartItemCount"
          style={{
            fontSize: "0.65rem",
            color: "#fff",
          }}
        >
          {CartItemCount}
        </Badge>
      )}
    </div>
  );

  return (
    <div className={`icons-container ${isMobile ? "mobile-icons" : ""}`}>
      {isMobile ? (
        <>
          <Button className="icon-btn" aria-label="Home" onClick={() => navigate("/")}>
            <FaHome />
          </Button>
          {CartButton}
          <Button
            className="icon-btn"
            aria-label="Wishlist"
            onClick={() => navigate("/wishlist")}
          >
            <FaHeart />
          </Button>
          <UserDropdown />
        </>
      ) : (
        <>
          {CartButton}
          <Button
            className="icon-btn"
            aria-label="Wishlist"
            onClick={() => navigate("/wishlist")}
          >
            <FaHeart />
          </Button>
          <Button
            className="theme-btn"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
          >
            {theme === "light" ? <FaMoon /> : <FaSun />}
          </Button>
          <Button
            className="icon-btn"
            aria-label="Language"
            onClick={toggleLanguage}
          >
            <IoLanguage />
          </Button>
          <UserDropdown />
        </>
      )}
    </div>
  );
}
