import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../app/store";
import { useTranslation } from "react-i18next";
import {
  clearCart,
  updateCartItemQuantity,
  removeItemFromCart,
} from "../../features/cart/CartSlice";
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartApiMutation,
} from "../../Services/CartService";
import { FaTrashAlt, FaShoppingCart, FaTimes } from "react-icons/fa";
import "./CartSidebar.css";
import type { CartItem } from "../../common/CartTypes";
import { useNavigate } from "react-router-dom";

const CartSidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.authSlice.user);
  const guestCart = useSelector((state: RootState) => state.cartSlice);
  const { i18n } = useTranslation();
  const lang = i18n.language || "en";
  const [closing, setClosing] = useState(false);
  const navigate = useNavigate();

  const { data: cartFromApi, refetch: refetchCart } = useGetCartQuery(
    user?.userId!,
    { skip: !user?.userId }
  );

  const [updateCartItemApi] = useUpdateCartItemMutation();
  const [removeCartItemApi] = useRemoveCartItemMutation();
  const [clearCartApiCall] = useClearCartApiMutation();

  const [cart, setCart] = useState<any>(guestCart);

  // تحديث cart حسب المستخدم
  useEffect(() => {
    if (user?.userId) {
      if (cartFromApi) setCart(cartFromApi);
    } else {
      setCart(guestCart);
    }
  }, [user?.userId, cartFromApi, guestCart]);

  // منع التمرير + إغلاق بـ ESC
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && handleClose();
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  // إخفاء عنصر back-to-top لما الكارت يفتح
  useEffect(() => {
    const backToTopBtn = document.querySelector(".back-to-top") as HTMLElement;
    if (!backToTopBtn) return;

    if (isOpen) {
      backToTopBtn.style.display = "none";
    } else {
      backToTopBtn.style.display = "";
    }

    return () => {
      if (backToTopBtn) backToTopBtn.style.display = "";
    };
  }, [isOpen]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 400);
  };

  // ✅ تعديل الكمية
  const handleQuantityChange = async (itemId: number, change: number) => {
    if (!cart) return;
    const item = cart.items.find((i: CartItem) => i.id === itemId);
    if (!item) return;

    const newQuantity = item.quantity + change;
    if (newQuantity < 1) return;

    if (user?.userId) {
      try {
        await updateCartItemApi({
          userId: user.userId,
          item: { ...item, quantity: newQuantity },
        }).unwrap();
        refetchCart();
      } catch (err) {
        console.error("Update cart failed:", err);
      }
    } else {
      // ضيف → Redux + LocalStorage
      const updatedItems = guestCart.items.map((i: CartItem) =>
        i.id === itemId ? { ...i, quantity: newQuantity } : i
      );

      const updatedCart = {
        ...guestCart,
        items: updatedItems,
        totalQuantity: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
        subTotal: updatedItems.reduce(
          (sum, i) => sum + i.price * i.quantity,
          0
        ),
        grandTotal: updatedItems.reduce(
          (sum, i) => sum + i.price * i.quantity,
          0
        ),
      };

      dispatch(updateCartItemQuantity({ id: itemId, change }));
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setCart(updatedCart);
    }
  };

  const handelCheckout = () => {
    handleClose();
    navigate("/checkout");
  };
  // ✅ حذف منتج
  const handleRemoveItem = async (itemId: number) => {
    if (!cart) return;

    if (user?.userId) {
      try {
        await removeCartItemApi({
          userId: user.userId,
          productId: itemId,
        }).unwrap();
        refetchCart();
      } catch (err) {
        console.error("Remove failed:", err);
      }
    } else {
      const updatedItems = guestCart.items.filter(
        (i: CartItem) => i.id !== itemId
      );
      const updatedCart = {
        ...guestCart,
        items: updatedItems,
        totalQuantity: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
        subTotal: updatedItems.reduce(
          (sum, i) => sum + i.price * i.quantity,
          0
        ),
        grandTotal: updatedItems.reduce(
          (sum, i) => sum + i.price * i.quantity,
          0
        ),
      };

      dispatch(removeItemFromCart(itemId));
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setCart(updatedCart);
    }
  };

  // ✅ تفريغ السلة
  const handleClearCart = async () => {
    if (!cart) return;
    if (user?.userId) {
      try {
        await clearCartApiCall(user.userId).unwrap();
        refetchCart();
      } catch (err) {
        console.error("Clear cart failed:", err);
      }
    } else {
      dispatch(clearCart());
      localStorage.removeItem("cart");
      setCart({ items: [], totalQuantity: 0, subTotal: 0, grandTotal: 0 });
    }
  };

  if (!isOpen && !closing) return null;

  return (
    <>
      <div
        className={`cart-overlay ${closing ? "closing" : ""}`}
        onClick={handleClose}
      ></div>

      <div
        className={`cart-sidebar ${lang === "ar" ? "rtl" : "ltr"} ${
          isOpen ? "open" : closing ? "closing" : ""
        }`}
      >
        <div className="cart-header">
          <h2>
            <FaShoppingCart style={{ marginInlineEnd: "8px" }} />
            {lang === "ar" ? "سلة المشتريات" : "Shopping Cart"}
          </h2>
          <button className="cart-close-btn" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        {!cart || cart.items.length === 0 ? (
          <div className="cart-empty">
            <FaShoppingCart size={50} />
            <p>{lang === "ar" ? "سلتك فاضية 😢" : "Your cart is empty 😢"}</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.items.map((item: CartItem) => (
                <div key={item.id ?? 0} className="cart-item-card">
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="cart-item-img"
                  />
                  <div className="cart-item-info">
                    <strong className="cart-item-name">
                      {lang === "ar" ? item.productNameAr : item.productName}
                    </strong>
                    <p className="cart-item-price">
                      {(item.price * item.quantity).toFixed(2)}{" "}
                      {lang === "en" ? "EGP" : "جنيه"}
                    </p>
                  </div>

                  <div className="cart-item-actions">
                    <button
                      className="cart-remove-btn"
                      onClick={() => item.id && handleRemoveItem(item.id)}
                    >
                      <FaTrashAlt />
                    </button>
                    <div className="quantity-control">
                      <button
                        onClick={() =>
                          item.id && handleQuantityChange(item.id, -1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => {
                          item.id && handleQuantityChange(item.id, 1);
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  {item.selectedVariants &&
                    Object.keys(item.selectedVariants).length > 0 && (
                      <div className="cart-item-variants">
                        {Object.entries(item.selectedVariants).map(
                          ([variantName, options], index) => (
                            <div key={index} className="variant-line">
                              <strong>
                                {lang === "ar"
                                  ? variantName.split(",")[0]
                                  : variantName.split(",")[1]}
                                :
                              </strong>{" "}
                              <span>
                                {lang === "ar" ? options[0] : options[1]}{" "}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    )}
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <p>
                {lang === "ar" ? "إجمالي العناصر:" : "Items:"}{" "}
                <strong>{cart.totalQuantity}</strong>
              </p>
              <p>
                {lang === "ar" ? "الإجمالي الفرعي:" : "Subtotal:"}{" "}
                <strong>{cart.subTotal.toFixed(2)}</strong>
              </p>
              <h4>
                {lang === "ar" ? "الإجمالي النهائي:" : "Grand Total:"}{" "}
                <span>{cart.grandTotal.toFixed(2)}</span>
              </h4>

              <hr />

              <button
                className="cart-create-btn"
                onClick={handelCheckout}
              >
                {lang === "ar" ? "إنشاء الطلب" : "Check Out"}
              </button>
              <button className="cart-clear-btn" onClick={handleClearCart}>
                {lang === "ar" ? "تفريغ السلة" : "Clear Cart"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
