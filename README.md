# End To End UI Test Automation

This project demonstrates the UI test automation in typescript using cucumber and playwright framework.

---

## Table of Contents

- [About the Project](#about-the-project)
- [Prerequisites](#prerequisites)
- [Running Tests](#running-tests)
- [Directory Structure](#directory-structure)

---

## About the Project

This project uses following node modules for UI Test automation :

| Module Name      | Description                                                              |
|------------------|--------------------------------------------------------------------------|
| **playwright**   | Core framework setup used to interact with Browser                       |
| **cucumber**     | Provides capabilites to write and execute tests in BDD style             |
| **winston**      | Provides custom console/file message logging functionality               |
| **colors**       | Facilitates printing of messages in colors based on message type         |
| **faker-js**     | Helps to generate random data used for testing                           |
| **dotenv**       | Loads information from .env file and import it in test environment       |
| **rimraf**       | Helps to clean downloads and report folder before tests                  |
| **sharp**        | Helps to resolution data of image file                                   |
| **ts-node**      | Helps to compile typescript code                                         |

---

## Prerequisites

Ensure you have the following installed before proceeding:
- **Node.js** (version >= 22.11.0)
- **npm** (version >= 10.9.0)

Install Node.js and npm from [Node.js](https://nodejs.org/).

---

## Running Tests

1. Clone the repository:
   ```bash
   git clone  https://github.com/garg-tarun/bdd_typescript_ui_automation.git

2. Install node modules:
   ```bash
   npm install

3. Run UI Tests on default browser:
   ```bash
   npm run cucumber

4. Run UI Tests on a specific browser:

   ```bash
   npm run cucumber -- --world-parameters '{"browser":"webkit"}' 

## Directory Structure

| Directory Name      | Description                                                              |
|---------------------|--------------------------------------------------------------------------|
| **downloads**       | This is location of downloaded image files                               |
| **env**             | This folder contains .env file with test environment variables           |
| **reports**         | This folder contains test report file in json & html format              |
| **src/features**    | This folder contains test feature file |
| **src/hooks**       | This folder contains hooks function used for setting up test enviornment |
| **src/logger**      | This folder contains Logger class to enable custom logging |
| **src/page_objects**| This folder contains page object models |
| **src/step-definitions**| This folder contains definitions of steps used in feature file|
| **src/utils**       | This folder contains utility modules to support automation |
| **src/world**       | This folder contains custom cucumber world implementation to share context|

## Further Improvements

- Add support for parallel execution of feature files
- Add support to capture video and retain in case of failure 
