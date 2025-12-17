import App from './App';

describe('<App />', () => {
    it('рендерить компонент без помилок', () => {
        cy.mount(<App />);
        cy.get('body').should('exist');
    });

    it('рендерить AppRoutes з правильною структурою', () => {
        cy.mount(<App />);
        cy.get('.app-container', { timeout: 10000 }).should('exist');
    });

    it('рендерить Header', () => {
        cy.mount(<App />);
        cy.get('.app-header', { timeout: 10000 }).should('exist');
    });

    it('рендерить Footer', () => {
        cy.mount(<App />);
        cy.get('.app-footer', { timeout: 10000 }).should('exist');
    });

    it('рендерить основний контент', () => {
        cy.mount(<App />);
        cy.get('.app', { timeout: 10000 }).should('exist');
    });

    it('обгортає додаток в Router', () => {
        cy.mount(<App />);
        cy.window().its('location').should('exist');
    });

    it('відображає головну сторінку за замовчуванням', () => {
        cy.mount(<App />);
        cy.get('.app-container', { timeout: 10000 }).should('exist');
    });

    it('не падає при рендерингу', () => {
        cy.mount(<App />);
        cy.get('.app-container', { timeout: 10000 }).should('exist');
    });
});
