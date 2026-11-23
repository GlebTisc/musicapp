import { AnyRow } from "./types";

/**
 * Check if an unknown object is a record
 * 
 * @param record
 * @returns 
 */
export function isRecord(record: unknown): record is Record<string, unknown> {
    return typeof record === 'object' && record !== null && !Array.isArray(record);
}

/**
 * Check if an unknown object is the database entry
 * 
 * @param row
 * @returns 
 */
export function isRow(row: unknown): row is AnyRow {
    return isRecord(row) && typeof row._id === 'string' && row._id.length > 0;
}

/**
 * Check if an unknown object is an array of database entries
 * 
 * @param rows
 * @returns 
 */
export function isRowArray(rows: unknown): rows is AnyRow[] {
    return Array.isArray(rows) && rows.every(isRow);
}

/**
 * Check if reponse from the API in the admin panel is valid
 * 
 * @param response
 * @returns
 */
export function isAdminResponse(response: unknown): response is { data: { items: AnyRow[]; total?: number } } {
    // if response doesn't have data property - it's not valid
    if (!isRecord(response) || !isRecord(response.data)) {
        return false;
    }

    const { data } = response;

    // check if data is an array of records
    if (!isRowArray(data)) {
        return false;
    }

    // check total
    return 'total' in data && typeof data.total === 'number' && Number.isFinite(data.total) && data.total > 0;
}