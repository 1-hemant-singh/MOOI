import React from "react";

export default function Button({
    children,
    type = "button",
    bgColor = "bg-mauve-magic-600",
    textColor = "text-white",
    className = "",
    ...props
}) {
    return (
        <button className={`px-4 py-2 rounded-lg ${bgColor} ${textColor} shadow-sm shadow-mauve-950/40 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 ${className}`} type={type} {...props}>
            {children}
        </button>
    );
}
