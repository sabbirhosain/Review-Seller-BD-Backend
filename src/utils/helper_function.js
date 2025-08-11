import JWT from "jsonwebtoken"

export const createJSONWebToken = (payload, secretKey, expiresIn) => {
    if (typeof payload !== 'object' || !payload) {
        throw new Error("Payload must be a non-empty object");
    }
    if (typeof secretKey !== 'string' || secretKey === '') {
        throw new Error("Secret key must be a non-empty string");
    }
    if (typeof expiresIn !== 'string' && typeof expiresIn !== 'number') {
        throw new Error("expiresIn must be a non-empty string or a number");
    }
    try {
        return JWT.sign(payload, secretKey, { expiresIn })
    } catch (error) {
        throw new Error(error.message || 'JWT Internal Server Error');
    }
}


// Format date ( 2025-04-13 to 13-04-2025 )
export const formatDateOnly = (input) => {
    const date = new Date(input);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}