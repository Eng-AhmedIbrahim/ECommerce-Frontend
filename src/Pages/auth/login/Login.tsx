import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  InputGroup,
} from "react-bootstrap";
import { Envelope, Lock, ArrowRightShort } from "react-bootstrap-icons";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import logo from "../../../assets/minLogo.png";
import { Link, useNavigate } from "react-router-dom";
import { useLoginApiMutation } from "../../../Services/AuthApi";
import "./Login.css";

const IllustrationPlaceholder = () => (
  <div className="illustration-wrapper">
    <div className="abstract-shape shape-1"></div>
    <div className="abstract-shape shape-2"></div>
    <div className="abstract-figure animated-logo">
      <img src={logo} alt="logo" className="logo-img" />
    </div>
  </div>
);

const SignIn = () => {
  const navigate = useNavigate();
  const [loginApi, { isLoading }] = useLoginApiMutation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loginError, setLoginError] = useState<string>("");

  const validateField = (name: string, value: string | boolean) => {
    switch (name) {
      case "email":
        if (!value) return "Email is required";
        if (typeof value === "string" && !/^\S+@\S+\.\S+$/.test(value))
          return "Invalid email format";
        return "";
      case "password":
        if (!value) return "Password is required";
        if (typeof value === "string" && value.length < 6)
          return "Password must be at least 6 characters";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, type, value, checked } = e.target;

    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });

      const errorMsg = validateField(name, value);
      setFormErrors({ ...formErrors, [name]: errorMsg });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    Object.entries(formData).forEach(([key, value]) => {
      const err = validateField(key, value);
      if (err) newErrors[key] = err;
    });

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    try {
      setLoginError("");

      await loginApi({
        credentials: {
          email: formData.email,
          password: formData.password,
        },
        rememberMe: formData.rememberMe,
      }).unwrap();

      const successPopup = document.createElement("div");
      successPopup.textContent = "Login successful 🎉";
      successPopup.className = "popup-message success";
      document.body.appendChild(successPopup);
      setTimeout(() => successPopup.remove(), 2500);

      navigate("/");
    } catch (err: any) {
      console.error("Login failed:", err);
      setLoginError(err?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="signin-page-container">
      <Container fluid className="p-0 h-100">
        <Row className="g-0 justify-content-center align-items-center h-100">
          <Col xs={11} sm={10} md={10} lg={9} xl={8}>
            <Card
              className="premium-card shadow-lg"
              style={{ height: "95vh", maxHeight: "95vh" }}
            >
              <Row className="g-0 flex-row-reverse h-100">
                <Col md={7} className="p-3 p-md-4">
                  <h3
                    className="fw-bolder mb-3 text-center"
                    style={{ color: "#F03A37" }}
                  >
                    Welcome Back!
                  </h3>
                  <p className="text-muted mb-4 fs-6 text-center">
                    Sign in to your account and continue your journey
                  </p>

                  {loginError && (
                    <div className="error-popup text-center mb-3">
                      {loginError}
                    </div>
                  )}

                  <Form onSubmit={handleSubmit}>
                    {/* Email */}
                    <Form.Group className="mb-4 position-relative">
                      {formErrors.email && (
                        <div className="error-popup">{formErrors.email}</div>
                      )}
                      <InputGroup className="custom-input-group">
                        <Envelope className="custom-input-icon" />
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="Email Address"
                          value={formData.email}
                          onChange={handleChange}
                          isInvalid={!!formErrors.email}
                        />
                      </InputGroup>
                    </Form.Group>

                    {/* Password */}
                    <Form.Group className="mb-4 position-relative">
                      {formErrors.password && (
                        <div className="error-popup">{formErrors.password}</div>
                      )}
                      <InputGroup className="custom-input-group">
                        <Lock className="custom-input-icon" />
                        <Form.Control
                          type="password"
                          name="password"
                          placeholder="Password"
                          value={formData.password}
                          onChange={handleChange}
                          isInvalid={!!formErrors.password}
                        />
                      </InputGroup>
                    </Form.Group>

                    <Row className="mb-4">
                      <Col md={6}>
                        <Form.Check
                          type="checkbox"
                          name="rememberMe"
                          label={
                            <span
                              className="text-secondary"
                              style={{ fontSize: "0.9rem" }}
                            >
                              Remember me
                            </span>
                          }
                          checked={formData.rememberMe}
                          onChange={handleChange}
                        />
                      </Col>
                      <Col md={6} className="text-end">
                        <Link
                          to="/forgot-password"
                          className="fw-bold forgot-password"
                          style={{ fontSize: "0.9rem" }}
                        >
                          Forgot Password?
                        </Link>
                      </Col>
                    </Row>

                    <Button
                      type="submit"
                      className="w-100 fw-bold custom-signin-button mb-4"
                      disabled={
                        Object.values(formErrors).some((e) => e !== "") ||
                        isLoading
                      }
                    >
                      {isLoading ? "Signing In..." : "Sign In"}
                      <ArrowRightShort
                        size={20}
                        className="ms-2 button-arrow"
                      />
                    </Button>

                    <div className="text-center mt-4 mb-4">
                      <span className="text-muted">Or Continue With:</span>
                    </div>

                    <div className="d-flex justify-content-center gap-4 social-login-buttons">
                      <Button
                        variant="outline-light"
                        className="social-icon-button google"
                        onClick={() => console.log("Google Login")}
                        title="Sign in with Google"
                      >
                        <FcGoogle size={26} />
                      </Button>

                      <Button
                        variant="outline-light"
                        className="social-icon-button facebook"
                        onClick={() => console.log("Facebook Login")}
                        title="Sign in with Facebook"
                      >
                        <FaFacebookF size={26} style={{ color: "#b92121ff" }} />
                      </Button>
                    </div>
                  </Form>

                  <p
                    className="text-center mt-4 mb-0 text-muted"
                    style={{ fontSize: "0.95rem" }}
                  >
                    Don't have an account?{" "}
                    <Link to="/signup" className="fw-bold text-decoration-none forgot-password">
                      Sign up here
                    </Link>
                  </p>
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

export default SignIn;
