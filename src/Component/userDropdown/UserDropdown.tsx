import { Dropdown } from "react-bootstrap";
import {
  FaLock,
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
  FaUserPlus,
} from "react-icons/fa";
import { useAppSelector } from "../../app/Hooks";
import { useLogoutApiMutation } from "../../Services/AuthApi";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import "./UserDropdown.css";

export default function UserDropdown({ theme }: any) {
  const { isAuthenticated, user } = useAppSelector((state) => state.authSlice);
  const [logoutApi] = useLogoutApiMutation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Dropdown align={lang === "ar" ? "start" : "end"}>
      <Dropdown.Toggle
        as="div"
        className="icon-btn user-icon"
        aria-label="User"
      >
        <FaUser />
      </Dropdown.Toggle>

      <Dropdown.Menu
        className={`dropdown-menu-custom ${theme} ${
          lang === "ar" ? "rtl" : ""
        }`}
      >
        {Boolean(isAuthenticated) ? (
          <>
            <Dropdown.Header>Welcome {user?.userName}</Dropdown.Header>
            <Dropdown.Item href="#edit-username">
              <FaUser className="me-2" /> {t("ChangeUsername")}
            </Dropdown.Item>
            <Dropdown.Item href="#change-password">
              <FaLock className="me-2" /> {t("ChangePassword")}
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout}>
              <FaSignOutAlt className="me-2" /> {t("SignOut")}
            </Dropdown.Item>
          </>
        ) : (
          <>
            <div className="dropdown-info px-3 py-2">
              <small>{t("NoAccountText")}</small>
            </div>
            <Dropdown.Item as={Link} to="/login">
              <FaSignInAlt className="me-2" /> {t("Signin")}
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/signup">
              <FaUserPlus className="me-2" /> {t("Signup")}
            </Dropdown.Item>
          </>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}
