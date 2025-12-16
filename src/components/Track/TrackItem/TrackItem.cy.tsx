import { TrackItem } from './TrackItem';

describe('<TrackItem />', () => {
    const defaultProps = {
        status: 'in-transit',
        description: 'Посилку відправлено',
        timestamp: '2025-12-05T12:34:56Z',
        courier: 'NovaPoshta',
    };

    it('рендерить контейнер і текст', () => {
        cy.mount(<TrackItem {...defaultProps} />);
        cy.get('[class*="track-item-container"]').should('exist');
        cy.get('[class*="text"]').should('contain.text', defaultProps.description);
    });

    it('відображає правильний кур’єр та іконку', () => {
        cy.mount(<TrackItem {...defaultProps} />);
        cy.get('[class*="courier-name"]').should('contain.text', 'Нова Пошта');
        cy.get('img[class*="courier-icon"]')
            .should('have.attr', 'src')
            .and('include', 'nova-poshta.svg');
    });

    it('відображає дату та час', () => {
        cy.mount(<TrackItem {...defaultProps} />);
        cy.get('[class*="date"]').should('exist');
        cy.get('[class*="time"]').should('exist');
    });

    it('підтримує інші кур’єри', () => {
        const couriers = [
            { courier: 'Ukrposhta', name: 'Укрпошта', icon: 'ukrposhta.svg' },
            { courier: 'MeestExpress', name: 'Meest Express', icon: 'meest.svg' },
        ];

        couriers.forEach((c) => {
            cy.mount(<TrackItem {...defaultProps} courier={c.courier} />);
            cy.get('[class*="courier-name"]').should('contain.text', c.name);
            cy.get('img[class*="courier-icon"]').should('have.attr', 'src').and('include', c.icon);
        });
    });
});
