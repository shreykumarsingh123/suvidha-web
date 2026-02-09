import { query } from '../db/postgres';
import { Officer, CreateOfficerDto } from '../models/officer.model';

export class OfficerRepository {
    /**
     * Create a new officer
     */
    async create(officerData: CreateOfficerDto): Promise<Officer> {
        const result = await query(
            `INSERT INTO officers (name, mobile_number, role, zone)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [
                officerData.name,
                officerData.mobileNumber,
                officerData.role || 'officer',
                officerData.zone || null
            ]
        );

        return this.mapToOfficer(result.rows[0]);
    }

    /**
     * Find officer by ID
     */
    async findById(id: number): Promise<Officer | null> {
        const result = await query(
            `SELECT * FROM officers WHERE id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return null;
        }

        return this.mapToOfficer(result.rows[0]);
    }

    /**
     * Find officer by mobile number
     */
    async findByMobileNumber(mobileNumber: string): Promise<Officer | null> {
        const result = await query(
            `SELECT * FROM officers WHERE mobile_number = $1`,
            [mobileNumber]
        );

        if (result.rows.length === 0) {
            return null;
        }

        return this.mapToOfficer(result.rows[0]);
    }

    /**
     * Find all officers
     */
    async findAll(): Promise<Officer[]> {
        const result = await query(
            `SELECT * FROM officers ORDER BY created_at DESC`
        );

        return result.rows.map(row => this.mapToOfficer(row));
    }

    /**
     * Find officers by zone
     */
    async findByZone(zone: string): Promise<Officer[]> {
        const result = await query(
            `SELECT * FROM officers WHERE zone = $1 ORDER BY created_at DESC`,
            [zone]
        );

        return result.rows.map(row => this.mapToOfficer(row));
    }

    /**
     * Map database row to Officer model
     */
    private mapToOfficer(row: any): Officer {
        return {
            id: row.id,
            name: row.name,
            mobileNumber: row.mobile_number,
            role: row.role,
            zone: row.zone,
            createdAt: new Date(row.created_at)
        };
    }
}

export const officerRepository = new OfficerRepository();
