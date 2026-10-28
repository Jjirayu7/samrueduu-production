import React from "react";
import PropTypes from "prop-types";

const shapes = {
    round: "rounded-3",
};

const variants = {
    fill: {
        orange_50: "btn btn-warning text-dark", // Bootstrap classes
        blue_gray_200: "btn btn-secondary",
        purple_900: "btn btn-dark text-white",
        gray_50: "btn btn-light text-dark",
    },
};

const sizes = {
    sm: "btn-sm", // Bootstrap size class for small
    xl: "btn-lg", // Bootstrap size class for extra large
    lg: "btn-lg", // Bootstrap large
    xs: "", // No specific xs class in Bootstrap
    md: "", // Default size (medium)
};

const Button = ({
    children,
    className = "",
    leftIcon,
    rightIcon,
    shape,
    variant = "fill",
    size = "xs",
    color = "gray_50",
    ...restProps
}) => {
    return (
        <button
            className={`${className} ${shapes[shape]} ${sizes[size]} ${variant && variants[variant]?.[color]}`}
            {...restProps}
        >
            {!!leftIcon && leftIcon}
            {children}
            {!!rightIcon && rightIcon}
        </button>
    );
};

Button.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    leftIcon: PropTypes.node,
    rightIcon: PropTypes.node,
    shape: PropTypes.oneOf(["round"]),
    size: PropTypes.oneOf(["sm", "xl", "lg", "xs", "md"]),
    variant: PropTypes.oneOf(["fill"]),
    color: PropTypes.oneOf(["orange_50", "blue_gray_200", "purple_900", "gray_50"]),
};

export default Button;
