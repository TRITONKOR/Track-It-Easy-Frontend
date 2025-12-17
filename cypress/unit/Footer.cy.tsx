import Footer from './Footer';

describe('<Footer />', () => {
    beforeEach(() => {
        cy.mount(<Footer />);
    });

    it('рендерить футер', () => {
        cy.get('footer').should('exist');
    });

    it('містить логотип та рік', () => {
        cy.get('footer').within(() => {
            cy.contains('Track It Easy').should('exist');
            cy.contains(new RegExp(`© ${new Date().getFullYear()}`)).should('exist');
        });
    });

    it('має навігаційні посилання', () => {
        cy.get('footer').within(() => {
            cy.get('a').contains('Головна').should('have.attr', 'href', '/');
            cy.get('a').contains('Для розробників').should('have.attr', 'href', '/api');
        });
    });

    it('має контакти та посилання на GitHub', () => {
        cy.get('footer').within(() => {
            cy.contains('Контакти:').should('exist');
            cy.get('a')
                .contains('trackiteasymain@gmail.com')
                .should('have.attr', 'href', 'mailto:trackiteasymain@gmail.com');
            cy.get('a')
                .contains('Репозиторій на GitHub')
                .should('have.attr', 'href', 'https://github.com/TRITONKOR/Track-It-Easy-Backend');
        });
    });
});
