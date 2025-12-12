describe('Register flow', () => {
    it('registers in successfully and redirects to main page', () => {
        cy.intercept('POST', '/auth/register', {
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
        }).as('register');

        cy.visit('http://localhost:5173/register');

        cy.get('input[placeholder="Логін"]').type('Tester');

        cy.get('input[type="email"]').type('tester@gmail.com');

        cy.get('input[type="password"]').first().type('password');
        cy.get('input[type="password"]').last().type('password');

        cy.get('button[type="submit"]').click();

        cy.wait('@register');
        cy.url().should('eq', `${Cypress.config().baseUrl}/login`);
    });

    it('displays error message for invalid credentials', () => {
        cy.intercept('POST', '/auth/register', {
            statusCode: 401,
            body: { message: 'Registration failed' },
        }).as('failedRegister');

        cy.visit('/register');

        cy.get('input[placeholder="Логін"]').type('Tester');
        cy.get('input[type="email"]').type('wrong@email.com');
        cy.get('input[type="password"]').first().type('wrongpassword');
        cy.get('input[type="password"]').last().type('wrongpassword');

        cy.get('button[type="submit"]').click();

        cy.wait('@failedRegister');
        cy.contains('Registration failed').should('be.visible');
    });

    it('move to login page', () => {
        cy.visit('/register');

        cy.get('a[href="/login"]').click();

        cy.url().should('eq', `${Cypress.config().baseUrl}/login`);
    });
});
