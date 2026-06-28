const trimTrailingSlash = (value) => value.replace(/\/+$/, "");

const apiBaseUrl = trimTrailingSlash(
    String(import.meta.env.VITE_API_BASE_URL || "http://localhost:4000")
);

const conf = {
    apiBaseUrl,
};

export default conf;
