import { MovementHistoryEvent } from '../../../api/track.api';
import MeestLogo from '../../../assets/logos/meest.svg';
import NovaPoshtaLogo from '../../../assets/logos/nova-poshta.svg';
import UkrposhtaLogo from '../../../assets/logos/ukrposhta.svg';
import { formatDate, formatTime } from '../../../services/date.service';
import styles from './followedParcelItem.module.scss';

interface FollowedParcelItemProps {
    movementHistory: MovementHistoryEvent;
    trackingNumber: string;
    courier?: string;
}

export const FollowedParcelItem: React.FC<FollowedParcelItemProps> = ({
    movementHistory,
    trackingNumber,
    courier,
}) => {
    const eventDate = new Date(movementHistory.timestamp);

    let courierIcon = null;

    switch (courier) {
        case 'NovaPoshta':
            courierIcon = (
                <img src={NovaPoshtaLogo} alt="Nova Poshta" className={styles['courier-icon']} />
            );
            break;
        case 'Ukrposhta':
            courierIcon = (
                <img src={UkrposhtaLogo} alt="Ukrposhta" className={styles['courier-icon']} />
            );
            break;
        case 'MeestExpress':
            courierIcon = (
                <img src={MeestLogo} alt="Meest Express" className={styles['courier-icon']} />
            );
            break;
        default:
            courierIcon = null;
    }

    return (
        <div className={styles['followed-parcel-container']}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {courierIcon}
                <span
                    className={styles['__tracking-number']}
                    onClick={() => navigator.clipboard.writeText(trackingNumber)}
                    title="Copy tracking number"
                    style={{ cursor: 'pointer' }}
                >
                    {trackingNumber}
                </span>
            </div>
            <div>
                <div className={styles['__date-time']}>
                    <span className={styles['date']}>{formatDate(eventDate)}</span>
                    <span className={styles['time']}>{formatTime(eventDate)}</span>
                </div>
                <div className={styles['__event-info']}>
                    <div className={styles['__vertical-line']}></div>
                    <p className={styles['__text']}>{movementHistory.description}</p>
                </div>
            </div>
        </div>
    );
};
