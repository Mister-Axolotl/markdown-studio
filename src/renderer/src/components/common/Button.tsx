import React from "react";
import "../layout/Button.scss";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "text";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "medium",
  fullWidth = false,
  disabled = false,
  onClick,
}) => {
  const classNames = [
    "btn",
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? "btn--full-width" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classNames} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
