import { query } from './postgres';
import logger from '../utils/logger';

export const initializeDatabase = async (): Promise<void> => {
    // Create users table with username
    await query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            mobile_number TEXT UNIQUE NOT NULL,
            username TEXT,
            otp_encrypted TEXT,
            otp_expires TIMESTAMPTZ,
            last_login TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    `);

    // Add username column if it doesn't exist (for existing databases)
    await query(`
        DO $$ 
        BEGIN 
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                          WHERE table_name='users' AND column_name='username') THEN
                ALTER TABLE users ADD COLUMN username TEXT;
            END IF;
        END $$;
    `);

    // Create tickets table
    await query(`
        CREATE TABLE IF NOT EXISTS tickets (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            category TEXT NOT NULL,
            priority TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'open',
            user_id INTEGER NOT NULL,
            complaint_type TEXT,
            location TEXT,
            assigned_officer_id INTEGER,
            notification_sent BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW(),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `);

    // Add new columns to tickets table if they don't exist
    await query(`
        DO $$ 
        BEGIN 
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                          WHERE table_name='tickets' AND column_name='complaint_type') THEN
                ALTER TABLE tickets ADD COLUMN complaint_type TEXT;
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                          WHERE table_name='tickets' AND column_name='location') THEN
                ALTER TABLE tickets ADD COLUMN location TEXT;
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                          WHERE table_name='tickets' AND column_name='assigned_officer_id') THEN
                ALTER TABLE tickets ADD COLUMN assigned_officer_id INTEGER;
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                          WHERE table_name='tickets' AND column_name='notification_sent') THEN
                ALTER TABLE tickets ADD COLUMN notification_sent BOOLEAN DEFAULT FALSE;
            END IF;
        END $$;
    `);

    // Create indexes for tickets
    await query(`
        CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);
    `);

    await query(`
        CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
    `);

    await query(`
        CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at DESC);
    `);

    // Create bills table
    await query(`
        CREATE TABLE IF NOT EXISTS bills (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            service_type TEXT NOT NULL,
            provider_name TEXT NOT NULL,
            consumer_number TEXT NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            due_date DATE,
            status TEXT NOT NULL DEFAULT 'unpaid',
            payment_id TEXT,
            paid_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
    `);

    // Create indexes for bills
    await query(`
        CREATE INDEX IF NOT EXISTS idx_bills_user_id ON bills(user_id);
        CREATE INDEX IF NOT EXISTS idx_bills_status ON bills(status);
        CREATE INDEX IF NOT EXISTS idx_bills_service_type ON bills(service_type);
    `);

    // Create officers table
    await query(`
        CREATE TABLE IF NOT EXISTS officers (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            mobile_number TEXT UNIQUE NOT NULL,
            role TEXT NOT NULL DEFAULT 'officer',
            zone TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    `);

    // Create notifications table
    await query(`
        CREATE TABLE IF NOT EXISTS notifications (
            id SERIAL PRIMARY KEY,
            officer_id INTEGER NOT NULL REFERENCES officers(id) ON DELETE CASCADE,
            ticket_id INTEGER REFERENCES tickets(id) ON DELETE CASCADE,
            message TEXT NOT NULL,
            read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    `);

    // Create indexes for notifications
    await query(`
        CREATE INDEX IF NOT EXISTS idx_notifications_officer_id ON notifications(officer_id);
        CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
    `);

    // Create payments table
    await query(`
        CREATE TABLE IF NOT EXISTS payments (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            bill_id INTEGER REFERENCES bills(id) ON DELETE SET NULL,
            order_id TEXT UNIQUE NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            status TEXT NOT NULL DEFAULT 'pending',
            transaction_id TEXT,
            cashfree_order_id TEXT,
            cashfree_payment_id TEXT,
            payment_method TEXT,
            payment_gateway_response JSONB,
            payment_session_id TEXT,
            payment_time TIMESTAMPTZ,
            failure_reason TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
    `);

    // Create indexes for payments
    await query(`
        CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
        CREATE INDEX IF NOT EXISTS idx_payments_bill_id ON payments(bill_id);
        CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
        CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
    `);

    // Add missing columns to users table
    await query(`
        DO $$ 
        BEGIN 
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                          WHERE table_name='users' AND column_name='email') THEN
                ALTER TABLE users ADD COLUMN email TEXT;
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                          WHERE table_name='users' AND column_name='name') THEN
                ALTER TABLE users ADD COLUMN name TEXT;
            END IF;
        END $$;
    `);

    // Add missing columns to payments table
    await query(`
        DO $$ 
        BEGIN 
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                          WHERE table_name='payments' AND column_name='cashfree_order_id') THEN
                ALTER TABLE payments ADD COLUMN cashfree_order_id TEXT;
            END IF;
        END $$;
    `);

    // Add missing columns to tickets table
    await query(`
        DO $$ 
        BEGIN 
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                          WHERE table_name='tickets' AND column_name='resolved_at') THEN
                ALTER TABLE tickets ADD COLUMN resolved_at TIMESTAMPTZ;
            END IF;
        END $$;
    `);

    // Add missing columns to bills table
    await query(`
        DO $$ 
        BEGIN 
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                          WHERE table_name='bills' AND column_name='bill_number') THEN
                ALTER TABLE bills ADD COLUMN bill_number TEXT;
            END IF;
        END $$;
    `);

    logger.info('✅ Database schema ensured successfully (users, tickets, bills, officers, notifications, payments)');
};
