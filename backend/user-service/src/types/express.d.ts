import { UserResponse } from "../services/authService";

export { };

declare global {
    namespace Express {
        interface Request {
            user?: UserResponse;
            validated?: unknown;
            validatedQuery?: unknown;
        }
    }
}