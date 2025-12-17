import * as TrackApiModule from '../../../api/track.api';
import { AuthContext } from '../../../context/AuthContext';
import { TrackDetails } from './TrackDetails';

describe('<TrackDetails />', () => {
    const defaultPackage = {
        trackingNumber: 'ABC123',
        daysInTransit: 5,
        fromLocation: 'Kyiv',
        toLocation: 'Lviv',
        isFollowed: false,
        weight: 2.5,
        status: 'in-transit',
    };

    const authValue = {
        user: {
            id: '1',
            role: 'user',
            email: 'user@test.com',
            username: 'user',
            createdAt: '2025-12-05',
        },
        isAuthenticated: true,
        token: 'fake-token',
        login: () => {},
        logout: () => {},
        loading: false,
        error: null,
        clearError: () => {},
    };

    let followStub: Cypress.Agent<sinon.SinonStub>;
    let unfollowStub: Cypress.Agent<sinon.SinonStub>;

    beforeEach(() => {
        followStub = cy.stub(TrackApiModule.TrackApi, 'followParcel').resolves() as any;
        unfollowStub = cy.stub(TrackApiModule.TrackApi, 'unfollowParcel').resolves() as any;
    });

    it('рендерить трек-номер і статус', () => {
        cy.mount(
            <AuthContext.Provider value={authValue}>
                <TrackDetails package={defaultPackage} />
            </AuthContext.Provider>,
        );

        cy.get('h1').should('contain.text', defaultPackage.trackingNumber);
        cy.get(`.track-details__status`).should('contain.text', defaultPackage.status);
    });

    it('кнопка слідкування працює', () => {
        cy.mount(
            <AuthContext.Provider value={authValue}>
                <TrackDetails package={defaultPackage} />
            </AuthContext.Provider>,
        );

        cy.get('button.follow-parcel__button')
            .click()
            .then(() => {
                expect(followStub).to.have.been.calledOnce;
                expect(unfollowStub).not.to.have.been.called;
            });
    });
});
