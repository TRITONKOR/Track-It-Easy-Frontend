import React, { useEffect, useState } from 'react';
import { Parcel, TrackApi } from '../../api/track.api';
import FollowedParcelsList from '../../components/FollowedParcelsList/FollowedParcelsList';
import { useAuth } from '../../context/AuthContext';
import styles from './followedParcelsPage.module.scss';

export const FollowedParcelsPage: React.FC = () => {
    const [parcels, setParcels] = useState<Parcel[]>([]);
    const [stats, setStats] = useState({
        active: 0,
        inTransit: 0,
        delivered: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { user, loading: authLoading } = useAuth();

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            setError('User not authenticated');
            setLoading(false);
            return;
        }

        const fetchFollowedParcels = async () => {
            try {
                setLoading(true);
                const fetchedParcels = await TrackApi.getFollowedParcels(user.id);
                setParcels(fetchedParcels);

                const active = fetchedParcels.length;
                const inTransit = fetchedParcels.filter((p) => p.status === 'В дорозі').length;
                const delivered = fetchedParcels.filter((p) => p.status === 'Доставлено').length;

                setStats({ active, inTransit, delivered });
            } catch (err) {
                console.error('Error fetching followed parcels:', err);
                setError('Failed to load parcels. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchFollowedParcels();
    }, [user, authLoading]);

    if (authLoading) {
        return <div className={styles['loading-message']}>Loading user data...</div>;
    }

    if (error) {
        return <div className={styles['error-message']}>{error}</div>;
    }

    return (
        <div className={styles['followed-parcels-page']}>
            <header className={styles['page-header']}>
                <h1>Your Followed Parcels</h1>
                <p className={styles['subtitle']}>Track all your shipments in one place</p>
            </header>

            <div className={styles['content-container']}>
                <div className={styles['stats-card']}>
                    <div className={styles['stat-item']}>
                        <span className={styles['stat-value']}>{stats.active}</span>
                        <span className={styles['stat-label']}>Active Shipments</span>
                    </div>
                    <div className={styles['stat-item']}>
                        <span className={styles['stat-value']}>{stats.inTransit}</span>
                        <span className={styles['stat-label']}>In Transit</span>
                    </div>
                    <div className={styles['stat-item']}>
                        <span className={styles['stat-value']}>{stats.delivered}</span>
                        <span className={styles['stat-label']}>Delivered</span>
                    </div>
                </div>

                <div className={styles['parcels-section']}>
                    {loading ? (
                        <div className={styles['loading-message']}>Loading parcels...</div>
                    ) : parcels.length === 0 ? (
                        <div className={styles['empty-state']}>
                            You're not following any parcels yet.
                        </div>
                    ) : (
                        <FollowedParcelsList parcels={parcels} />
                    )}
                </div>
            </div>
        </div>
    );
};
