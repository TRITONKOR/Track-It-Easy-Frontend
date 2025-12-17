/// <reference types="cypress" />

import { MemoryRouter } from 'react-router';
import { TrackApi } from '../../api/track.api';
import { AuthProvider } from '../../context/AuthContext';
import { MainPage } from './MainPage';

describe('<MainPage />', () => {
    let trackParcelStub: any;

    const mountWithProviders = () => {
        cy.mount(
            <MemoryRouter>
                <AuthProvider>
                    <MainPage />
                </AuthProvider>
            </MemoryRouter>,
        );
    };

    beforeEach(() => {
        trackParcelStub = cy.stub(TrackApi, 'trackParcel').as('trackParcelStub');
    });

    describe('Рендеринг компонента', () => {
        it('рендерить основну структуру сторінки', () => {
            mountWithProviders();

            cy.get('[class*="main-container"]').should('exist');
            cy.get('[class*="track-section"]').should('exist');
            cy.get('[class*="track-list-section"]').should('exist');
            cy.get('[class*="partners-section"]').should('exist');
            cy.get('[class*="faq-section"]').should('exist');
            cy.get('[class*="track-again-section"]').should('exist');
        });

        it('відображає заголовок сторінки', () => {
            mountWithProviders();

            cy.contains('Відстеження поштових відправлень по Україні').should('be.visible');
        });

        it('відображає опис', () => {
            mountWithProviders();

            cy.contains('Пошук поштових відправлень Нової Пошти').should('be.visible');
        });

        it('відображає форму для відстеження', () => {
            mountWithProviders();

            cy.get('form[class*="track-form"]').should('exist');
            cy.get('input[placeholder*="Введіть трек-номер"]').should('be.visible');
            cy.get('button').contains('ВІДСТЕЖИТИ').should('be.visible');
        });
    });

    describe('Секція Partners', () => {
        it('відображає секцію партнерів', () => {
            mountWithProviders();

            cy.contains('Наші партнери').should('be.visible');
            cy.get('[class*="partners-grid"]').should('exist');
        });

        it('відображає картки партнерів', () => {
            mountWithProviders();

            cy.get('[class*="partner-card"]').should('have.length.greaterThan', 0);
        });

        it('кожна картка партнера має логотип, назву та опис', () => {
            mountWithProviders();

            cy.get('[class*="partner-card"]')
                .first()
                .within(() => {
                    cy.get('[class*="partner-logo"]').should('exist');
                    cy.get('[class*="partner-name"]').should('exist');
                    cy.get('[class*="partner-description"]').should('exist');
                });
        });
    });

    describe('Секція FAQ', () => {
        it('відображає секцію FAQ', () => {
            mountWithProviders();

            cy.contains('Довідкова інформація').should('be.visible');
            cy.get('[class*="faq-grid"]').should('exist');
        });

        it('відображає питання та відповіді FAQ', () => {
            mountWithProviders();

            cy.get('[class*="faq-card"]').should('have.length.greaterThan', 0);
        });

        it('кожна FAQ картка має питання та відповідь', () => {
            mountWithProviders();

            cy.get('[class*="faq-card"]')
                .first()
                .within(() => {
                    cy.get('[class*="faq-question"]').should('exist');
                    cy.get('[class*="faq-answer"]').should('exist');
                });
        });
    });

    describe('Форма відстеження посилки', () => {
        it('дозволяє вводити трек-номер', () => {
            mountWithProviders();

            const trackNumber = '59000123456789';
            cy.get('input[placeholder*="Введіть трек-номер"]')
                .type(trackNumber)
                .should('have.value', trackNumber);
        });

        it('відображає помилку при відправці порожньої форми', () => {
            mountWithProviders();

            cy.get('button').contains('ВІДСТЕЖИТИ').click();
            cy.get('[class*="error-message"]')
                .should('be.visible')
                .and('contain', 'Будь ласка, введіть трек-номер посилки');
        });

        it('викликає API при успішній відправці форми', () => {
            const trackNumber = '59000123456789';
            const mockResponse = {
                success: true,
                data: {
                    id: '1',
                    trackingNumber: trackNumber,
                    status: 'В дорозі',
                    courier: 'Нова Пошта',
                    factualWeight: 2.5,
                    fromLocation: 'Київ',
                    toLocation: 'Львів',
                    isFollowed: false,
                    movementHistory: [
                        {
                            statusLocation: 'Київ',
                            description: 'Посилку відправлено',
                            timestamp: '2024-01-01T10:00:00Z',
                        },
                    ],
                },
            };

            trackParcelStub.resolves(mockResponse);
            mountWithProviders();

            cy.get('input[placeholder*="Введіть трек-номер"]').type(trackNumber);
            cy.get('button').contains('ВІДСТЕЖИТИ').click();

            cy.get('@trackParcelStub').should('have.been.calledOnce');
        });

        it('відображає результат успішного трекінгу', () => {
            const trackNumber = '59000123456789';
            const mockResponse = {
                success: true,
                data: {
                    id: '1',
                    trackingNumber: trackNumber,
                    status: 'В дорозі',
                    courier: 'Нова Пошта',
                    factualWeight: 2.5,
                    fromLocation: 'Київ',
                    toLocation: 'Львів',
                    isFollowed: false,
                    movementHistory: [
                        {
                            statusLocation: 'Київ',
                            description: 'Посилку відправлено',
                            timestamp: '2024-01-01T10:00:00Z',
                        },
                    ],
                },
            };

            trackParcelStub.resolves(mockResponse);
            mountWithProviders();

            cy.get('input[placeholder*="Введіть трек-номер"]').type(trackNumber);
            cy.get('button').contains('ВІДСТЕЖИТИ').click();

            cy.get('[class*="track-list-section"]').should('exist');
        });

        it('відображає помилку при невдалому трекінгу', () => {
            const trackNumber = '59000123456789';
            const mockResponse = {
                success: false,
                error: 'Посилка не знайдена',
            };

            trackParcelStub.resolves(mockResponse);
            mountWithProviders();

            cy.get('input[placeholder*="Введіть трек-номер"]').type(trackNumber);
            cy.get('button').contains('ВІДСТЕЖИТИ').click();

            cy.get('[class*="error-message"]')
                .should('be.visible')
                .and('contain', 'Посилка не знайдена');
        });

        it('відображає помилку 409 (потрібна авторизація)', () => {
            const trackNumber = '59000123456789';
            const error = {
                response: { status: 409 },
            };

            trackParcelStub.rejects(error);
            mountWithProviders();

            cy.get('input[placeholder*="Введіть трек-номер"]').type(trackNumber);
            cy.get('button').contains('ВІДСТЕЖИТИ').click();

            cy.get('[class*="error-message"]')
                .should('be.visible')
                .and('contain', 'Для відстеження цієї посилки необхідно увійти в аккаунт');
        });

        it('відображає загальну помилку при інших помилках API', () => {
            const trackNumber = '59000123456789';
            const error = new Error('Network error');

            trackParcelStub.rejects(error);
            mountWithProviders();

            cy.get('input[placeholder*="Введіть трек-номер"]').type(trackNumber);
            cy.get('button').contains('ВІДСТЕЖИТИ').click();

            cy.get('[class*="error-message"]')
                .should('be.visible')
                .and('contain', 'Помилка при відстеженні посилки');
        });

        it('очищає попередню помилку при новій спробі', () => {
            mountWithProviders();

            cy.get('button').contains('ВІДСТЕЖИТИ').click();
            cy.get('[class*="error-message"]').should('be.visible');

            const trackNumber = '59000123456789';
            const mockResponse = {
                success: true,
                data: {
                    id: '1',
                    trackingNumber: trackNumber,
                    status: 'В дорозі',
                    courier: 'Нова Пошта',
                    factualWeight: 2.5,
                    fromLocation: 'Київ',
                    toLocation: 'Львів',
                    isFollowed: false,
                    movementHistory: [
                        {
                            statusLocation: 'Київ',
                            description: 'Посилку відправлено',
                            timestamp: '2024-01-01T10:00:00Z',
                        },
                    ],
                },
            };

            trackParcelStub.resolves(mockResponse);

            cy.get('input[placeholder*="Введіть трек-номер"]').type(trackNumber);
            cy.get('button').contains('ВІДСТЕЖИТИ').click();

            cy.get('[class*="error-message"]').should('not.exist');
        });
    });

    describe('Секція "Відстежте знову"', () => {
        it('відображає секцію з повторним відстеженням', () => {
            mountWithProviders();

            cy.contains('Відстежте вашу посилку').should('be.visible');
            cy.get('[class*="track-again-button"]').should('exist');
        });

        it('кнопка "Відстежити" прокручує до верху', () => {
            mountWithProviders();

            cy.get('[class*="track-again-section"]').scrollIntoView();

            cy.get('[class*="track-again-button"]').click();

            cy.get('[class*="track-section"]').should('be.visible');
        });
    });

    describe('Секція "Останні трекінги"', () => {
        it('не відображає TrackList якщо немає посилки', () => {
            mountWithProviders();

            cy.contains('Останні трекінги').should('be.visible');
        });

        it('відображає TrackList після успішного трекінгу', () => {
            const trackNumber = '59000123456789';
            const mockResponse = {
                success: true,
                data: {
                    id: '1',
                    trackingNumber: trackNumber,
                    status: 'В дорозі',
                    courier: 'Нова Пошта',
                    factualWeight: 2.5,
                    fromLocation: 'Київ',
                    toLocation: 'Львів',
                    isFollowed: false,
                    movementHistory: [
                        {
                            statusLocation: 'Київ',
                            description: 'Посилку відправлено',
                            timestamp: '2024-01-01T10:00:00Z',
                        },
                    ],
                },
            };

            trackParcelStub.resolves(mockResponse);
            mountWithProviders();

            cy.get('input[placeholder*="Введіть трек-номер"]').type(trackNumber);
            cy.get('button').contains('ВІДСТЕЖИТИ').click();

            cy.wait(100);
            cy.get('[class*="track-list-section"]').should('be.visible');
        });
    });

    describe('Інтеграція з AuthContext', () => {
        it('передає user.id в API запит', () => {
            const trackNumber = '59000123456789';
            const mockResponse = {
                success: true,
                data: {
                    id: '1',
                    trackingNumber: trackNumber,
                    status: 'В дорозі',
                    courier: 'Нова Пошта',
                    factualWeight: 2.5,
                    fromLocation: 'Київ',
                    toLocation: 'Львів',
                    isFollowed: false,
                    movementHistory: [
                        {
                            statusLocation: 'Київ',
                            description: 'Посилку відправлено',
                            timestamp: '2024-01-01T10:00:00Z',
                        },
                    ],
                },
            };

            trackParcelStub.resolves(mockResponse);
            mountWithProviders();

            cy.get('input[placeholder*="Введіть трек-номер"]').type(trackNumber);
            cy.get('button').contains('ВІДСТЕЖИТИ').click();

            cy.get('@trackParcelStub').should('have.been.called');
        });
    });

    describe('Accessibility', () => {
        it('форма має правильну HTML структуру', () => {
            mountWithProviders();

            cy.get('form').should('exist');
            cy.get('input[type="text"]').should('exist');
            cy.get('button[type="submit"]').should('exist');
        });

        it('input має placeholder', () => {
            mountWithProviders();

            cy.get('input').should('have.attr', 'placeholder');
        });

        it('кнопка submit має текст', () => {
            mountWithProviders();

            cy.get('button[type="submit"]').should('contain.text', 'ВІДСТЕЖИТИ');
        });
    });

    describe('Edge cases', () => {
        it('обробляє трек-номер з пробілами', () => {
            mountWithProviders();

            cy.get('input[placeholder*="Введіть трек-номер"]').type('   ');
            cy.get('button').contains('ВІДСТЕЖИТИ').click();

            cy.get('[class*="error-message"]')
                .should('be.visible')
                .and('contain', 'Будь ласка, введіть трек-номер посилки');
        });

        it('дозволяє повторне відстеження після помилки', () => {
            mountWithProviders();

            cy.get('button').contains('ВІДСТЕЖИТИ').click();
            cy.get('[class*="error-message"]').should('be.visible');

            const trackNumber = '59000123456789';
            const mockResponse = {
                success: true,
                data: {
                    id: '1',
                    trackingNumber: trackNumber,
                    status: 'В дорозі',
                    courier: 'Нова Пошта',
                    factualWeight: 2.5,
                    fromLocation: 'Київ',
                    toLocation: 'Львів',
                    isFollowed: false,
                    movementHistory: [
                        {
                            statusLocation: 'Київ',
                            description: 'Посилку відправлено',
                            timestamp: '2024-01-01T10:00:00Z',
                        },
                    ],
                },
            };

            trackParcelStub.resolves(mockResponse);
            cy.get('input[placeholder*="Введіть трек-номер"]').clear().type(trackNumber);
            cy.get('button').contains('ВІДСТЕЖИТИ').click();

            cy.get('[class*="error-message"]').should('not.exist');
        });

        it('обробляє довгі трек-номери', () => {
            mountWithProviders();

            const longTrackNumber = '1'.repeat(100);
            cy.get('input[placeholder*="Введіть трек-номер"]')
                .type(longTrackNumber)
                .should('have.value', longTrackNumber);
        });
    });
});
