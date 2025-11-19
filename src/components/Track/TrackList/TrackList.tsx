import { Parcel } from '../../../api/track.api';
import { TrackDetails } from '../TrackDetails/TrackDetails';
import { TrackItem } from '../TrackItem/TrackItem';
import styles from './trackList.module.scss';

interface TrackListProps {
    parcel: Parcel;
}

export const TrackList: React.FC<TrackListProps> = ({ parcel }) => {
    const calculateDaysInTransit = () => {
        if (!parcel?.movementHistory.length) return 0;

        const firstDate = new Date(parcel.movementHistory[0].timestamp);
        const lastDate =
            parcel.status === 'delivered'
                ? new Date(parcel.movementHistory[parcel.movementHistory.length - 1].timestamp)
                : new Date();

        return Math.ceil((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));
    };

    return (
        <div className={styles['track-list']}>
            <div className={styles['track-list__content']}>
                <div className={styles['track-events']}>
                    {parcel.movementHistory?.map((event, index) => (
                        <TrackItem
                            key={`${event.timestamp}-${index}`}
                            status={event.statusLocation}
                            description={event.description}
                            timestamp={event.timestamp}
                            courier={parcel.courier}
                            className={styles['track-item-appear']}
                            style={{ animationDelay: `${index * 100}ms` }}
                        />
                    ))}
                </div>

                <div className={styles['track-details-wrapper']}>
                    <TrackDetails
                        package={{
                            trackingNumber: parcel.trackingNumber,
                            daysInTransit: calculateDaysInTransit(),
                            fromLocation: parcel.fromLocation,
                            toLocation: parcel.toLocation,
                            isFollowed: parcel.isFollowed,
                            weight: parcel.factualWeight || 0,
                            status: parcel.status as 'in-transit' | 'delivered' | 'pending',
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
