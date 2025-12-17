/// <reference types="cypress" />

import { MemoryRouter } from 'react-router';
import { AuthProvider } from '../../context/AuthContext';
import ApiPage from './ApiPage';

describe('<ApiPage />', () => {
    const mountWithProviders = () => {
        cy.mount(
            <MemoryRouter>
                <AuthProvider>
                    <ApiPage />
                </AuthProvider>
            </MemoryRouter>,
        );
    };

    describe('Рендеринг компонента', () => {
        it('рендерить основну структуру сторінки', () => {
            mountWithProviders();

            cy.get('[class*="api-page"]').should('exist');
            cy.contains('Публічне API Track It Easy').should('be.visible');
        });

        it('відображає опис API', () => {
            mountWithProviders();

            cy.contains('Ви можете інтегруватися з нашим сервісом').should('be.visible');
        });

        it('відображає список можливостей', () => {
            mountWithProviders();

            cy.contains('Відстеження посилок за трек-номером').should('be.visible');
            cy.contains('Отримання інформації про статуси').should('be.visible');
            cy.contains('Документація у форматі OpenAPI').should('be.visible');
        });

        it('відображає посилання на Swagger', () => {
            mountWithProviders();

            cy.contains('Перейти до Swagger API')
                .should('be.visible')
                .and('have.attr', 'href')
                .and('include', '/docs');
        });

        it('відображає посилання на GitHub', () => {
            mountWithProviders();

            cy.contains('View project on GitHub')
                .should('be.visible')
                .and('have.attr', 'href', 'https://github.com/TRITONKOR/Track-It-Easy-Backend');
        });
    });

    describe('Без авторизації', () => {
        it('не відображає кнопку генерації API ключа', () => {
            mountWithProviders();

            cy.contains('Згенерувати API ключ').should('not.exist');
        });

        it('не відображає блок з API ключем', () => {
            mountWithProviders();

            cy.get('[class*="api-key-block"]').should('not.exist');
        });
    });

    describe('Посилання', () => {
        it('посилання на Swagger відкривається в новій вкладці', () => {
            mountWithProviders();

            cy.contains('Перейти до Swagger API')
                .should('have.attr', 'target', '_blank')
                .and('have.attr', 'rel', 'noopener noreferrer');
        });

        it('посилання на GitHub відкривається в новій вкладці', () => {
            mountWithProviders();

            cy.contains('View project on GitHub')
                .should('have.attr', 'target', '_blank')
                .and('have.attr', 'rel', 'noopener noreferrer');
        });
    });

    describe('Responsive', () => {
        const viewports = [
            { width: 375, height: 667, name: 'mobile' },
            { width: 768, height: 1024, name: 'tablet' },
            { width: 1920, height: 1080, name: 'desktop' },
        ];

        viewports.forEach((viewport) => {
            it(`рендериться коректно на ${viewport.name}`, () => {
                cy.viewport(viewport.width, viewport.height);
                mountWithProviders();

                cy.get('[class*="api-page"]').should('be.visible');
                cy.contains('Публічне API Track It Easy').should('be.visible');
            });
        });
    });
});
