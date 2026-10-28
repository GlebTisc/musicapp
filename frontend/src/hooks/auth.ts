import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { checkAuth } from '@/store/slices/authSlice';

export function useAuth() {
    const dispatch = useAppDispatch();

    const { user, isAuthenticated, isLoading, error } = useAppSelector(
        (state) => state.auth
    );

    useEffect(() => {
        // check if user changed
        if (user === undefined) {
            dispatch(checkAuth());
        }
    }, [dispatch, user]);

    return {
        user,
        isAuthenticated,
        isLoading,
        error,
        isAdmin: user?.role === 'admin'
    };
}