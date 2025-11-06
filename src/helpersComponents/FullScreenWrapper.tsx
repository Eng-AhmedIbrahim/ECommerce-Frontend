import {  useEffect } from "react";
import { Outlet } from "react-router-dom";

const FullScreenWrapper = () => {
  useEffect(() => {
    document.body.style.padding = "0";
    document.body.style.margin = "0";

    document.body.style.minHeight = "100vh";

    return () => {
      document.body.style.padding = "";
      document.body.style.margin = "";
    };
  }, []);

  return <Outlet/>
};

export default FullScreenWrapper;