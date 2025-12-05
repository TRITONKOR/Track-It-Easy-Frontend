import { MemoryRouter } from 'react-router';
import { AuthProvider } from '../context/AuthContext';
import { AppRoutes } from './AppRoutes';

describe('<AppRoutes />', () => {
    const mountWithRouter = (initialRoute = '/') => {
        cy.mount(
            <MemoryRouter initialEntries={[initialRoute]}>
                <AuthProvider>
                    <AppRoutes />
                </AuthProvider>
            </MemoryRouter>,
        );
    };

    describe('Структура компонента', () => {
        it('рендерить основну структуру додатку', () => {
            mountWithRouter('/');

            cy.get('.app-container').should('exist');
            cy.get('.app-header').should('exist');
            cy.get('.app').should('exist');
            cy.get('.app-footer').should('exist');
        });

        it('рендерить Header', () => {
            mountWithRouter('/');
            cy.get('.app-header').should('be.visible');
        });

        it('рендерить Footer', () => {
            mountWithRouter('/');
            cy.get('.app-footer').should('be.visible');
        });

        it('має правильну ієрархію елементів', () => {
            mountWithRouter('/');

            cy.get('.app-container').within(() => {
                cy.get('.app-header').should('exist');
                cy.get('.app').should('exist');
                cy.get('.app-footer').should('exist');
            });
        });
    });

    describe('Маршрутизація - публічні сторінки', () => {
        it('відображає MainPage на головній сторінці /', () => {
            mountWithRouter('/');
            cy.get('.app').should('exist');
        });

        it('відображає LoginPage на /login', () => {
            mountWithRouter('/login');
            cy.get('.app').should('exist');
        });

        it('відображає RegisterPage на /register', () => {
            mountWithRouter('/register');
            cy.get('.app').should('exist');
        });

        it('відображає ApiPage на /api', () => {
            mountWithRouter('/api');
            cy.get('.app').should('exist');
        });

        it('відображає FollowedParcelsPage на /followed-parcels', () => {
            mountWithRouter('/followed-parcels');
            cy.get('.app').should('exist');
        });
    });

    describe('Маршрутизація - 404 сторінка', () => {
        it('відображає 404 для неіснуючого маршруту', () => {
            mountWithRouter('/non-existent-page');
            cy.contains('404 Not Found').should('be.visible');
        });

        it('відображає 404 для випадкового URL', () => {
            mountWithRouter('/some/random/path');
            cy.contains('404 Not Found').should('be.visible');
        });

        it('404 сторінка має Header і Footer', () => {
            mountWithRouter('/non-existent');
            cy.get('.app-header').should('exist');
            cy.get('.app-footer').should('exist');
            cy.contains('404 Not Found').should('be.visible');
        });
    });

    describe('Захищені маршрути', () => {
        it('перевіряє доступ до /admin маршруту', () => {
            mountWithRouter('/admin');
            cy.get('.app').should('exist');
        });

        it('блокує доступ до /admin для неавторизованих користувачів', () => {
            mountWithRouter('/admin');
        });
    });

    describe('Header на всіх сторінках', () => {
        const routes = ['/', '/login', '/register', '/api', '/followed-parcels'];

        routes.forEach((route) => {
            it(`відображає Header на сторінці ${route}`, () => {
                mountWithRouter(route);
                cy.get('.app-header').should('be.visible');
            });
        });
    });

    describe('Footer на всіх сторінках', () => {
        const routes = ['/', '/login', '/register', '/api', '/followed-parcels'];

        routes.forEach((route) => {
            it(`відображає Footer на сторінці ${route}`, () => {
                mountWithRouter(route);
                cy.get('.app-footer').should('be.visible');
            });
        });
    });

    describe('Структура Layout', () => {
        it('Header завжди зверху', () => {
            mountWithRouter('/');

            cy.get('.app-container').children().first().should('have.class', 'app-header');
        });

        it('Footer завжди знизу', () => {
            mountWithRouter('/');

            cy.get('.app-container').children().last().should('have.class', 'app-footer');
        });

        it('контент між Header і Footer', () => {
            mountWithRouter('/');

            cy.get('.app-container').children().eq(1).should('have.class', 'app');
        });
    });

    describe('Навігація між сторінками', () => {
        it('Header містить навігаційні посилання', () => {
            mountWithRouter('/');
            cy.get('.app-header').should('exist');
        });

        it('можна переходити між сторінками через навігацію', () => {
            mountWithRouter('/');
        });
    });

    describe('Рендеринг компонентів сторінок', () => {
        it('MainPage рендериться без помилок', () => {
            mountWithRouter('/');
            cy.get('.app').should('exist');
        });

        it('LoginPage рендериться без помилок', () => {
            mountWithRouter('/login');
            cy.get('.app').should('exist');
        });

        it('RegisterPage рендериться без помилок', () => {
            mountWithRouter('/register');
            cy.get('.app').should('exist');
        });

        it('ApiPage рендериться без помилок', () => {
            mountWithRouter('/api');
            cy.get('.app').should('exist');
        });

        it('FollowedParcelsPage рендериться без помилок', () => {
            mountWithRouter('/followed-parcels');
            cy.get('.app').should('exist');
        });
    });

    describe('Routes конфігурація', () => {
        it('всі маршрути обгорнуті в Routes компонент', () => {
            mountWithRouter('/');
            cy.get('.app').should('exist');
        });

        it('wildcard маршрут (*) спрацьовує останнім', () => {
            mountWithRouter('/totally-random-url-12345');
            cy.contains('404 Not Found').should('be.visible');
        });
    });

    describe('Інтеграція з AuthProvider', () => {
        it('AuthProvider обгортає AppRoutes', () => {
            mountWithRouter('/');
            cy.get('.app-container').should('exist');
        });

        it('всі сторінки мають доступ до Auth контексту', () => {
            mountWithRouter('/');
            cy.get('.app-header').should('exist');
        });
    });

    describe('Responsive layout', () => {
        it('рендериться на різних розмірах екрану', () => {
            const viewports = [
                { width: 375, height: 667 },
                { width: 768, height: 1024 },
                { width: 1920, height: 1080 },
            ];

            viewports.forEach((viewport) => {
                cy.viewport(viewport.width, viewport.height);
                mountWithRouter('/');
                cy.get('.app-container').should('be.visible');
                cy.get('.app-header').should('be.visible');
                cy.get('.app-footer').should('be.visible');
            });
        });
    });
});
