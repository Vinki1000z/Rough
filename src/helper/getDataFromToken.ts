import jwt from "jsonwebtoken";

// Define an interface for the decoded token structure
interface DecodedToken {
  id: string; // Or use the correct type for the id field (e.g., number or string)
  // You can add other fields if necessary, based on your token's payload
}

export const getDataFromToken = (): string => {
  try {
    // Check if we are on the client side before accessing sessionStorage
    if (typeof window === "undefined") {
      throw new Error("sessionStorage is only available on the client side");
    }

    const token = sessionStorage.getItem("token") || '';
    if (!token) {
      throw new Error("No token found in session storage");
    }

    // Decode the token with the correct type
    const decodedToken = jwt.verify(token, 'your_jwt_secret') as DecodedToken;
    return decodedToken.id;
  } catch (error) {
    throw new Error(error.message);
  }
};
