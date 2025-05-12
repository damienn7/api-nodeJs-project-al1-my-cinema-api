import jwt from "jsonwebtoken";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { ObjectSchema } from 'joi';
import { UserAuthRequest } from "../types/express";
import { UserRole } from "../types/user";

export const validateAuthBody = (schema: ObjectSchema) : RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) : void => {
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }
    next();
  };
};


export const validateAuthQuery = (schema: ObjectSchema) : RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) : void => {
    const { error } = schema.validate(req.query);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return
    }
    next();
  };
};

export const authMiddleware = (req: UserAuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (
        !authHeader
        || !authHeader.startsWith("Bearer ")
        || authHeader.split(' ')[1].length < 7) {
        res.status(401).json({ message: "Unauthorized" });
        return
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {id: number, role: UserRole};
        req.user = {id: decoded.id, role: decoded.role};
        next();
    } catch (err) {
        res.status(403).json({ message: "Invalid or expired token" });
        return
    }
};

export const authRoles = (...allowedRoles: UserRole[]): RequestHandler => {
  return (req: UserAuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const userRole = req.user.role;
    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({ message: 'Forbidden: insufficient role' });
      return;
    }

    next();
  };
};