import { MemoryRouter } from 'react-router';
import { RegisterPage } from './RegisterPage';

const mountRegisterPage = () => {
    cy.mount(
        <MemoryRouter>
            <RegisterPage />
        </MemoryRouter>,
    );
};

describe('<RegisterPage />', () => {
    it('рендерить форму та всі поля', () => {
        mountRegisterPage();

        cy.get('input[placeholder="Логін"]').should('exist');
        cy.get('input[placeholder="Електронна пошта"]').should('exist');
        cy.get('input[placeholder="Пароль"]').should('exist');
        cy.get('input[placeholder="Підтвердження паролю"]').should('exist');
        cy.contains('Створити акаунт').should('exist');
        cy.get('h1').should('contain.text', 'Створення акаунта');
        cy.contains('Увійти').should('have.attr', 'href', '/login');
    });

    it('показує помилку, якщо паролі не збігаються', () => {
        mountRegisterPage();

        cy.get('input[placeholder="Пароль"]').type('123456');
        cy.get('input[placeholder="Підтвердження паролю"]').type('654321');
        cy.get('button[type="submit"]').click();

        cy.get('[class*="error"]', { timeout: 2000 })
            .should('exist')
            .and('contain.text', 'Паролі не збігаються');
    });

    it('клік по лінку "Увійти" веде на /register', () => {
        mountRegisterPage();

        cy.get('a').contains('Увійти').should('have.attr', 'href', '/login');
    });
});
