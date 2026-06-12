import React from 'react';
import { useAuth } from '../context/AuthContext';
import Unauthorized from '../pages/Unauthorized';

export default function AdminRoute({ children }) {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!currentUser || currentUser.email !== 'djbermudezr@ufpso.edu.co') {
        return <Unauthorized />;
    }

    return children;
}
