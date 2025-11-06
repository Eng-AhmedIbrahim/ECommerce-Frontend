import { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import { FaFacebookF, FaInstagram, FaArrowUp } from "react-icons/fa";
import ThemeContext from "../../Context/themeContext/ThemeContext";
import "./Footer.css";
import minLogo from "../../assets/minLogo.png";

type Theme = "light" | "dark";

interface FooterLink {
  text: string;
  link: string;
  icon?: React.ReactElement;
}

const Footer: React.FC = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeContext is undefined");
  const [theme] = context as unknown as [Theme, any];

  const [ismob, setIsmob] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsmob(window.innerWidth < 992);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const socialIcons: FooterLink[] = [
    { text: "Facebook", link: "#", icon: <FaFacebookF /> },
    { text: "Instagram", link: "#", icon: <FaInstagram /> },
  ];

  const handleScrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      <div
        className={`back-to-top ${theme} ${ismob ? "mob-back-to-top" : ""}`}
        onClick={handleScrollToTop}
      >
        <FaArrowUp />
      </div>

      <footer className={`footer footer-dark`}>
        <Container className="footer-main text-center">
          {/* اللوغو */}
          <Row className="justify-content-center logo-div">
            <Col>
              <Image
                className="footer-logo rounded"
                src={minLogo}
                alt="Logo"
              />
            </Col>
          </Row>

          {/* السوشيال أيقونات */}
          <Row className="justify-content-center mb-3">
            <Col xs="auto" className="footer-social">
              {socialIcons.map((s, idx) => (
                <a key={idx} href={s.link} aria-label={s.text}>
                  {s.icon}
                </a>
              ))}
            </Col>
          </Row>

          {/* الكوبي رايت */}
          <Row className="justify-content-center">
            <Col xs="auto" className="footer-copyright">
              © {new Date().getFullYear()} Menem. All rights reserved.
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
};

export default Footer;
