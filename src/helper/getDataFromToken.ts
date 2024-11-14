import jwt from "jsonwebtoken";

export const getDataFromToken = () => {
    try {
        const token = sessionStorage.getItem("token") || '';
        if (!token) {
            throw new Error("No token found in session storage");
        }
        const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);
        return decodedToken.id;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
