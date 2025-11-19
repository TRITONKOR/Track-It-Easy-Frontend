import React from 'react';
import { MovementHistoryEvent, Parcel } from '../../api/track.api';
import { FollowedParcelItem } from './FollowedParcelItem/FollowedParcelItem';
import styles from './followedParcelsList.module.scss';

interface FollowedParcelsListProps {
    parcels: Parcel[];
}

const FollowedParcelsList: React.FC<FollowedParcelsListProps> = ({ parcels }) => {
    return (
        <div className={styles['followed-parcels-list']}>
            <ul className="parcels-list">
                {parcels.map((parcel) => {
                    const currentEvent = parcel.movementHistory.find(
                        (event: MovementHistoryEvent) => event.statusLocation === 'now',
                    );

                    if (!currentEvent) return null;

                    return (
                        <li key={parcel.trackingNumber} className={styles['parcel-item']}>
                            <FollowedParcelItem
                                trackingNumber={parcel.trackingNumber}
                                movementHistory={currentEvent}
                                courier={parcel.courier}
                            />
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default FollowedParcelsList;
