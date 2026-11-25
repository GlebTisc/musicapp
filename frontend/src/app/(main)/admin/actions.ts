'use server';

import z from 'zod';
import { redirect } from 'next/navigation';
import { adminSections, type SectionKey } from './_lib/sections';
import { proxyFetch } from '@/lib/proxyFetch';
import { detailsToFieldErrors, hasApiErrorDetails } from '@/lib/apiError';
import { CreateUserSchema, UpdateUserSchema, type CreateUserDTO, } from '@/schemas/admin';

export type FormState = {
    fieldErrors?: Partial<Record<keyof CreateUserDTO, string[]>>;
    formError?: string;
} | null;

/**
 * Delete function
 * 
 * @param section 
 * @param id 
 * @returns 
 */
export async function deleteItem(
    section: SectionKey,
    id: string,
): Promise<{ success: true } | { error: string }> {
    const result = await proxyFetch({
        method: 'DELETE',
        path: `${adminSections[section].endpoint}/${id}`,
        revalidate: `/admin/${section}`,
    });
    return result.ok ? { success: true } : { error: result.message };
}

/**
 * Create user request
 * 
 * @param _prev 
 * @param formData 
 * @returns 
 */
export async function createUser(
    _prev: FormState,
    formData: FormData,
): Promise<FormState> {
    const parsed = CreateUserSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
        return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
    }

    const result = await proxyFetch({
        method: 'POST',
        path: '/api/admin/users',
        body: parsed.data,
        revalidate: '/admin/users',
    });

    if (!result.ok) {
        let fieldErrors;
        // ApiErrorDetails typeguard
        if (hasApiErrorDetails(result)) {
            fieldErrors = detailsToFieldErrors(result);
        }

        return fieldErrors ? { fieldErrors } : { formError: result.message };
    }

    redirect('/admin/users?created=1');
}

/**
 * Update user request
 * 
 * @param id 
 * @param _prev 
 * @param formData 
 * @returns 
 */
export async function updateUser(
    id: string,
    _prev: FormState,
    formData: FormData,
): Promise<FormState> {
    const parsed = UpdateUserSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
        return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
    }

    const result = await proxyFetch({
        method: 'PATCH',
        path: `/api/admin/users/${id}`,
        body: parsed.data,
        revalidate: [`/admin/users/${id}`, '/admin/users'],
    });

    if (!result.ok) {
        let fieldErrors;
        // ApiErrorDetails typeguard
        if (hasApiErrorDetails(result)) {
            fieldErrors = detailsToFieldErrors(result);
        }

        return fieldErrors ? { fieldErrors } : { formError: result.message };
    }

    return { fieldErrors: {} };
}