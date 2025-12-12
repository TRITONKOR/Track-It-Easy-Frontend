describe('Track parcel flow', () => {
    it('tracks parcel and shows details', () => {
        const trackingNumber = 'AA123456789UA';

        cy.intercept('POST', '/track', {
            statusCode: 200,
            body: {
                success: true,
                data: {
                    id: 'p1',
                    trackingNumber,
                    status: 'В дорозі',
                    courier: 'NovaPoshta',
                    factualWeight: 2,
                    fromLocation: 'Kyiv',
                    toLocation: 'Lviv',
                    isFollowed: false,
                    movementHistory: [
                        {
                            statusLocation: 'now',
                            description: 'Посилка прибула у відділення',
                            timestamp: '2024-12-15T12:00:00.000Z',
                        },
                    ],
                },
            },
        }).as('trackParcel');

        cy.visit('/');

        cy.get('input[type="text"]').type(trackingNumber);

        cy.contains('button', 'ВІДСТЕЖИТИ').click();

        cy.wait('@trackParcel');

        cy.contains(trackingNumber).should('be.visible');

        cy.contains('В дорозі').should('be.visible');

        cy.contains('Відправник:').should('exist');
        cy.contains('Kyiv').should('exist');

        cy.contains('Отримувач:').should('exist');
        cy.contains('Lviv').should('exist');

        cy.contains('Вага:').should('exist');
        cy.contains('2').should('exist');

        cy.contains('Посилка прибула у відділення').should('exist');
    });

    it('follows parcel updates', () => {
        window.localStorage.setItem('accessToken', 'token123');

        cy.intercept('PATCH', '/auth/refresh', {
            statusCode: 200,
            body: {
                accessToken: 'token123',
                user: {
                    id: 'admin1',
                    username: 'Admin',
                    email: 'admin@test.com',
                    role: 'admin',
                },
            },
        }).as('refresh');

        const trackingNumber = 'AA123456789UA';

        cy.intercept('POST', '/track', {
            statusCode: 200,
            body: {
                success: true,
                data: {
                    id: 'p1',
                    trackingNumber,
                    status: 'В дорозі',
                    courier: 'NovaPoshta',
                    factualWeight: 2,
                    fromLocation: 'Kyiv',
                    toLocation: 'Lviv',
                    isFollowed: false,
                    movementHistory: [
                        {
                            statusLocation: 'now',
                            description: 'Посилка прибула у відділення',
                            timestamp: '2024-12-15T12:00:00.000Z',
                        },
                    ],
                },
            },
        }).as('trackParcel');

        cy.intercept('POST', '/follow-parcel', {
            statusCode: 201,
            body: {},
        }).as('followParcel');

        cy.visit('/');

        cy.wait('@refresh');

        cy.get('input[type="text"]').type(trackingNumber);

        cy.contains('button', 'ВІДСТЕЖИТИ').click();

        cy.wait('@trackParcel');

        cy.contains(trackingNumber).should('be.visible');

        cy.get('button[aria-label="Зберегти посилку"]').click();

        cy.wait('@followParcel');

        cy.get('button[aria-label="Прибрати із збережених"]').should('exist');
    });

    it('unfollows parcel updates', () => {
        window.localStorage.setItem('accessToken', 'token123');

        cy.intercept('PATCH', '/auth/refresh', {
            statusCode: 200,
            body: {
                accessToken: 'token123',
                user: {
                    id: 'admin1',
                    username: 'Admin',
                    email: 'admin@test.com',
                    role: 'admin',
                },
            },
        }).as('refresh');

        const trackingNumber = 'AA123456789UA';

        cy.intercept('POST', '/track', {
            statusCode: 200,
            body: {
                success: true,
                data: {
                    id: 'p1',
                    trackingNumber,
                    status: 'В дорозі',
                    courier: 'NovaPoshta',
                    factualWeight: 2,
                    fromLocation: 'Kyiv',
                    toLocation: 'Lviv',
                    isFollowed: true,
                    movementHistory: [
                        {
                            statusLocation: 'now',
                            description: 'Посилка прибула у відділення',
                            timestamp: '2024-12-15T12:00:00.000Z',
                        },
                    ],
                },
            },
        }).as('trackParcel');

        cy.intercept('POST', '/unfollow-parcel', {
            statusCode: 201,
            body: {},
        }).as('unfollowParcel');

        cy.visit('/');

        cy.wait('@refresh');

        cy.get('input[type="text"]').type(trackingNumber);

        cy.contains('button', 'ВІДСТЕЖИТИ').click();

        cy.wait('@trackParcel');

        cy.contains(trackingNumber).should('be.visible');

        cy.get('button[aria-label="Прибрати із збережених"]').click();

        cy.wait('@unfollowParcel');

        cy.get('button[aria-label="Зберегти посилку"]').should('exist');
    });
});
