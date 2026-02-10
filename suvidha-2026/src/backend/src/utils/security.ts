/**
 * Security utilities for input validation and sanitization
 * 
 * Note: Additional protection against prototype pollution vulnerabilities
 * in third-party dependencies (see SECURITY.md for known issues)
 */

/**
 * Sanitize object to prevent prototype pollution
 * Removes dangerous keys like __proto__, constructor, prototype
 */
export const sanitizeObject = (obj: any): any => {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
    }

    const sanitized: any = {};
    const dangerousKeys = ['__proto__', 'constructor', 'prototype'];

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            // Skip dangerous keys
            if (dangerousKeys.includes(key)) {
                continue;
            }

            // Recursively sanitize nested objects
            sanitized[key] = sanitizeObject(obj[key]);
        }
    }

    return sanitized;
};

/**
 * Validate and sanitize payment data
 */
export const validatePaymentData = (data: any): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Check required fields
    if (!data.amount || typeof data.amount !== 'number' || data.amount <= 0) {
        errors.push('Invalid amount');
    }

    if (!data.customerName || typeof data.customerName !== 'string' || data.customerName.trim().length === 0) {
        errors.push('Invalid customer name');
    }

    if (!data.customerPhone || typeof data.customerPhone !== 'string') {
        errors.push('Invalid customer phone');
    }

    // Validate phone number format (Indian mobile numbers)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (data.customerPhone && !phoneRegex.test(data.customerPhone.replace(/\D/g, '').slice(-10))) {
        errors.push('Invalid phone number format');
    }

    // Check for suspicious patterns that might indicate prototype pollution attempts
    const jsonString = JSON.stringify(data);
    if (jsonString.includes('__proto__') || jsonString.includes('constructor') || jsonString.includes('prototype')) {
        errors.push('Suspicious input detected');
    }

    return {
        valid: errors.length === 0,
        errors,
    };
};

/**
 * Sanitize webhook data from external payment gateway
 */
export const sanitizeWebhookData = (data: any): any => {
    // First sanitize the object structure
    const sanitized = sanitizeObject(data);

    // Ensure all expected fields are of correct types
    return {
        orderId: String(sanitized.orderId || ''),
        orderAmount: Number(sanitized.orderAmount || 0),
        txStatus: String(sanitized.txStatus || ''),
        txMsg: String(sanitized.txMsg || ''),
        txTime: sanitized.txTime,
        referenceId: String(sanitized.referenceId || ''),
        paymentMode: String(sanitized.paymentMode || ''),
    };
};

/**
 * Validate order ID format
 */
export const isValidOrderId = (orderId: string): boolean => {
    // Order IDs should match the format: ORDER_TIMESTAMP (e.g., ORDER_1707580234567)
    const orderIdRegex = /^ORDER_\d{13}$/;
    return orderIdRegex.test(orderId);
};
