import styles from './trackItem.module.scss';

import MeestLogo from '../../../assets/logos/meest.svg';
import NovaPoshtaLogo from '../../../assets/logos/nova-poshta.svg';
import UkrposhtaLogo from '../../../assets/logos/ukrposhta.svg';
import { formatDate, formatTime } from '../../../services/date.service';

interface TrackEventItemProps {
    status: string;
    description: string;
    timestamp: string;
    courier: string;
    className?: string;
    style?: React.CSSProperties;
}

export const TrackItem: React.FC<TrackEventItemProps> = (data) => {
    const eventDate = new Date(data.timestamp);

    let courierIcon = NovaPoshtaLogo;
    let courierName = 'Нова Пошта';
    switch (data.courier) {
        case 'Ukrposhta':
            courierIcon = UkrposhtaLogo;
            courierName = 'Укрпошта';
            break;
        case 'MeestExpress':
            courierIcon = MeestLogo;
            courierName = 'Meest Express';
            break;
        case 'NovaPoshta':
        default:
            courierIcon = NovaPoshtaLogo;
            courierName = 'Нова Пошта';
    }

    return (
        <div
            className={`${styles['track-item-container']} ${
                styles[data.status]
            } ${data.className ? data.className : ''}`}
            style={data.style}
        >
            <div className={styles['date-time']}>
                <span className={styles['date']}>{formatDate(eventDate)}</span>
                <span className={styles['time']}>{formatTime(eventDate)}</span>
            </div>
            <div className={styles['event-info']}>
                <div className={styles['vertical-line']}></div>
                <span className={styles['service-info']}>
                    <span>
                        <img
                            className={styles['courier-icon']}
                            src={courierIcon}
                            alt="Courier Icon"
                        />
                    </span>
                    <span className={styles['courier-name']}>{courierName}</span>
                </span>
                <p className={styles['text']}>{data.description}</p>
            </div>
        </div>
    );
};
