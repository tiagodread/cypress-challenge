// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


/*
* Given an config object, this function will fetch the emails matched using gmail-tester
* @param {Object} config - The config object
* @returns {Array} - An array of emails
*/
Cypress.Commands.add('fetchEmail', (options) => {
	cy.task('gmail:get-email', {
		options: options
	}).then(emails => {
		assert.isAtLeast(
			emails.length,
			1,
			"Expected to find at least one email, but none were found!"
		)

		const body = emails[0].body.html;
		// find the auth_device link in the email body
		const auth_device_link = body.match(/https:\/\/stage.bitso.com\/auth_device\/[^<]*/);
		// assert auth_device_link is not null and has a length of 1
		assert.isNotNull(auth_device_link, 'Expected to find an auth_device link in the email body');
		assert.equal(auth_device_link.length, 1, 'Expected to find exactly one auth_device link in the email body');

		return auth_device_link[0];
	})
})

/*
* Get the Auth Device Link from the email and navigate to it
* @param {Date} after - The date after which the email was sent
*/
Cypress.Commands.add('confirmAuthDeviceLink', (after) => {
	const options = {
		subject: 'Autorizar um novo dispositivo no Bitso',
		to: Cypress.env('USER_EMAIL'),
		from: 'bitso@bitso.com',
		include_body: true,
		wait_time_sec: 2,
		max_wait_time_sec: 30,
		after: after //new Date(2022, 1, 25) // After January 23, 2019
		// before: new Date(2022, 5, 25), // Before May 25rd
	}

	return cy.fetchEmail(options).then(auth_device_link => {
		cy.visit(auth_device_link)
	})
})

/*
* Log in using the email and password and check if the device needs to be confirmed
* @param {String} email - The email to use
* @param {String} password - The password to use
*/
Cypress.Commands.add('login', (email = undefined, password = undefined) => {
	cy.visit('/login')
	cy.get('#client_id').type(email === undefined ? Cypress.env('USER_EMAIL') : email)
	cy.get('#password').type(password === undefined ? Cypress.env('USER_PASSWORD') : password)
	cy.intercept('POST', '/api/v3/login').as('login')
	cy.get('[type="submit"]').click()
	cy.wait('@login')
	cy.wait(Cypress.config('defaultCommandTimeout'))
	// check if authorization is needed for the first time
	cy.url().then((url) => {
		if (url.includes('device_req')) {
			cy.confirmAuthDeviceLink()
		}
	})
})