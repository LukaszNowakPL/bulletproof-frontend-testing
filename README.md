# Bulletproof frontend testing

This repository supports a series of talks and workshops focused on testing frontend applications the bulletproof way. Its aim is to provide testing suites, cases and patterns as well as rich explanations of their rationales.

It contains an example React SPA with a thin layer of supporting backend. Testing suites cover integration, functionality, accessibility, visual regression and so on.

The talks were performed during:

- [Voxxed Days Crete](https://crete.voxxeddays.com/) conference talk (26-27.09.2025 - Heraklion, Crete Island, Greece)
- [React Alicante](https://reactalicante.es/) workshop (02-04.10.2025 - Alicante, Spain)

## Project structure

The project contains React frontend application and supporting backend stub service based on `json-server` component.

Test examples are stored on [/frontend/test](/frontend/test) directory. They are grouped into several testing suites.

The [integration](/frontend/test/integration) ones are focused on testing high level components (views), strictly related with React router's route view pattern. There also are examples of routing configuration tests as well as asserting integration with state management based on React Context.

The [functional](/frontend/test/functional) ones focus on overall functional assertions of the application. They are similar to e2e tests, however, the communication with backend service is mocked. They also might be similar to integration cases, however, this is due to business logic of an application. Integration and functional tests become significantly different for applications being a stepper user journeys for example.

The [snapshot](/frontend/test/snapshot) ones focus on static snapshot analysis. The term of a snapshot here means a page being in a certain state - i.e. an initial view, focused field, validation triggered and others. Snapshots are the basis for accessibility and visual snapshot comparison tests.

The `visual snapshot comparison` tests cover visual regression of application. They create a visual snapshot (png picture) of a page and compare it with the so-called golden snapshot. They use containerized solutions, so snapshots generated on a pipeline or on any local machines are equal down to a single pixel.

The `accessibility tests` consist of two branches. First performs a series of accessibility-related audits over a given snapshot. Currently, this is Axe and Lighthouse auditing. It also performs accessibility tree regression by comparing snapshots representation stored on static yml files. The second branch is a functional user journey with navigation performed using keyboards only. This is for simulating using assistive technologies for navigation. Such scenarios are part of the functional tests suite.

## Commands available

Please run commands on a given order. 

`npm install` for installing dependencies of overall project.

`npm run install-all` for installing dependencies for backend and frontend components respectively.

`npm run all-components` will fire backend and frontend components locally. Frontend application will automatically open in the browser using http://localhost:3000/ url. Backend service is available under http://localhost:4000/ url.

`npm run test-frontend`will fire all tests of a frontend project. **Please note**, that it may automatically download a significant amount of dependencies. Don't use it when you are using mobile or limited internet connection.

### Testing commands

**Heavy downloads note**: Snapshot tests (covering visual regression and accessibility) require Playwright docker image to be installed. Please make sure to fire them while using stable, non-mobile internet access, as the image is quite heavy.

**Other software requirement note**: To run snapshot tests locally, you must have [Docker Desktop](https://docs.docker.com/desktop/) installed and fired. The test command will take it from there.

`npm run test-frontend:windows` is a `npm run test-frontend` command dedicated to Windows users only. This alteration performs additional changes on aria snapshot files, due to different new line separator approaches for Windows and Linux (Git) systems.

`npm run test-frontend` for all tests of frontend project. This will fire integration, functional, accessibility and snapshot testing suites.

`npm run test-frontend-integration` runs integration testing suite in Vitest, MSW and Testing library.

`npm run test-frontend-functional` runs functional testing suite in Playwright. It tests against production build with mocked backend integration, covering functionalities and partially accessibility.

`npm run test-frontend-snapshot:windows` runs snapshot testing suite in Playwright, Lighthouse and Docker Desktop. It tests against production build with mocked backend integration, covering visual regression and partially accessibility.

## Presentation

The repository contains pdf presentations displayed during meetings. Please note the language prefix used on file's name.

## Contact

- [GitHub profile](https://github.com/LukaszNowakPL/)
- [Linkedin profile](https://linkedin.com/in/%C5%82ukasz-nowak-533844101)
