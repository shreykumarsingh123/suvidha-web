import { Request } from 'express';

/**
 * Authenticated user payload from JWT token
 * Contains user identification information decoded from the JWT
 */
export interface AuthUser {
    /** User's unique identifier */
    id: number;
    /** User's mobile number (primary identifier) */
    mobileNumber: string;
}

/**
 * Extended Express Request with authenticated user information
 * Used in protected routes that require authentication
 * 
 * @example
 * ```typescript
 * import { AuthRequest } from '../types/auth.types';
 * 
 * export const getProfile = async (req: AuthRequest, res: Response) => {
 *     const userId = req.user?.id;
 *     // ... handle request
 * };
 * ```
 */
export interface AuthRequest extends Request {
    /** Authenticated user information from JWT token */
    user?: AuthUser;
}
