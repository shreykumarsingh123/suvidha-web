import { query } from '../db/postgres';

export interface UserRecord {
    id: number;
    mobileNumber: string;
    otpEncrypted: string | null;
    otpExpires: Date | null;
    lastLogin: Date | null;
    createdAt: Date;
}

const mapRowToUser = (row: {
    id: number;
    mobile_number: string;
    otp_encrypted: string | null;
    otp_expires: Date | null;
    last_login: Date | null;
    created_at: Date;
}): UserRecord => ({
    id: row.id,
    mobileNumber: row.mobile_number,
    otpEncrypted: row.otp_encrypted,
    otpExpires: row.otp_expires ? new Date(row.otp_expires) : null,
    lastLogin: row.last_login ? new Date(row.last_login) : null,
    createdAt: new Date(row.created_at),
});

export const findUserByMobileNumber = async (
    mobileNumber: string
): Promise<UserRecord | null> => {
    const result = await query<{
        id: number;
        mobile_number: string;
        otp_encrypted: string | null;
        otp_expires: Date | null;
        last_login: Date | null;
        created_at: Date;
    }>(
        'SELECT id, mobile_number, otp_encrypted, otp_expires, last_login, created_at FROM users WHERE mobile_number = $1',
        [mobileNumber]
    );

    if (result.rows.length === 0) {
        return null;
    }

    const user = mapRowToUser(result.rows[0]);
    return user;
};

export const upsertUserOtp = async (
    mobileNumber: string,
    otpEncrypted: string,
    otpExpires: Date
): Promise<UserRecord> => {
    const result = await query<{
        id: number;
        mobile_number: string;
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
         RETURNING id, mobile_number, otp_encrypted, otp_expires, last_login, created_at`,
        [mobileNumber, otpEncrypted, otpExpires]
    );

    const user = mapRowToUser(result.rows[0]);
    return user;
};

export const clearUserOtp = async (mobileNumber: string): Promise<UserRecord | null> => {
    const result = await query<{
        id: number;
        mobile_number: string;
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
         RETURNING id, mobile_number, otp_encrypted, otp_expires, last_login, created_at`,
        [mobileNumber]
    );

    if (result.rows.length === 0) {
        return null;
    }

    const user = mapRowToUser(result.rows[0]);
    return user;
};
