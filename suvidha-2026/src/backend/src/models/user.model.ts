export interface User {
    id: number;
    mobileNumber: string;
    otpEncrypted?: string | null;
    otpExpires?: Date | null;
    lastLogin?: Date | null;
    createdAt?: Date;
}
