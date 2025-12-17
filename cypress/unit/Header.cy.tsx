import { createMemoryRouter, RouterProvider } from 'react-router';
import { AuthContext } from '../../context/AuthContext';
import { Header } from './Header';

describe('<Header />', () => {
    let router: any;
    let navigateSpy: Cypress.Agent<sinon.SinonSpy>;

    const mountHeader = (authState: any) => {
        router = createMemoryRouter(
            [
                {
                    path: '/',
                    element: (
                        <AuthContext.Provider value={authState}>
                            <Header />
                        </AuthContext.Provider>
                    ),
                },
            ],
            {
                initialEntries: ['/'],
            },
        );

        navigateSpy = cy.spy(router, 'navigate').as('navigateSpy');

        cy.mount(<RouterProvider router={router} />);
    };

    it('нічого не показує при loading = true', () => {
        mountHeader({
            user: null,
            isAuthenticated: false,
            token: null,
            loading: true,
            error: null,
            login: cy.stub(),
            logout: cy.stub(),
            clearError: cy.stub(),
        });

        cy.get('header').should('not.exist');
    });

    it("показує кнопки 'Увійти' і 'Зареєструватися', якщо користувач не авторизований", () => {
        mountHeader({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            error: null,
            login: cy.stub(),
            logout: cy.stub(),
            clearError: cy.stub(),
        });

        cy.get('button').contains('Увійти').should('exist').and('be.visible');

        cy.get('button').contains('Зареєструватися').should('exist').and('be.visible');
    });

    it("клік по кнопці 'Увійти' → navigate('/login')", () => {
        mountHeader({
            loading: false,
            isAuthenticated: false,
            user: null,
            login: cy.stub(),
            logout: cy.stub(),
            clearError: cy.stub(),
        });

        cy.get('button').contains('Увійти').click();
        cy.get('@navigateSpy').should('have.been.calledWith', '/login');
    });

    it("клік по кнопці 'Зареєструватися' → navigate('/register')", () => {
        mountHeader({
            loading: false,
            isAuthenticated: false,
            user: null,
            login: cy.stub(),
            logout: cy.stub(),
            clearError: cy.stub(),
        });

        cy.get('button').contains('Зареєструватися').click();
        cy.get('@navigateSpy').should('have.been.calledWith', '/register');
    });

    it("клік по логотипу → navigate('/')", () => {
        mountHeader({
            loading: false,
            isAuthenticated: false,
            user: null,
            login: cy.stub(),
            logout: cy.stub(),
            clearError: cy.stub(),
        });

        cy.get("img[alt='logo']").click();
        cy.get('@navigateSpy').should('have.been.calledWith', '/');
    });
});
