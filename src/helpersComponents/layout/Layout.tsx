import { Outlet, useLocation } from "react-router-dom";
import Header from "../../Component/header/Header";
import Footer from "../../Component/footer/Footer";

const Layout = () => {
  const location = useLocation();
  const noHeaderPages = ["/signup", "/login"];
  const showHeader = !noHeaderPages.includes(location.pathname);
  const isHomePage = location.pathname === "/";

  return (
    <>
      {showHeader && <Header />}
      <div className={showHeader ? "content-padding" : ""}>
        <Outlet />
      </div>
      {isHomePage && <Footer />}
    </>
  );
};

export default Layout;
