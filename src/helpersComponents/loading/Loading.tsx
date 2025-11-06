import React, { useContext } from "react";
import ThemeContext from "../../Context/themeContext/ThemeContext";
import type { ThemeContextType } from "../../common/Common";

type SpinnerBarsProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
  className?: string;
};

const Loading: React.FC<SpinnerBarsProps> = ({
  size = 50,
  className,
  ...props
}) => {
  const context = useContext<ThemeContextType | undefined>(ThemeContext);

  if (!context) {
    throw new Error(
      "Loading component must be used within ThemeContext.Provider"
    );
  }

  const [theme] = context;

  const color = theme === "dark" ? "url(#gradient)" : "#3b82f6";

  // array لتحديد delays لكل بار
  const delays = [0, 0.2, 0.4];

  return (
    <svg
      height={size}
      width={size}
      viewBox="0 0 60 60"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={className}
    >
      <title>Loading...</title>

      {theme === "dark" && (
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b3b3b" />
            <stop offset="100%" stopColor="#5c55e9" />
          </linearGradient>
        </defs>
      )}

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scaleY(0.3); }
          40% { transform: scaleY(1); }
        }
      `}</style>

      {delays.map((delay, i) => (
        <rect
          key={i}
          x={5 + i * 20} // البعد بين البارات
          y={15}
          width={10}
          height={30}
          rx={5}
          fill={color}
          style={{
            transformOrigin: "center bottom",
            animation: `bounce 1s ease-in-out ${delay}s infinite`,
          }}
        />
      ))}
    </svg>
  );
};

export default Loading;
