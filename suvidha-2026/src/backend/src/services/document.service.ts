import { pool } from '../db/postgres';
import logger from '../utils/logger';

export interface Document {
    id: number;
    user_id: number;
    document_type: string;
    file_path: string;
    file_name: string;
    file_size: number;
    mime_type: string;
    uploaded_at: Date;
}

/**
 * Save document metadata to database
 */
export const saveDocument = async (
    userId: number,
    documentType: string,
    filePath: string,
    fileName: string,
    fileSize: number,
    mimeType: string
): Promise<Document | null> => {
    try {
        const result = await pool.query(
            `INSERT INTO documents (user_id, document_type, file_path, file_name, file_size, mime_type)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [userId, documentType, filePath, fileName, fileSize, mimeType]
        );

        logger.info(`Document saved: ${fileName}`);
        return result.rows[0];
    } catch (error) {
        logger.error('Error saving document:', error);
        return null;
    }
};

/**
 * Get user documents
 */
export const getUserDocuments = async (userId: number): Promise<Document[]> => {
    try {
        const result = await pool.query(
            'SELECT * FROM documents WHERE user_id = $1 ORDER BY uploaded_at DESC',
            [userId]
        );

        return result.rows;
    } catch (error) {
        logger.error('Error fetching user documents:', error);
        return [];
    }
};

/**
 * Delete document
 */
export const deleteDocument = async (documentId: number, userId: number): Promise<boolean> => {
    try {
        const result = await pool.query(
            'DELETE FROM documents WHERE id = $1 AND user_id = $2 RETURNING file_path',
            [documentId, userId]
        );

        return result.rowCount > 0;
    } catch (error) {
        logger.error('Error deleting document:', error);
        return false;
    }
};
