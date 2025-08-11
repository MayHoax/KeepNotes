import React from "react";

function Button({ children, classes, ...props }) {
  return (
    <button
      className={`${`bg-lime-300`} p-2 border-2 border-b-4 rounded-2xl ${classes}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
