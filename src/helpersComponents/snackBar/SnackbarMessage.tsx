import React from "react";
import { Snackbar, Alert, useTheme } from "@mui/material";

interface SnackbarMessageProps {
  open: boolean;
  message: string;
  type?: "success" | "error" | "warning" | "info";
  onClose: () => void;
  duration?: number;
}

const SnackbarMessage: React.FC<SnackbarMessageProps> = ({
  open,
  message,
  type = "info",
  onClose,
  duration = 3000,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const getAlertStyles = () => {
    const baseStyles = {
      width: "100%",
      fontSize: "0.95rem",
      borderRadius: "10px",
      boxShadow: "0 6px 12px rgba(0,0,0,0.25)",
      border: `1px solid ${isDark ? "#1f80be33" : "#1A448F22"}`,
    };

    const colors = {
      success: {
        backgroundColor: isDark ? "#1A448F" : "#1f80be",
        color: "#fff",
      },
      error: {
        backgroundColor: isDark ? "#d32f2f" : "#ef5350",
        color: "#fff",
      },
      warning: {
        backgroundColor: isDark ? "#ffb300" : "#fbc02d",
        color: isDark ? "#1a1a1a" : "#000",
      },
      info: {
        backgroundColor: isDark ? "#1976d2" : "#2196f3",
        color: "#fff",
      },
    };

    return { ...baseStyles, ...colors[type] };
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        onClose={onClose}
        icon={false}
        sx={getAlertStyles()}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarMessage;
