describe('Test the Homepage', () => {
    it('Loader overlay', () => {
        openHomepage();
        cy.get('.loader-overlay');
        cy.get('.loader-overlay').should('be.css', 'opacity', '0');
        cy.get('.loader-overlay').should('be.css', 'pointer-events', 'none');
    });
    it('Cookie overlay', () => {
        //openHomepage();

        cy.get('.cookie-note');

        cy.get('.cookie-note').should('be.css', 'opacity', '1');
        cy.get('.cookie-note').should('be.css', 'pointer-events', 'all');

        cy.get('.disableCookieButton').click();

        cy.get('.cookie-note').should('be.css', 'opacity', '0');
        cy.get('.cookie-note').should('be.css', 'pointer-events', 'none');
    });
    it('Header login button', () => {
        cy.get('.header-login-button');
        cy.get('.header-login-button').click();
        cy.url().should('include', '/login');
    });
    it('Contribute to GitHub button', () => {
        openHomepage();
        hideCookieOverlay();
        cy.get('.contribute-button');
        cy.get('.contribute-button').click();
        cy.url().should('include', 'github.com');
    });
});

function hideCookieOverlay() {
    cy.window().then((win) => {
        win.eval('disableCookieOverlay()');
    });
}

function openHomepage() {
    cy.visit('officr.gabrielheinzer.ch');
}