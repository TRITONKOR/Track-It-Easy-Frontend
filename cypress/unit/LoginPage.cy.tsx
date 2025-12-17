import { MemoryRouter } from 'react-router';
import { AuthContext } from '../../context/AuthContext';
import { LoginPage } from './LoginPage';

const mountLoginPage = (authValue: any, initialEntries = ['/login']) => {
    cy.mount(
        <MemoryRouter initialEntries={initialEntries}>
            <AuthContext.Provider value={authValue}>
                <LoginPage />
            </AuthContext.Provider>
        </MemoryRouter>,
    );
};

describe('<LoginPage />', () => {
    let loginStub: Cypress.Agent<sinon.SinonStub>;
    let clearErrorStub: Cypress.Agent<sinon.SinonStub>;
    let authValue: any;

    beforeEach(() => {
        loginStub = cy.stub().resolves();
        clearErrorStub = cy.stub();
        authValue = {
            login: loginStub,
            clearError: clearErrorStub,
            error: null,
        };
    });

    it('рендерить форму та всі поля', () => {
        mountLoginPage(authValue);

        cy.get('input[type="email"]').should('exist');
        cy.get('input[type="password"]').should('exist');
        cy.contains('Увійти').should('exist');
        cy.contains('Зареєструватися').should('exist');
        cy.get('h1').should('contain.text', 'Вітаємо знову!');
    });

    it('викликає login при сабміті форми', () => {
        mountLoginPage(authValue);

        cy.get('input[type="email"]').type('test@test.com');
        cy.get('input[type="password"]').type('123456');
        cy.get('button[type="submit"]')
            .click()
            .then(() => {
                expect(loginStub).to.have.been.calledWith('test@test.com', '123456');
            });
    });

    it('клік по лінку "Зареєструватися" веде на /register', () => {
        mountLoginPage(authValue);

        cy.get('a').contains('Зареєструватися').should('have.attr', 'href', '/register');
    });

    it('onChange в полях викликає clearError', () => {
        mountLoginPage(authValue);

        cy.get('input[type="email"]')
            .type('test')
            .then(() => {
                expect(clearErrorStub).to.have.been.called;
            });
        cy.get('input[type="password"]')
            .type('123')
            .then(() => {
                expect(clearErrorStub).to.have.been.called;
            });
    });
});
