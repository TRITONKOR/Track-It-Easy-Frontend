import { useRef, useState } from 'react';
import { Parcel, TrackApi, TrackParcelResponse } from '../../api/TrackApi';
import { TrackList } from '../../components/Track/TrackList/TrackList';
import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';
import styles from './mainPage.module.scss';

import { faqItems } from '../../data/faq';
import { partners } from '../../data/partners';

import { useAuth } from '../../context/AuthContext';

export const MainPage: React.FC = () => {
    const [trackingNumber, setTrackingNumber] = useState<string>('');
    const [parcel, setParcel] = useState<Parcel>();

    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    const topRef = useRef<HTMLDivElement>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTrackingNumber(event.target.value);
    };

    const handleTrack = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        if (!trackingNumber.trim()) {
            setError('Будь ласка, введіть трек-номер посилки');
            return;
        }

        try {
            const response: TrackParcelResponse = await TrackApi.trackParcel(
                trackingNumber,
                user?.id,
            );
            if (!response.success) {
                setError(response.error || 'Помилка при відстеженні посилки.');
                setParcel(undefined);
                return;
            }
            setParcel(response.data);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Error tracking parcel:', error);
            if (error.response?.status === 409) {
                setError('Для відстеження цієї посилки необхідно увійти в аккаунт');
            } else {
                setError('Помилка при відстеженні посилки. Спробуйте пізніше.');
            }
        }
    };

    const scrollToTop = () => {
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className={styles['main-container']}>
            <section ref={topRef} className={styles['track-section']}>
                <div className={styles['track-content']}>
                    <h1 className={styles['track-title']}>
                        Відстеження поштових відправлень по Україні
                    </h1>
                    <p className={styles['track-description']}>
                        Пошук поштових відправлень Нової Пошти, Міст Експрес та інших компаній
                    </p>
                    <form className={styles['track-form']} onSubmit={handleTrack}>
                        <Input
                            className={styles['track-input']}
                            placeholder="Введіть трек-номер посилки"
                            onChange={handleInputChange}
                        />
                        <Button type="submit" className={styles['track-button']}>
                            ВІДСТЕЖИТИ
                        </Button>
                    </form>
                    {error && <div className={styles['error-message']}>{error}</div>}
                </div>
            </section>

            <section className={styles['track-list-section']}>
                <div className={styles['track-list-content']}>
                    <h2 className={styles['track-list-title']}>Останні трекінги</h2>
                </div>
                {parcel && <TrackList parcel={parcel} />}
            </section>

            <section className={styles['partners-section']}>
                <div className={styles['partners-content']}>
                    <h2 className={styles['partners-title']}>Наші партнери</h2>
                    <div className={styles['partners-grid']}>
                        {partners.map((partner) => (
                            <div key={partner.id} className={styles['partner-card']}>
                                <img
                                    src={partner.logo}
                                    alt={partner.name}
                                    className={styles['partner-logo']}
                                />
                                <h3 className={styles['partner-name']}>{partner.name}</h3>
                                <p className={styles['partner-description']}>
                                    {partner.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className={styles['faq-section']}>
                <div className={styles['faq-content']}>
                    <h2 className={styles['faq-title']}>Довідкова інформація</h2>
                    <div className={styles['faq-grid']}>
                        {faqItems.map((item) => (
                            <div key={item.id} className={styles['faq-card']}>
                                <h3 className={styles['faq-question']}>{item.question}</h3>
                                <p className={styles['faq-answer']}>{item.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className={styles['track-again-section']}>
                <div className={styles['track-again-content']}>
                    <h2 className={styles['track-again-title']}>Відстежте вашу посилку</h2>
                    <p className={styles['track-again-text']}>
                        На цьому сайті можна простежити посилку, міжнародне відправлення та вантаж
                        по Україні. Для цього введіть у поле вище трек-номер, або натисніть кнопку
                        «Відстежити».
                    </p>
                    <div>
                        <Button className={styles['track-again-button']} onClick={scrollToTop}>
                            ВІДСТЕЖИТИ
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};
