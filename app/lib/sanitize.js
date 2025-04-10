export const sanitizeInput = (value) => {
    // Ensure value is a string
    if (typeof value !== "string") {
        return "";
    }

    // Whitelist regex of alphanumerics and common punctuation.
    const whitelist = /^[a-zA-Z0-9\s.,!?'"()@&%$#\-*]$/;

    // Remove non-whitelisted characters
    let sanitized = value.split('').filter(char => char.match(whitelist)).join('');

    // Limit input to 1000 characters.
    if (sanitized.length > 1000) {
        sanitized = sanitized.substring(0, 1000);
    }

    return sanitized;
};