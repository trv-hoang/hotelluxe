import { useState, useEffect } from 'react';
import { adminApi } from '../api/admin';

export interface Hotel {
    id: number;
    title: string;
    description: string;
    featured_image: string;
    address: string;
    price_per_night: number;
    max_guests: number;
    review_score: number;
    is_active: boolean;
    created_at: string;
}

export const useHotels = () => {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await adminApi.getPublicHotels();
                setHotels(data.data || []);
            } catch (err) {
                console.error('Failed to fetch hotels:', err);
                setError('Failed to fetch hotels');
                setHotels([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHotels();
    }, []);

    return { hotels, loading, error, refetch: () => window.location.reload() };
};

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
}

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await adminApi.getUsers();
                setUsers(data.data || []);
            } catch (err) {
                console.error('Failed to fetch users:', err);
                setError('Failed to fetch users');
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return { users, loading, error };
};