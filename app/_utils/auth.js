import jwt from "jsonwebtoken";

// Helper function to verify JWT token
export function verifyToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error("Invalid token");
    }
}
