import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.js";
export declare function registerHandler(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function loginHandler(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function meHandler(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function googleLoginHandler(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=auth.controller.d.ts.map