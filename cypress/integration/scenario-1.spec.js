/*
* Test cases to cover scenario 1
*/

/// <reference types="cypress" />

describe('Scenario 1', () => {
  const currencies = [
    'BTC',
    'ETH',
    'BCH',
    'DAI',
    'XRP',
    'MANA'
  ]

  beforeEach(() => {
    cy.login()
  })

  it('Verify that the error message is displayed trying to make a deposit', () => {
    cy.intercept('GET', '/api/v3/account_status').as('account_status')
    cy.intercept('GET', '/api/v3/settings').as('settings')
    cy.intercept('GET', '/api/v3/catalogues').as('catalogues')
    cy.intercept('GET', '/api/v3/available_books').as('available_books')
    cy.intercept('GET', '/api/v3/combined_balance?use_preferred_currency=1').as('combined_balance')
    cy.intercept('GET', '/api/v3/ohlc**').as('ohlc')
    cy.visit('/wallet')

    cy.wait('@account_status')
    cy.wait('@settings')
    cy.wait('@catalogues')
    cy.wait('@available_books')
    cy.wait('@combined_balance', { timeout: 30000 })

    currencies.forEach(currency => {
      cy.get(`[for="${currency.toLocaleLowerCase()}"]`).click({ force: true }) // force click due to display: none
      cy.wait('@ohlc')

      cy.contains('Bitcoin')
      cy.get('.moon-arrow_deposit').click()
      cy.get('.modal-dialog').should('be.visible').within(() => {
        cy.get('[data-testid="picker-item"]').first().click()
      })
      cy.get('.modal-content').should('be.visible').within(() => {
        cy.contains('Oops! Something went wrong')
        cy.contains('This transaction exceeds your limit. Increase your account limit to continue.')
        cy.get('[data-testid="modal-close"]').click()
      })
    })
  })
})
