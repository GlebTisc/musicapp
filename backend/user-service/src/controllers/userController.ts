import { catchAsync } from "../utils/catchAsync";
import type { Request, Response } from 'express';

/**
 * Get user info
 */
export const me = catchAsync(
    async (req: Request, res: Response) => {
        res.status(200).json({
            status: "success",
            data: { user: req.user }
        });
    }
);