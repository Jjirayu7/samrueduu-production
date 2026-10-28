import React from "react";

const sizes = {
    body_strong: "fs-6 fw-semibold", // fs-6 for font size, fw-semibold for bold
    headingxs: "fs-4 fw-semibold", // fs-4 for larger text
    headings: "fs-4 fw-bold", // fs-3 is for heading size
    headingmd: "fs-2 fw-semibold", // fs-2 is a bigger heading size
    headinglg: "fs-1 fw-bold", // fs-1 is the largest heading size
    headingx1: "display-1 fw-semibold", // display-1 for very large headings
    heading2x1: "display-2 fw-bold", // display-2 for an even larger heading
};

const Heading = ({ children, className = "", size = "headings", as, ...restProps }) => {
    const Component = as || "h6"; // default component to h6 if no "as" is provided

    return (
        <Component className={`${className} ${sizes[size]}`} {...restProps}>
            {children}
        </Component>
    );
};

export default Heading;
