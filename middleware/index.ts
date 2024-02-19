import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../service/user";

// single middleware works for the multiple roles ...
export const checkRole =
  (requiredRole: string) =>
  (req: Request & { user: any }, res: Response, next: NextFunction) => {
    const authToken = req.headers["authorization"]?.split(" ")[1];
     const cookieToken = req?.cookies?.token;
    let token;
    if (authToken) {
      token = authToken;
    } else {
      token = cookieToken;
    }
    //console.log("Token by Abid Husain...", { token });
    if (!token) {
      return res.status(403).json({
        error: {
          code: "FORBIDDEN_ACCESS",
          message:
            "Sorry, you do not have the necessary permissions to perform this action.",
          details: "Please contact your administrator for assistance.",
        },
      });
    }
    try {
      const decoded = verifyJWT(token);
      //console.log({ decoded });
      if (!decoded || !decoded.user || decoded.user.role !== requiredRole) {
        return res.status(403).json({
          error: {
            code: "FORBIDDEN_ACCESS",
            message:
              "Sorry, you do not have the necessary permissions to perform this action.",
            details: "Please contact your administrator for assistance.",
          },
        });
      }
      req.user = decoded.user;
      next();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

export const isUser = checkRole("User");
