import React, { useState } from "react";
import { FaCcVisa, FaCcMastercard } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import "./CheckOutPage.css";

const CheckOutPage: React.FC = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    company: "",
    address: "",
    apartment: "",
    state: "",
    city: "",
    country: "Egypt",
    phone: "",
    secondPhone: "",
    paymentMethod: "card",
  });

  const [showAddressDialog, setShowAddressDialog] = useState(false);

  const savedAddresses = [
    "15 Tahrir St, Cairo, Egypt",
    "25 ElMokattam St, Cairo, Egypt",
    "8 Corniche Rd, Alexandria, Egypt",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Order submitted successfully!");
  };

  const handleSelectAddress = (address: string) => {
    setForm({ ...form, address });
    setShowAddressDialog(false);
  };

  return (
    <div className="checkout-container">
      {/* Left Section */}
      <form onSubmit={handleSubmit} className="checkout-form">
        {/* Contact */}
        <div className="section">
          <h2>{t("Contact")}</h2>
          <input
            type="email"
            name="email"
            placeholder={t("EnterEmail")}
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Delivery */}
        <div className="section">
          <h2>{t("Delivery")}</h2>
          {/* <select name="country" value={form.country} onChange={handleChange}>
            <option value="Egypt">{t("Egypt")}</option>
          </select> */}

          <div className="">
            <input
              type="text"
              name="firstName"
              placeholder={t("Firstname")}
              value={form.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder={t("Lastname")}
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <input
            type="text"
            name="company"
            placeholder={t("Company")}
            value={form.company}
            onChange={handleChange}
          />

          {/* Address Section */}
          <div className="address-header">
            <label>Address</label>
            <button
              type="button"
              className="select-address-btn"
              onClick={() => setShowAddressDialog(true)}
            >
              {t("SelectSavedAddress")}
            </button>
          </div>

          <input
            type="text"
            name="address"
            placeholder={t("AddressDetails")}
            value={form.address}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="apartment"
            placeholder={t("Appartment")}
            value={form.apartment}
            onChange={handleChange}
          />

          <div className="">
            <input
              type="text"
              name="state"
              placeholder={t("State")}
              value={form.state}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="city"
              placeholder={t("City")}
              value={form.city}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder={t("PhoneNumber")}
              value={form.phone}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder={t("SecondPhone")}
              value={form.secondPhone}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Shipping */}
        <div className="section">
          <h2>{t("Shippingmethod")}</h2>
          <div className="shipping-box">
            <span>{t("Standard")}</span>
            <span className="price">£85.00</span>
          </div>
        </div>

        {/* Payment */}
        <div className="section.payment">
          <h2>{t("Payment")}</h2>
          <p className="info-text">{t("Alltransactionssecure")}.</p>

          {/* Card Option */}
          <div
            className={`payment-option ${
              form.paymentMethod === "card" ? "active" : ""
            }`}
            onClick={() => setForm({ ...form, paymentMethod: "card" })}
          >
            <div className="option-header">
              <div className="option-info">
                <input
                  type="radio"
                  checked={form.paymentMethod === "card"}
                  readOnly
                />
                <span>{t("Creditcard")}</span>
              </div>

              <div className="card-icons">
                <FaCcVisa size={26} />
                <FaCcMastercard size={26} />
              </div>
            </div>

            {form.paymentMethod === "card" && (
              <div className="card-details">
                <input type="text" placeholder={t("CardNumber")} />
                <div className="">
                  <input type="text" placeholder={t("ExpirationDate")} />
                  <input type="text" placeholder={t("SecurityCode")} />
                </div>
                <input type="text" placeholder={t("NameOnCard")} />
              </div>
            )}
          </div>

          {/* Cash Option */}
          <div
            className={`payment-option ${
              form.paymentMethod === "cod" ? "active" : ""
            }`}
            onClick={() => setForm({ ...form, paymentMethod: "cod" })}
          >
            <input
              type="radio"
              checked={form.paymentMethod === "cod"}
              readOnly
            />
            <span style={{ fontWeight: "800",fontSize: "1rem" }}>{t("CashOnDelivery")}</span>
          </div>
        </div>

        <button type="submit" className="pay-button">
          {t("PayNow")}
        </button>
      </form>

      {/* Right Section */}
      <div className="order-summary">
        <h3>Order summary</h3>
        {[1, 2, 3].map((item) => (
          <div key={item} className="order-item">
            <div className="item-info">
              <div className="item-image" />
              <div>
                <p className="item-name">The Mask On S362</p>
                <p className="item-details">Silver / M</p>
              </div>
            </div>
            <p className="price">£1,245.00</p>
          </div>
        ))}

        <div className="summary-totals">
          <div>
            <span>Subtotal</span>
            <span>£12,460.00</span>
          </div>
          <div>
            <span>Shipping</span>
            <span>£85.00</span>
          </div>
          <div className="total">
            <span>Total</span>
            <span>£12,575.00</span>
          </div>
          <p className="savings">TOTAL SAVINGS £12,245.00</p>
        </div>
      </div>

      {/* Address Dialog */}
      {showAddressDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h3>Select a Saved Address</h3>
            <ul className="address-list">
              {savedAddresses.map((addr, index) => (
                <li key={index} onClick={() => handleSelectAddress(addr)}>
                  {addr}
                </li>
              ))}
            </ul>
            <div className="dialog-buttons">
              <button
                type="button"
                onClick={() => alert("Add new address clicked")}
              >
                Add New Address
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowAddressDialog(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckOutPage;
