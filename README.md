# cypress-challenge

[![CI](https://github.com/tiagodread/cypress-challenge/actions/workflows/main.yml/badge.svg)](https://github.com/tiagodread/cypress-challenge/actions/workflows/main.yml)
[![cypress-challenge](https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/simple/m9pwci/main&style=flat&logo=cypress)](https://dashboard.cypress.io/projects/m9pwci/runs)

This repository contains cypress tests and applies many approaches:

- It uses github actions to run all tests
- cypress dashboard is integrated
- custom plugin to fetch auth device lin from email and authorize the device (if needed) 
- uses ansible-vault to decrypt gmail api credentials
- and more


## Install


### Pre requisites

- NodeJS
- NPM
- Python

1. Clone this respository:

```sh
$ git clone https://github.com/tiagodread/cypress-challenge.git
```

2. Go to the main folder:

```sh
$ cd cypress-challenge
```

3. Install npm and python dependencies:

```sh
$ npm install
$ pip install -r requirements.txt
```

4. Decrypt `credentials.json` and `gmail_token.json`, you'll need the **vault password**
in order to be able to decrypt the files:

```sh
$ ansible-vault decrypt cypress/plugins/credentials.json

$ ansible-vault decrypt cypress/plugins/gmail_token.json
```

5. Export the environment variables using correct values:

```sh
export CYPRESS_BASE_URL='https://environment-host' # cypress base url under test (local, stage, production)
export CYPRESS_USER_EMAIL='example@example.com' # cypress test user email
export CYPRESS_USER_PASSWORD='123test' # cypress test user password
```

## Running the tests

Gui mode:

```sh
$ npm run cy:open
```

Headless mode:
```sh
$ npm run cy:run
```

Enjoy :)