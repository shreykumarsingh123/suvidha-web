import { query } from '../db/postgres';

export interface UserRecord {
    id: number;
    mobileNumber: string;
    username?: string;
    otpEncrypted: string | null;
    otpExpires: Date | null;
    lastLogin: Date | null;
    createdAt: Date;
}

class UserRepository {
    async findById(id: number): Promise<UserRecord | null> {
        const result = await query<{
            id: number;
            mobile_number: string;
            username?: string;
            otp_encrypted: string | null;
            otp_expires: Date | null;
            last_login: Date | null;
            created_at: Date;
        }>(
            'SELECT id, mobile_number, username, otp_encrypted, otp_expires, last_login, created_at FROM users WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return null;
        }

        return this.mapRowToUser(result.rows[0]);
    }

    async findByMobileNumber(mobileNumber: string): Promise<UserRecord | null> {
        const result = await query<{
            id: number;
            mobile_number: string;
            username?: string;
            otp_encrypted: string | null;
            otp_expires: Date | null;
            last_login: Date | null;
            created_at: Date;
        }>(
            'SELECT id, mobile_number, username, otp_encrypted, otp_expires, last_login, created_at FROM users WHERE mobile_number = $1',
            [mobileNumber]
        );

        if (result.rows.length === 0) {
            return null;
        }

        return this.mapRowToUser(result.rows[0]);
    }

    async upsertUserOtp(mobileNumber: string, otpEncrypted: string, otpExpires: Date): Promise<UserRecord> {
        const result = await query<{
            id: number;
            mobile_number: string;
            username?: string;
            otp_encrypted: string | null;
            otp_expires: Date | null;
            last_login: Date | null;
            created_at: Date;
        }>(
            `INSERT INTO users (mobile_number, otp_encrypted, otp_expires)
             VALUES ($1, $2, $3)
             ON CONFLICT (mobile_number)
             DO UPDATE SET otp_encrypted = EXCLUDED.otp_encrypted,
                           otp_expires = EXCLUDED.otp_expires
             RETURNING id, mobile_number, username, otp_encrypted, otp_expires, last_login, created_at`,
            [mobileNumber, otpEncrypted, otpExpires]
        );

        return this.mapRowToUser(result.rows[0]);
    }

    async clearUserOtp(mobileNumber: string): Promise<UserRecord | null> {
        const result = await query<{
            id: number;
            mobile_number: string;
            username?: string;
            otp_encrypted: string | null;
            otp_expires: Date | null;
            last_login: Date | null;
            created_at: Date;
        }>(
            `UPDATE users
             SET otp_encrypted = NULL,
                 otp_expires = NULL,
                 last_login = NOW()
             WHERE mobile_number = $1
             RETURNING id, mobile_number, username, otp_encrypted, otp_expires, last_login, created_at`,
            [mobileNumber]
        );

        if (result.rows.length === 0) {
            return null;
        }

        return this.mapRowToUser(result.rows[0]);
    }

    async updateUsername(id: number, username: string): Promise<UserRecord | null> {
        const result = await query<{
            id: number;
            mobile_number: string;
            username?: string;
            otp_encrypted: string | null;
            otp_expires: Date | null;
            last_login: Date | null;
            created_at: Date;
        }>(
            'UPDATE users SET username = $1 WHERE id = $2 RETURNING id, mobile_number, username, otp_encrypted, otp_expires, last_login, created_at',
            [username, id]
        );

        if (result.rows.length === 0) {
            return null;
        }

        return this.mapRowToUser(result.rows[0]);
    }

    private mapRowToUser(row: {
        id: number;
        mobile_number: string;
        username?: string;
        otp_encrypted: string | null;
        otp_expires: Date | null;
        last_login: Date | null;
        created_at: Date;
    }): UserRecord {
        return {
            id: row.id,
            mobileNumber: row.mobile_number,
            username: row.username,
            otpEncrypted: row.otp_encrypted,
            otpExpires: row.otp_expires ? new Date(row.otp_expires) : null,
            lastLogin: row.last_login ? new Date(row.last_login) : null,
            createdAt: new Date(row.created_at),
        };
    }
}

export const userRepository = new UserRepository();

// Export legacy functions for backward compatibility with otp.service.ts
export const findUserByMobileNumber = (mobileNumber: string) => userRepository.findByMobileNumber(mobileNumber);
export const upsertUserOtp = (mobileNumber: string, otpEncrypted: string, otpExpires: Date) =>
    userRepository.upsertUserOtp(mobileNumber, otpEncrypted, otpExpires);
export const clearUserOtp = (mobileNumber: string) => userRepository.clearUserOtp(mobileNumber);
