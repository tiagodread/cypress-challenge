/*
* Test cases to cover scenario 2
*/

/// <reference types="cypress" />

describe('Scenario 2', () => {
  beforeEach(() => {
    cy.login()
  })

  it('The user should not be able to add beneficiaries using invalid PIN', () => {
    cy.intercept('GET', '/api/v3/account_status').as('account_status')
    cy.intercept('GET', '/api/v3/settings').as('settings')
    cy.intercept('GET', '/api/v3/get_exchange_rates/mxn').as('get_exchange_rates')
    cy.intercept('GET', '/api/v3/catalogues').as('catalogues')
    cy.intercept('GET', '/api/v3/available_books').as('available_books')

    cy.visit('/r/user/beneficiaries/add')
    cy.wait('@account_status')
    cy.wait('@settings')
    cy.wait('@get_exchange_rates')
    cy.wait('@catalogues')
    cy.wait('@available_books')

    const beneficiary = {
      name: 'John',
      lastName: 'Doe',
      day: '10',
      month: '03',
      year: '1990',
      percentage: '10',
    }

    cy.get('#first_name').type(beneficiary.name)
    cy.get('#last_name').type(beneficiary.lastName)
    cy.get('#day').type(`${beneficiary.day}{enter}`)
    cy.get('#month').type(`${beneficiary.month}{enter}`)
    cy.get('#year').type(`${beneficiary.year}{enter}`)
    cy.get('#percentage').type(beneficiary.percentage)
    cy.get('[for="relationship"]').click().type('{downarrow}{downarrow}{enter}')
    cy.get('[data-testid="add-beneficiary-button"]').click()

    cy.get('[data-testid="confirm-beneficiary-modal"]').should('be.visible').within(() => {
      Object.entries(beneficiary).forEach((_, value) => {
        cy.contains(value)
      });
      cy.intercept('POST', '/api/v3/beneficiaries/**').as('beneficiaries')
      cy.get('#pin').type('1234')
      cy.get('[type="primary"]').click({ timeout: 30000 })
      cy.wait('@beneficiaries', { timeout: 30000 }).then(xhr => {
        expect(xhr.response.statusCode).to.eq(401)
        expect(xhr.response.body).to.eql({ "success": false, "error": { "code": "0204", "message": "Incorrect PIN" } }
        )
      })
    })
  })
})