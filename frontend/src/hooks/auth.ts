import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { checkAuth } from '@/store/slices/authSlice';

export function useAuth() {
    const dispatch = useAppDispatch();

    const { user, isAuthenticated, isLoading, error } = useAppSelector(
        (state) => state.auth
    );

    useEffect(() => {
        // check auth status only if:
        // 1. Loading is already completed
        // 2. User is empty
        if (!isLoading && user === undefined) {
            dispatch(checkAuth());
        }
    }, [dispatch, isLoading, user]);

    return {
        user,
        isAuthenticated,
        isLoading,
        error,
    };
}