import { useState } from 'react';
import { TrackApi } from '../../../api/track.api';
import { useAuth } from '../../../context/AuthContext';
import { FollowButton } from '../../ui/FollowButton/FollowButton';
import styles from './trackDetails.module.scss';

interface PackageDetails {
    trackingNumber: string;
    daysInTransit: number;
    fromLocation: string;
    toLocation: string;
    isFollowed: boolean;
    weight: number;
    status: string;
}

export const TrackDetails: React.FC<{ package: PackageDetails }> = ({ package: pkg }) => {
    const [isFollowed, setIsFollowed] = useState(pkg.isFollowed);
    const [isLoading, setIsLoading] = useState(false);
    const { user, isAuthenticated } = useAuth();

    const handleFollowClick = async () => {
        if (!isAuthenticated || !user) return;

        setIsLoading(true);
        try {
            if (isFollowed) {
                await TrackApi.unfollowParcel(pkg.trackingNumber, user.id);
            } else {
                await TrackApi.followParcel(pkg.trackingNumber, user.id);
            }
            setIsFollowed(!isFollowed);
        } catch (error) {
            console.error('Error following parcel:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`${styles['track-details']} ${styles['track-details-appear']}`}>
            <div className={styles['track-details__header']}>
                <h1 className={styles['track-details__number']}>{pkg.trackingNumber}</h1>
                <span className={`track-details__status ${pkg.status}`}>{pkg.status}</span>
                {isAuthenticated && (
                    <FollowButton
                        isFollowed={isFollowed}
                        isLoading={isLoading}
                        onClick={handleFollowClick}
                    />
                )}
            </div>

            <div className={styles['track-details__info']}>
                {[
                    {
                        label: 'Днів у дорозі:',
                        value: pkg.daysInTransit,
                    },
                    {
                        label: 'Відправник:',
                        value: pkg.fromLocation,
                    },
                    {
                        label: 'Отримувач:',
                        value: pkg.toLocation,
                    },
                    {
                        label: 'Вага:',
                        value: pkg.weight,
                    },
                ].map((item, index) => (
                    <div
                        key={index}
                        className={`${styles['info-card']} ${styles['info-card-appear']}`}
                        style={{ animationDelay: `${index * 150}ms` }}
                    >
                        <span className={styles['info-card__label']}>{item.label}</span>
                        <span className={styles['info-card__value']}>{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
