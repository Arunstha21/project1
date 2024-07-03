const jwtSecretKey = process.env.JWT_KEY;
import jwt from "jsonwebtoken"

export const dcryptToken = (req) => {
    try {
        const token = req.cookies.get("token")?.value || '';
        const decodedToken = jwt.verify(token, jwtSecretKey);

        return decodedToken.id;
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            res.clearCookie('token');
        }
    }
}