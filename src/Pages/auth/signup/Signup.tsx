import { useRef, useState } from "react";
import type { UserRegisterDto } from "../../../common/AuthTypes";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Image,
  InputGroup,
} from "react-bootstrap";
import {
  Person,
  PersonCircle,
  Envelope,
  Phone,
  CalendarDate,
  Lock,
  Camera,
  ArrowLeftShort,
} from "react-bootstrap-icons";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import logo from "../../../assets/minLogo.png";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterApiMutation } from "../../../Services/AuthApi";
import { useTranslation } from "react-i18next";

import "../login/Login.css";

const IllustrationPlaceholder = () => (
  <div className="illustration-wrapper">
    <div className="abstract-shape shape-1"></div>
    <div className="abstract-shape shape-2"></div>
    <div className="abstract-figure animated-logo">
      <img src={logo} alt="logo" className="logo-img" />
    </div>
  </div>
);

const SignUp = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<
    UserRegisterDto & { confirmPassword: string }
  >({
    fullName: "",
    userName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    hasAcceptedTerms: false,
    password: "",
    confirmPassword: "",
    profilePicture: null,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const [registerApi] = useRegisterApiMutation();
  const [preview, setPreview] = useState<string | null>(null);

  // Validation function
  const validateField = (name: string, value: any) => {
    switch (name) {
      case "fullName":
        if (!value.trim()) return "Full name is required";
        if (value.length > 100) return "Full name cannot exceed 100 characters";
        return "";

      case "userName":
        if (!value.trim()) return "Username is required";
        if (/\s/.test(value)) return "Username cannot contain spaces";
        if (value.length < 3) return "Username must be at least 3 characters";
        if (value.length > 50) return "Username cannot exceed 50 characters";
        return "";

      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^\S+@\S+\.\S+$/.test(value)) return "Invalid email format";
        return "";

      case "phoneNumber":
        if (!value.trim()) return "Phone number is required";
        if (!/^[0-9]{11}$/.test(value)) return "Phone number must be 11 digits";
        return "";

      case "password":
        if (!value) return "Password is required";
        const errors: string[] = [];
        if (!/[A-Z]/.test(value)) errors.push("at least one uppercase");
        if (!/[a-z]/.test(value)) errors.push("at least one lowercase");
        if (!/[0-9]/.test(value)) errors.push("at least one number");
        if (!/[^a-zA-Z0-9]/.test(value))
          errors.push("at least one special character");
        if (value.length < 6) errors.push("at least 6 characters");
        if (value.length > 50) errors.push("max 50 characters");
        return errors.join(", ");

      case "confirmPassword":
        if (value !== formData.password) return "Passwords do not match";
        return "";

      case "hasAcceptedTerms":
        if (!value) return "You must accept the terms and conditions";
        return "";

      default:
        return "";
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<any>) => {
    const target = e.target;

    if (target instanceof HTMLInputElement) {
      const { name, type, value, checked, files } = target;

      if (type === "checkbox") {
        setFormData({ ...formData, [name]: checked });
      } else if (type === "file" && files && files.length > 0) {
        const file = files[0];
        setFormData({ ...formData, profilePicture: file });
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        let newValue = value;
        let newErrors = { ...formErrors };

        if (name === "userName") {
          if (/\s/.test(newValue)) {
            newErrors.userName = "Username cannot contain spaces.";
            newValue = newValue.replace(/\s/g, "");
          } else if (newValue.trim() === "") {
            newErrors.userName = "Username is required.";
          } else {
            delete newErrors.userName;
          }
        }

        setFormData({ ...formData, [name]: newValue });
        setFormErrors(newErrors);
      }
    } else if (
      target instanceof HTMLSelectElement ||
      target instanceof HTMLTextAreaElement
    ) {
      const { name, value } = target;
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ التحقق من الأخطاء
    const newErrors: Record<string, string> = {};
    Object.entries(formData).forEach(([key, value]) => {
      const err = validateField(key, value);
      if (err) newErrors[key] = err;
    });

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    // ✅ تجهيز البيانات للإرسال
    const dataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "confirmPassword" || value === null) return;
      if (typeof value === "boolean")
        dataToSend.append(key, value ? "true" : "false");
      else if (value instanceof File) dataToSend.append(key, value, value.name);
      else dataToSend.append(key, value as string);
    });

    try {
      const data = await registerApi(dataToSend).unwrap();

      // ✅ عرض رسالة نجاح
      const successPopup = document.createElement("div");
      successPopup.textContent = "Registration successful 🎉 Redirecting...";
      successPopup.className = "popup-message success";
      document.body.appendChild(successPopup);
      setTimeout(() => successPopup.remove(), 2500);

      // ✅ تنظيف البيانات
      setFormData({
        fullName: "",
        userName: "",
        email: "",
        phoneNumber: "",
        dateOfBirth: "",
        hasAcceptedTerms: false,
        password: "",
        confirmPassword: "",
        profilePicture: null,
      });
      setFormErrors({});
      setPreview(null);
      formRef.current?.reset();

      console.log("Registration success:", data);

      // ✅ بعد النجاح نعمل Redirect لصفحة Login
      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (err: any) {
      console.error("Registration failed:", err);

      const errorMessage =
        err?.status === 400 && err?.data?.message
          ? err.data.message
          : "Something went wrong, please try again later.";

      const errorPopup = document.createElement("div");
      errorPopup.textContent = errorMessage;
      errorPopup.className = "popup-message error";
      document.body.appendChild(errorPopup);
      setTimeout(() => errorPopup.remove(), 4000);
    }
  };

  return (
    <div className="signup-page-container">
      <Container fluid className="p-0 h-100">
        <Row className="g-0 justify-content-center align-items-center h-100">
          <Col xs={11} sm={10} md={10} lg={9} xl={8}>
            <Card className="premium-card shadow-lg">
              <Row className="g-0 flex-row-reverse h-100">
                <Col md={7} className="p-3 p-md-4">
                  <h3
                    className="fw-bolder mb-3 text-center"
                    style={{ color: "#F03A37" }}
                  >
                    {t("CreateYourAccount")}
                  </h3>
                  <p className="text-muted mb-4 fs-6 text-center">
                    {t("SigninyourjourneySignup")}
                  </p>

                  <Form ref={formRef} onSubmit={handleSubmit}>
                    <Form.Group className="d-flex justify-content-center mb-4 position-relative">
                      {formErrors.profilePicture && (
                        <div className="error-popup text-center">
                          {formErrors.profilePicture}
                        </div>
                      )}

                      <div
                        className="profile-picture-uploader"
                        onClick={() =>
                          document
                            .getElementById("profilePictureInput")
                            ?.click()
                        }
                      >
                        {preview ? (
                          <Image
                            src={preview}
                            alt="Profile Preview"
                            roundedCircle
                            fluid
                          />
                        ) : (
                          <div className="bg-light text-secondary d-flex flex-column align-items-center justify-content-center">
                            <Camera size={20} className="mb-1" />
                            <small>{t("UploadPhoto")}</small>
                          </div>
                        )}
                      </div>

                      <Form.Control
                        type="file"
                        accept="image/*"
                        name="profilePicture"
                        onChange={handleChange}
                        className="visually-hidden"
                        id="profilePictureInput"
                      />
                    </Form.Group>

                    <Row className="g-2">
                      <Col md={6}>
                        <div className="position-relative mb-3">
                          {formErrors.fullName && (
                            <div className="error-popup">
                              {formErrors.fullName}
                            </div>
                          )}

                          <InputGroup className="custom-input-group">
                            <Person className="custom-input-icon" />
                            <Form.Control
                              type="text"
                              name="fullName"
                              placeholder={t("FullName")}
                              value={formData.fullName}
                              onChange={handleChange}
                              isInvalid={!!formErrors.fullName}
                            />
                          </InputGroup>
                        </div>
                      </Col>

                      <Col md={6}>
                        <div className="position-relative mb-3">
                          {formErrors.userName && (
                            <div className="error-popup">
                              {formErrors.userName}
                            </div>
                          )}

                          <InputGroup className="custom-input-group">
                            <PersonCircle className="custom-input-icon" />
                            <Form.Control
                              type="text"
                              name="userName"
                              placeholder={t("UserName")}
                              value={formData.userName}
                              onChange={handleChange}
                              isInvalid={!!formErrors.userName}
                            />
                          </InputGroup>
                        </div>
                      </Col>

                      {/* Email */}
                      <Col md={6}>
                        <div className="position-relative mb-3">
                          {formErrors.email && (
                            <div className="error-popup">
                              {formErrors.email}
                            </div>
                          )}
                          <InputGroup className="custom-input-group">
                            <Envelope className="custom-input-icon" />
                            <Form.Control
                              type="email"
                              name="email"
                              placeholder={t("EmailAddress")}
                              value={formData.email}
                              onChange={handleChange}
                              isInvalid={!!formErrors.email}
                            />
                          </InputGroup>
                        </div>
                      </Col>

                      {/* Phone */}
                      {/* Phone Number */}
                      <Col md={6}>
                        <div className="position-relative mb-3">
                          {formErrors.phoneNumber && (
                            <div className="error-popup">
                              {formErrors.phoneNumber}
                            </div>
                          )}
                          <InputGroup className="custom-input-group">
                            <Phone className="custom-input-icon" />
                            <Form.Control
                              type="tel"
                              name="phoneNumber"
                              placeholder={t("PhoneNumber")}
                              value={formData.phoneNumber}
                              onChange={handleChange}
                              isInvalid={!!formErrors.phoneNumber}
                            />
                          </InputGroup>
                        </div>
                      </Col>

                      {/* Date of Birth */}
                      <Col md={6}>
                        <div className="position-relative mb-3">
                          {formErrors.dateOfBirth && (
                            <div className="error-popup">
                              {formErrors.dateOfBirth}
                            </div>
                          )}
                          <InputGroup className="custom-input-group date-input-group">
                            <CalendarDate className="custom-input-icon" />
                            <Form.Control
                              type="date"
                              name="dateOfBirth"
                              value={formData.dateOfBirth}
                              onChange={handleChange}
                              isInvalid={!!formErrors.dateOfBirth}
                            />
                          </InputGroup>
                        </div>
                      </Col>

                      {/* Password */}
                      <Col md={6}>
                        <div className="position-relative mb-3">
                          {formErrors.password && (
                            <div className="error-popup">
                              {formErrors.password}
                            </div>
                          )}
                          <InputGroup className="custom-input-group">
                            <Lock className="custom-input-icon" />
                            <Form.Control
                              type="password"
                              name="password"
                              placeholder={t("CreatePassword")}
                              value={formData.password}
                              onChange={handleChange}
                              isInvalid={!!formErrors.password}
                            />
                          </InputGroup>
                        </div>
                      </Col>

                      {/* Confirm Password */}
                      <Col md={6}>
                        <div className="position-relative mb-3">
                          {formErrors.confirmPassword && (
                            <div className="error-popup">
                              {formErrors.confirmPassword}
                            </div>
                          )}
                          <InputGroup className="custom-input-group">
                            <Lock className="custom-input-icon" />
                            <Form.Control
                              type="password"
                              name="confirmPassword"
                              placeholder={t("ConfirmPassword")}
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              isInvalid={!!formErrors.confirmPassword}
                            />
                          </InputGroup>
                        </div>
                      </Col>
                    </Row>

                    {/* Terms */}
                    <Form.Group className="mt-4 mb-4 position-relative">
                      {formErrors.hasAcceptedTerms && (
                        <div
                          className="error-popup"
                          style={{ top: "-25px", left: "0" }}
                        >
                          {formErrors.hasAcceptedTerms}
                        </div>
                      )}
                      <Form.Check
                        type="checkbox"
                        name="hasAcceptedTerms"
                        label={
                          <span
                            className="text-secondary"
                            style={{ fontSize: "0.9rem" }}
                          >
                            {t("Iagreetothe")}{" "}
                            <a href="#" className="fw-bold forgot-password">
                              {t("TermsConditions")}
                            </a>
                          </span>
                        }
                        checked={formData.hasAcceptedTerms}
                        onChange={handleChange}
                        isInvalid={!!formErrors.hasAcceptedTerms}
                      />
                    </Form.Group>

                    <Button
                      type="submit"
                      className="w-100 fw-bold custom-signin-button mb-4"
                      disabled={Object.values(formErrors).some((e) => e !== "")}
                    >
                      Create Account
                      <ArrowLeftShort size={20} className="ms-2 button-arrow" />
                    </Button>

                    <div className="text-center mt-4 mb-4">
                      <span className="text-muted">{t("OrContinueWith")}:</span>
                    </div>


                    <div className="d-flex justify-content-center gap-4 social-login-buttons">
                      <Button
                        variant="outline-light"
                        className="social-icon-button google"
                        onClick={() => console.log("Google Login")}
                        title="Sign up with Google"
                      >
                        <FcGoogle size={26} />
                      </Button>

                      <Button
                        variant="outline-light"
                        className="social-icon-button facebook"
                        onClick={() => console.log("Facebook Login")}
                        title="Sign up with Facebook"
                      >
                        <FaFacebookF size={20} color="#b92121ff" />
                      </Button>
                    </div>

                    <p className="text-center mt-4 text-muted fs-7">
                      {t("Alreadyhaveaccount")}?{" "}
                      <Link to="/login" className="fw-bold forgot-password">
                        Login
                      </Link>
                    </p>
                  </Form>
                </Col>

                <Col md={5} className="d-none d-md-block illustration-col p-0">
                  <IllustrationPlaceholder />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SignUp;
