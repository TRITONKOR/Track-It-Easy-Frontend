beforeEach(() => {
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
});

describe('Admin panel: users', () => {
    it('loads users list and displays table', () => {
        cy.intercept('GET', '/users', {
            statusCode: 200,
            body: [
                {
                    id: 'u1',
                    username: 'Tester',
                    email: 'tester@gmail.com',
                    role: 'user',
                    createdAt: '2024-12-01T10:00:00.000Z',
                },
                {
                    id: 'u2',
                    username: 'Admin',
                    email: 'admin2@gmail.com',
                    role: 'admin',
                    createdAt: '2024-11-10T15:00:00.000Z',
                },
            ],
        }).as('getUsers');

        cy.visit('/admin');

        cy.wait('@refresh');
        cy.wait('@getUsers');

        cy.contains('Керування користувачами').should('be.visible');

        cy.contains('Tester').should('exist');
        cy.contains('tester@gmail.com').should('exist');
        cy.contains('Користувач').should('exist');

        cy.contains('Admin').should('exist');
        cy.contains('admin2@gmail.com').should('exist');
        cy.contains('Адмін').should('exist');
    });

    it('deletes a user', () => {
        cy.intercept('GET', '/users', {
            statusCode: 200,
            body: [
                {
                    id: 'u1',
                    username: 'Tester',
                    email: 'tester@gmail.com',
                    role: 'user',
                    createdAt: '2024-12-01T10:00:00.000Z',
                },
                {
                    id: 'u2',
                    username: 'Admin',
                    email: 'admin2@gmail.com',
                    role: 'admin',
                    createdAt: '2024-11-10T15:00:00.000Z',
                },
            ],
        }).as('getUsers');

        cy.intercept('DELETE', '/users/u1', {
            statusCode: 200,
        }).as('deleteUser');

        cy.visit('/admin');
        cy.wait('@refresh');

        cy.wait('@getUsers');

        cy.contains('button', 'Видалити').first().click();

        cy.wait('@deleteUser');
    });

    it('creates a new user', () => {
        cy.intercept('GET', '/users', {
            statusCode: 200,
            body: [],
        }).as('getUsers');

        cy.intercept('POST', '/users', {
            statusCode: 201,
            body: {
                id: 'u3',
                username: 'NewUser',
                email: 'test@gmail.com',
                role: 'user',
                createdAt: '2024-12-20T10:00:00.000Z',
            },
        }).as('createUser');

        cy.visit('/admin');
        cy.wait('@refresh');

        cy.wait('@getUsers');

        cy.contains('label', "Ім'я користувача").parent().find('input').type('NewUser');
        cy.get('input[type="email"]').type('test@gmail.com');
        cy.get('input[type="password"]').type('password123');
        cy.contains('button', 'Додати користувача').click();

        cy.wait('@createUser');
    });
});

describe('Admin panel: parcels', () => {
    it('loads parcels list and displays table', () => {
        cy.intercept('POST', '/parcels', {
            statusCode: 200,
            body: [
                {
                    id: 'p1',
                    trackingNumber: 'AA123',
                    status: 'delivered',
                    factualWeight: 2,
                    fromLocation: 'Kyiv',
                    toLocation: 'Lviv',
                    isFollowed: false,
                    movementHistory: [],
                },
            ],
        }).as('getParcels');

        cy.visit('/admin');
        cy.wait('@refresh');

        cy.contains('button', 'Посилки').click();

        cy.wait('@getParcels');

        cy.contains('Список посилок').should('be.visible');
        cy.contains('AA123').should('be.visible');
        cy.contains('Доставлено').should('be.visible');
    });

    it('shows parcel details on row click', () => {
        cy.intercept('POST', '/parcels', {
            statusCode: 200,
            body: [
                {
                    id: 'p1',
                    trackingNumber: 'AA123',
                    status: 'delivered',
                    factualWeight: 2,
                    fromLocation: 'Kyiv',
                    toLocation: 'Lviv',
                    isFollowed: false,
                    movementHistory: [],
                },
            ],
        }).as('getParcels');

        cy.visit('/admin');
        cy.wait('@refresh');

        cy.contains('button', 'Посилки').click();

        cy.wait('@getParcels');

        cy.contains('Список посилок').should('be.visible');

        cy.contains('button', 'Деталі').first().click();

        cy.contains('Деталі посилки').should('be.visible');
    });

    it('deletes a parcel', () => {
        cy.intercept('POST', '/parcels', {
            statusCode: 200,
            body: [
                {
                    id: 'p1',
                    trackingNumber: 'AA123',
                    status: 'delivered',
                    factualWeight: 2,
                    fromLocation: 'Kyiv',
                    toLocation: 'Lviv',
                    isFollowed: false,
                    movementHistory: [],
                },
            ],
        }).as('getParcels');

        cy.intercept('DELETE', '/parcels/p1', {
            statusCode: 200,
        }).as('deleteParcel');

        cy.visit('/admin');
        cy.wait('@refresh');

        cy.contains('button', 'Посилки').click();

        cy.wait('@getParcels');

        cy.contains('button', 'Видалити').first().click();

        cy.wait('@deleteParcel');
    });
});
