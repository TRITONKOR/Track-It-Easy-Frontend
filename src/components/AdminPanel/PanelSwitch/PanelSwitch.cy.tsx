import { MemoryRouter } from 'react-router';
import { AuthContext } from '../../../context/AuthContext';
import PanelSwitch from './PanelSwitch';

describe('<PanelSwitch />', () => {
    const adminUser = {
        id: '1',
        role: 'admin',
        email: 'admin@test.com',
        username: 'admin',
        createdAt: '2025-12-05',
    };

    const normalUser = {
        id: '2',
        role: 'user',
        email: 'user@test.com',
        username: 'user',
        createdAt: '2025-12-05',
    };

    const mountWithUser = (user: any, initialPath = '/') => {
        cy.mount(
            <MemoryRouter initialEntries={[initialPath]}>
                <AuthContext.Provider
                    value={{
                        user,
                        isAuthenticated: !!user,
                        token: 'token',
                        login: cy.stub(),
                        logout: cy.stub(),
                        loading: false,
                        error: null,
                        clearError: cy.stub(),
                    }}
                >
                    <PanelSwitch />
                </AuthContext.Provider>
            </MemoryRouter>,
        );
    };

    it('не рендерить кнопку для неадміна', () => {
        mountWithUser(normalUser);
        cy.get('button').should('not.exist');
    });

    it('рендерить кнопку для адміна на user сторінці', () => {
        mountWithUser(adminUser, '/');
        cy.get('button').should('exist').and('contain.text', 'Перейти до адмін-панель');
    });

    it('рендерить кнопку для адміна на admin сторінці', () => {
        mountWithUser(adminUser, '/admin');
        cy.get('button').should('exist').and('contain.text', 'Перейти до панелі користувача');
    });
});
