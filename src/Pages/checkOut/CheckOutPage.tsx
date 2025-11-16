import React, { useEffect, useState } from "react";
import { FaCcVisa, FaCcMastercard } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import "./CheckOutPage.css";
import { useAppSelector } from "../../app/Hooks";
import type { Cart } from "../../common/CartTypes";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [35, 45],
  iconAnchor: [17, 45],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

// لتحديث مركز الخريطة عند تغيير الموقع
const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 15);
  }, [lat, lng, map]);
  return null;
};

const reverseGeocode = async (lat: number, lng: number) => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "MenemWebSite/1.0 (roma2001342@gmail.com)",
    },
  });

  const data = await res.json();

  if (!data?.address) return null;

  const address = data.address;

  const fullAddress = [
    address.house_number,
    address.road,
    address.neighbourhood,
    address.city_district,
  ]
    .filter(Boolean)
    .join(", ");

  console.log("Reverse Geocode Result:", data);

  return {
    address: fullAddress || address.country || "",
    street: address.road || "",
    city: address.city || address.town || address.village || "",
    state: address.state || address.county || "",
  };
};
const CheckOutPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const userCart = useAppSelector((state) => state.cartSlice) as Cart;

  const [location, setLocation] = useState<{ lat: number; lng: number }>({
    lat: 30.0444,
    lng: 31.2357,
  });

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

  const [shipping, setShipping] = useState(85);
  const [showAddressDialog, setShowAddressDialog] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `Order submitted successfully!\nAddress: ${form.address}\nLat: ${location.lat}, Lng: ${location.lng}`
    );
  };

  // Component لتحديد الموقع على الخريطة (بالنقر أو السحب)
  // const LocationMarker = () => {
  //   useMapEvents({
  //     click: async (e) => {
  //       const { lat, lng } = e.latlng;
  //       setLocation({ lat, lng });

  //       // جلب بيانات العنوان وتحديث حقول النموذج
  //       const details = await reverseGeocode(lat, lng);
  //       if (details) {
  //         setForm((prevForm) => ({
  //           ...prevForm,
  //           address: details.address,
  //           city: details.city || "",
  //           state: details.state || "",
  //         }));
  //       }
  //     },
  //   });

  //   return (
  //     <Marker
  //       position={[location.lat, location.lng]}
  //       draggable={true}
  //       eventHandlers={{
  //         dragend: async (e) => {
  //           const pos = e.target.getLatLng();
  //           setLocation({ lat: pos.lat, lng: pos.lng });

  //           const details = await reverseGeocode(pos.lat, pos.lng);
  //           if (details) {
  //             setForm((prevForm) => ({
  //               ...prevForm,
  //               address: details.address,
  //               city: details.city || "",
  //               state: details.state || "",
  //             }));
  //           }
  //         },
  //       }}
  //     >
  //       <Popup>
  //         Lat: {location.lat.toFixed(5)}, Lng: {location.lng.toFixed(5)}
  //       </Popup>
  //     </Marker>
  //   );
  // };

  const LocationMarker = ({ lat, lng }: { lat: number; lng: number }) => {
    return (
      <Marker position={[lat, lng]}>
        <Popup>
          Lat: {lat.toFixed(5)}, Lng: {lng.toFixed(5)}
        </Popup>
      </Marker>
    );
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    // يطلب إذن الموقع عند دخول الصفحة
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        // تحديث المارك والموقع
        setLocation({ lat, lng });

        const details = await reverseGeocode(lat, lng);
        if (details) {
          setForm((prevForm) => ({
            ...prevForm,
            address: details.address,
            city: details.city || "",
            state: details.state || "",
          }));
        }
      },
      (err) => {
        if (err.code === 1) {
          alert("يرجى السماح بالوصول إلى الموقع لتحديد عنوانك تلقائيًا.");
        } else {
          console.log("Geolocation error:", err);
        }
      }
    );
  }, []);

  // زرار لجلب الإحداثيات الحالية (للاختبار)
  const handleGetCoordinates = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setLocation({ lat, lng });

        const details = await reverseGeocode(lat, lng);
        if (details) {
          setForm((prevForm) => ({
            ...prevForm,
            address: details.address,
            city: details.city || "",
            state: details.state || "",
          }));
        }

        alert(
          `Current Coordinates:\nLat: ${lat}\nLng: ${lng}\nAddress: ${details?.address}`
        );
      },
      (err) => {
        if (err.code === 1) {
          alert("يرجى السماح بالوصول إلى الموقع.");
        } else {
          console.log("Geolocation error:", err);
        }
      }
    );
  };

  return (
    <div className="checkout-container">
      <form onSubmit={handleSubmit} className="checkout-form">
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

        <div className="section">
          <h2>{t("Delivery")}</h2>
          <div className="">
            <input
              type="text"
              name="firstName"
              placeholder={t("FullName")}
              value={form.firstName}
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
            <h2>{t("Address")}</h2>
            <button
              type="button"
              className="select-address-btn"
              onClick={() => setShowAddressDialog(true)}
            >
              {t("SelectSavedAddress")}
            </button>
          </div>

          <div
            className="map-container"
            style={{
              width: "100%",
              maxWidth: "600px",
              height: "400px",
              marginTop: "10px",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <MapContainer
              center={[location.lat, location.lng]}
              zoom={15}
              style={{ width: "100%", height: "100%" }}
              scrollWheelZoom={true}
              zoomControl={true}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker lat={location.lat} lng={location.lng} />
              <RecenterMap lat={location.lat} lng={location.lng} />
            </MapContainer>
          </div>

          <button
            type="button"
            style={{ marginTop: "10px" }}
            onClick={handleGetCoordinates}
          >
            Get Current Location
          </button>

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
              name="secondPhone"
              placeholder={t("SecondPhone")}
              value={form.secondPhone}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Payment Section */}
        {/* ... (بقية قسم الدفع) ... */}
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
            <span style={{ fontWeight: "600", fontSize: "1rem" }}>
              {t("CashOnDelivery")}
            </span>
          </div>
        </div>

        <button type="submit" className="pay-button">
          {t("PayNow")}
        </button>
      </form>

      {/* Right Section (Order Summary) */}
      {/* ... (بقية ملخص الطلب) ... */}
      <div className={`order-summary ${lang === "ar" ? "rtl" : "ltr"}`}>
        <h3>{t("OrderSummary")}</h3>

        {userCart.items.map((item) => (
          <div key={item.productId} className="order-item">
            <div
              className="item-info d-flex"
              style={{ flexDirection: lang === "ar" ? "row" : "row" }}
            >
              <div className="item-image">
                <img
                  src={item.imageUrl}
                  alt={lang === "ar" ? item.productNameAr : item.productName}
                />
              </div>
              <div className={lang === "ar" ? "text-end" : "text-start"}>
                <p className="item-name">
                  {lang === "ar" ? item.productNameAr : item.productName}
                </p>
                {item.selectedVariants && (
                  <p className="item-details">
                    {Object.entries(item.selectedVariants).map(
                      ([variantName, options]) => (
                        <span key={variantName}>
                          {lang === "ar"
                            ? variantName.split(",")[0]
                            : variantName.split(",")[1]}
                          : {lang === "ar" ? options[0] : options[1]}{" "}
                        </span>
                      )
                    )}
                  </p>
                )}
                <p className="item-quantity">
                  {t("Quantity")} : {item.quantity.toLocaleString("ar-EG")}
                </p>
              </div>
            </div>
            <p
              className="price"
              style={{ textAlign: lang === "ar" ? "right" : "left" }}
            >
              {item.price.toLocaleString(lang === "ar" ? "ar-EG" : "en-US")}{" "}
              {lang === "ar" ? "جنيه" : "EGP"}
            </p>
          </div>
        ))}

        <div className="summary-totals">
          <div className="d-flex justify-content-between">
            <span>{t("Subtotal")}</span>
            <span>
              {userCart.subTotal.toLocaleString(
                lang === "ar" ? "ar-EG" : "en-US"
              )}{" "}
              {lang === "ar" ? "جنيه" : "EGP"}
            </span>
          </div>
          <div className="d-flex justify-content-between">
            <span>{t("Shipping")}</span>
            <span>
              {shipping.toLocaleString(lang === "ar" ? "ar-EG" : "en-US")}{" "}
              {lang === "ar" ? "جنيه" : "EGP"}
            </span>
          </div>
          {userCart.discountTotal && (
            <div className="d-flex justify-content-between">
              <span>{t("Discount")}</span>
              <span>
                -
                {userCart.discountTotal.toLocaleString(
                  lang === "ar" ? "ar-EG" : "en-US"
                )}{" "}
                {lang === "ar" ? "جنيه" : "EGP"}
              </span>
            </div>
          )}
          <div className="total d-flex justify-content-between fw-bold">
            <span>{t("Total")}</span>
            <span>
              {userCart.grandTotal.toLocaleString(
                lang === "ar" ? "ar-EG" : "en-US"
              )}{" "}
              {lang === "ar" ? "جنيه" : "EGP"}
            </span>
          </div>
          {userCart.discountTotal && (
            <p
              className={`savings ${lang === "ar" ? "text-end" : "text-start"}`}
            >
              {t("TotalSavings")}{" "}
              {userCart.discountTotal.toLocaleString(
                lang === "ar" ? "ar-EG" : "en-US"
              )}{" "}
              {lang === "ar" ? "جنيه" : "EGP"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckOutPage;
