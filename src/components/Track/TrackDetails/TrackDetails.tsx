import { useState } from 'react';
import { TrackApi } from '../../../api/track.api';
import { useAuth } from '../../../context/AuthContext';
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
                    <button
                        className={`follow-parcel__button ${
                            isFollowed ? 'saved' : ''
                        } ${isLoading ? 'loading' : ''}`}
                        onClick={handleFollowClick}
                        disabled={isLoading}
                        aria-label={isFollowed ? 'Прибрати із збережених' : 'Зберегти посилку'}
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill={isFollowed ? '#ff4757' : 'none'}
                            stroke="#ff4757"
                            strokeWidth="2"
                        >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                    </button>
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
