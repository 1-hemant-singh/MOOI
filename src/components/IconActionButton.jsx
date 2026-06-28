import React from "react";

const ICONS = {
    like: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
    ),
    comment: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
        />
    ),
    edit: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
        />
    ),
    delete: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
        />
    ),
    reply: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
        />
    ),
};

const VARIANT_STYLES = {
    like: {
        idle: "text-lavender-purple-300 hover:bg-red-500/10 hover:text-red-400",
        active: "text-red-500 hover:bg-red-500/15 hover:text-red-400",
        iconActive: "fill-red-500 text-red-500",
        iconIdle: "fill-transparent",
        iconHover: "group-hover:text-red-400 group-hover:fill-red-400",
    },
    comment: {
        idle: "text-lavender-purple-300 hover:bg-mauve-magic-500/10 hover:text-mauve-magic-300",
        active: "text-mauve-magic-300 bg-mauve-magic-500/10 hover:bg-mauve-magic-500/15",
        iconActive: "fill-transparent text-mauve-magic-300",
        iconIdle: "fill-transparent",
        iconHover: "group-hover:text-mauve-magic-300",
    },
    edit: {
        idle: "text-lavender-purple-300 hover:bg-indigo-velvet-500/10 hover:text-indigo-velvet-300",
        active: "text-indigo-velvet-300 bg-indigo-velvet-500/10",
        iconActive: "fill-transparent text-indigo-velvet-300",
        iconIdle: "fill-transparent",
        iconHover: "group-hover:text-indigo-velvet-300",
    },
    delete: {
        idle: "text-lavender-purple-300 hover:bg-red-500/10 hover:text-red-400",
        active: "text-red-400 bg-red-500/10",
        iconActive: "fill-transparent text-red-400",
        iconIdle: "fill-transparent",
        iconHover: "group-hover:text-red-400",
    },
    reply: {
        idle: "text-lavender-purple-300 hover:bg-royal-violet-500/10 hover:text-royal-violet-300",
        active: "text-royal-violet-300 bg-royal-violet-500/10",
        iconActive: "fill-transparent text-royal-violet-300",
        iconIdle: "fill-transparent",
        iconHover: "group-hover:text-royal-violet-300",
    },
};

export default function IconActionButton({
    variant = "like",
    active = false,
    label,
    iconSize = "w-6 h-6",
    className = "",
    type = "button",
    ...props
}) {
    const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.like;

    return (
        <button
            type={type}
            className={`group flex items-center gap-2 rounded-full px-3 py-2 transition-all duration-300 ease-out ${
                active ? styles.active : styles.idle
            } ${className}`}
            {...props}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className={`${iconSize} shrink-0 transition-all duration-300 ease-out group-hover:scale-125 group-active:scale-95 ${
                    active ? styles.iconActive : styles.iconIdle
                } ${styles.iconHover}`}
            >
                {ICONS[variant]}
            </svg>
            {label ? <span className="text-sm font-medium">{label}</span> : null}
        </button>
    );
}
