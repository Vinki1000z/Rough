import jwt from "jsonwebtoken";

// interface DecodedToken {
//   id: string;
//   // Add other properties of your token payload if needed
// }

export const getDataFromToken = (): string | null | void=> {
  try {
    const token = sessionStorage.getItem("token") || '';
    console.log(token);
    const decodedToken = jwt.verify(token, "your_jwt_secret") ;
    console.log(decodedToken);
    if (typeof decodedToken === "object" && decodedToken && "userId" in decodedToken) {
      return decodedToken.userId as string;
    }

    throw new Error("Invalid token structure: missing 'id'");
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
