import { useState, useEffect, lazy, Suspense, startTransition } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import ThemeContext from "../../Context/themeContext/ThemeContext";
import LocalizationContext from "../../Context/localicationContext/LocalizationContext";
import { persistor, store } from "../../app/store";
import "./App.css";
import WishlistPage from "../../Pages/wishlist/Wishlist";
import Loading from "../../helpersComponents/loading/Loading";
import ErrorBoundry from "../../error/ErrorBoundry";
import CheckOutWrapper from "../../helpersComponents/CheckOutWrapper";

// ✅ Lazy Imports
const Home = lazy(() => import("../../Pages/home/Home"));
const Layout = lazy(() => import("../../helpersComponents/layout/Layout"));
const SignUp = lazy(() => import("../../Pages/auth/signup/Signup"));
const SignIn = lazy(() => import("../../Pages/auth/login/Login"));
const Product = lazy(() => import("../../Pages/product/Product"));
const CheckOutPage = lazy(() => import("../../Pages/checkOut/CheckOutPage"));
const FullScreenWrapper = lazy(
  () => import("../../helpersComponents/FullScreenWrapper")
);
const ProductDetails = lazy(
  () => import("../../Pages/productDetails/ProductDetails")
);
const ScrollToTop = lazy(() => import("../../helpers/ScrollToTop"));

function App() {
  const [theme, setTheme] = useState<string>(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: light)"
    ).matches;
    return savedTheme || (prefersDark ? "dark" : "light");
  });

  const [lang, setLang] = useState<string>(() => {
    const savedLanguage = localStorage.getItem("lang");
    return savedLanguage || "ar";
  });

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        refetchOnWindowFocus: false,
      },
    },
  });

  const [showRoutes, setShowRoutes] = useState(false);
  useEffect(() => {
    startTransition(() => {
      setShowRoutes(true);
    });
  }, []);

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    document.body.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("lang", lang);
  }, [lang]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeContext.Provider value={[theme, setTheme]}>
          <LocalizationContext.Provider value={[lang, setLang]}>
            <QueryClientProvider client={queryClient}>
              <Router>
                {showRoutes ? (
                  <>
                    <ScrollToTop />
                    <Suspense
                      fallback={
                        <div className="loading-style">
                          <Loading size={300} className="text-blue-500" />
                        </div>
                      }
                    >
                      <Routes>
                        {/* Protected routes */}
                        <Route
                          element={
                            <ErrorBoundry>
                              <Layout />
                            </ErrorBoundry>
                          }
                        >
                          <Route
                            path="/"
                            element={
                              <ErrorBoundry>
                                <Home />
                              </ErrorBoundry>
                            }
                          />
                          <Route
                            path="/shop"
                            element={
                              <ErrorBoundry>
                                <Product />
                              </ErrorBoundry>
                            }
                          />
                          <Route
                            path="/productDetails/:id"
                            element={
                              <ErrorBoundry>
                                <ProductDetails />
                              </ErrorBoundry>
                            }
                          />
                          <Route
                            path="/wishlist"
                            element={
                              <ErrorBoundry>
                                <WishlistPage />
                              </ErrorBoundry>
                            }
                          />
                          <Route element={<CheckOutWrapper />}>
                            <Route
                              path="/checkout"
                              element={
                                <ErrorBoundry>
                                  <CheckOutPage />
                                </ErrorBoundry>
                              }
                            />
                          </Route>
                        </Route>

                        <Route
                          element={
                            <ErrorBoundry>
                              <FullScreenWrapper />
                            </ErrorBoundry>
                          }
                        >
                          <Route
                            path="/signup"
                            element={
                              <ErrorBoundry>
                                <SignUp />
                              </ErrorBoundry>
                            }
                          />
                          <Route
                            path="/login"
                            element={
                              <ErrorBoundry>
                                <SignIn />
                              </ErrorBoundry>
                            }
                          />
                        </Route>
                      </Routes>
                    </Suspense>
                  </>
                ) : (
                  <div className="loading-style">
                    <Loading size={300} className="text-blue-500" />
                  </div>
                )}
              </Router>
            </QueryClientProvider>
          </LocalizationContext.Provider>
        </ThemeContext.Provider>
      </PersistGate>
    </Provider>
  );
}

export default App;
