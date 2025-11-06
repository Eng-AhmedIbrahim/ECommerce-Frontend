import { lazy, useContext, useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import ThemeContext from "../../../Context/themeContext/ThemeContext";
import useGetCarousels from "../../../Hooks/CarouselsHooks/useGetCarousels";
import type {
  CarouselDate,
  useQueryCarouselResponseType,
} from "../../../common/Common";

import "./HomeCarousel.css";
import { useTranslation } from "react-i18next";

const Loading = lazy(
  () => import("../../../helpersComponents/loading/Loading")
);

export default function HomeCarousel() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("Theme Context is undefined");
  const [theme] = context;

  const [carouselHeight, setCarouselHeight] = useState<number>(0);

  const seedsSlides: CarouselDate[] = [
    {
      id: 1,
      imageUrl: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a",
      englishTitle: "First slide label",
      englishDescription: "Fallback slide content",
      arabicDescription: "العرض الأول",
      arabicTitle: "العرض الأول",
    },
    {
      id: 2,
      imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
      englishTitle: "Second slide label",
      englishDescription: "Fallback slide content",
      arabicDescription: "العرض التاني",
      arabicTitle: "العرض التاني",
    },
    {
      id: 3,
      imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
      englishTitle: "Third slide label",
      englishDescription: "Fallback slide content",
      arabicDescription: "العرض الثالث",
      arabicTitle: "العرض الثالث",
    },
  ];

  const { i18n } = useTranslation();
  const lang = i18n.language || "en";

  const [slides, setSlides] = useState<CarouselDate[]>(seedsSlides);

  const { data, error, isLoading }: useQueryCarouselResponseType =
    useGetCarousels();

  useEffect(() => {
    if (data && data.length > 0) setSlides(data);
    else setSlides(seedsSlides);
  }, [data]);

  useEffect(() => {
    const resizeCarousel = () => {
      const header = document.querySelector(
        ".navbar-custom"
      ) as HTMLElement | null;
      const mobNav = document.querySelector(
        ".mobile-bottom-nav"
      ) as HTMLElement | null;

      let totalHeight = 0;
      if (header) totalHeight += header.offsetHeight;
      if (mobNav) totalHeight += mobNav.offsetHeight;

      setCarouselHeight(totalHeight);
    };

    resizeCarousel();
    window.addEventListener("resize", resizeCarousel);
    return () => window.removeEventListener("resize", resizeCarousel);
  }, []);

  if (isLoading) return <Loading />;

  if (error) console.error("Carousel API error:", error);

  return (
    <div style={{ width: "100%", overflow: "hidden" }}>
      <Carousel
        data-bs-theme={theme === "dark" ? "dark" : "light"}
        interval={2000}
        indicators
        controls
        fade
        style={{ height: `calc(100vh - ${carouselHeight}px)` }}
      >
        {slides
          .sort((a, b) => {
            const aIndex = a.index ?? 0;
            const bIndex = b.index ?? 0;

            if (aIndex === 0 && bIndex !== 0) return 1; 
            if (aIndex !== 0 && bIndex === 0) return -1;
            return aIndex - bIndex;
          })
          .map((slide, index) => (
            <Carousel.Item key={slide.id || index}>
              <img
                className="carousel-image d-block w-100"
                src={slide.imageUrl}
                alt={`Slide ${index + 1}`}
                style={{
                  width: "100%",
                  height: `calc(100vh - ${carouselHeight}px)`,
                  objectFit: "fill",
                  objectPosition: "center",
                }}
              />
              {(slide.arabicDescription !== null ||
                slide.englishDescription !== null ||
                slide.arabicTitle !== null ||
                slide.englishTitle !== null) && (
                <Carousel.Caption
                  style={{
                    bottom: "60px",
                    backgroundColor: "rgba(0,0,0,0.4)",
                    borderRadius: "8px",
                    padding: "10px 15px",
                    backdropFilter: "blur(3px)",
                  }}
                >
                  <h3 style={{ fontWeight: "600", color: "#fff" }}>
                    {(slide.englishTitle || slide.arabicTitle) &&
                      (lang === "en" ? slide.englishTitle : slide.arabicTitle)}
                  </h3>
                  <p style={{ fontSize: "0.95rem", color: "#f0f0f0" }}>
                    {(slide.englishDescription || slide.arabicDescription) &&
                      (lang === "en"
                        ? slide.englishDescription
                        : slide.arabicDescription)}
                  </p>
                </Carousel.Caption>
              )}
            </Carousel.Item>
          ))}
      </Carousel>
    </div>
  );
}
