import React, { useContext } from "react";
import { FaExclamationTriangle, FaRedo } from "react-icons/fa";
import ThemeContext from "../../Context/themeContext/ThemeContext";
import "./ErrorPage.css"; 
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

type ErrorPageProps = {
  error?: Error | null;
  errorInfo?: React.ErrorInfo | null;
  onReload?: () => void;
};

export default function ErrorPage({ onReload }: ErrorPageProps) {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("Error at ThemeContext");
  const [theme] = context;

  const buttonVariant = theme === "dark" ? "primary" : "info";

  return (
    <Container fluid className="error-page-container d-flex align-items-center justify-content-center">
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={4}>
          <Card className="error-page-card text-center p-4 border-0">
            <Card.Body>
              <FaExclamationTriangle className="mb-3 error-page-icon" />

              <Card.Title className="h3 fw-bold mb-3">
                Something went wrong 😕
              </Card.Title>

              <Card.Text className="mb-4 text-muted">
                We encountered an unexpected issue while loading this page.
              </Card.Text>

              <Button
                onClick={onReload}
                variant={buttonVariant}
                className="error-page-button d-flex align-items-center justify-content-center mx-auto shadow-lg"
              >
                <FaRedo className="me-2" />
                Reload Page
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
