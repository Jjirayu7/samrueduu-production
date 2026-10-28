import React from "react";

const sizes = {
  body_base: "fs-5", // 16px
  textxs: "fs-6", // 14px
  texts: "fs-4", // 20px
  textmd: "fs-3", // 24px
};

const Text = ({ children, className = "", as, size = "textmd", ...restProps }) => {
  const Component = as || "p";

  return (
    <Component className={`text-dark ${sizes[size]} ${className}`} {...restProps}>
      {children}
    </Component>
  );
};

export default Text;
