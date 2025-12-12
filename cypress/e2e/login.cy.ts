describe('Login flow', () => {
    it('logs in successfully and redirects to main page', () => {
        cy.intercept('POST', '/auth/login', {
            statusCode: 200,
            body: {
                accessToken: 'token123',
                user: {
                    id: '1',
                    email: 'sasalahotskij@gmail.com',
                    username: 'Tester',
                    role: 'user',
                    createdAt: new Date().toISOString(),
                },
            },
        }).as('login');

        cy.visit('/login');

        cy.get('input[type="email"]').type('sasalahotskij@gmail.com');
        cy.get('input[type="password"]').type('password');

        cy.get('button[type="submit"]').click();

        cy.wait('@login');
        cy.url().should('eq', `${Cypress.config().baseUrl}/`);
    });

    it('displays error message for invalid credentials', () => {
        cy.intercept('POST', '/auth/login', {
            statusCode: 401,
            body: { message: 'Неправильна пошта або пароль' },
        }).as('failedLogin');

        cy.visit('/login');

        cy.get('input[type="email"]').type('wrong@email.com');
        cy.get('input[type="password"]').type('wrongpassword');

        cy.get('button[type="submit"]').click();

        cy.wait('@failedLogin');
        cy.contains('Неправильний email або пароль').should('be.visible');
    });

    it('move to register page', () => {
        cy.visit('/login');

        cy.get('a[href="/register"]').click();

        cy.url().should('eq', `${Cypress.config().baseUrl}/register`);
    });
});
