import {DefaultBodyType, delay, http, HttpResponse, StrictRequest} from 'msw';
import {AirportDto, AirportModel, AirportsDto} from '../../../src/api/rest/airports.dto';

/**
 * These are MSW handlers for mocking api calls.
 * Besides their mocking purposes, they become a way to assert integration with backend services. This is why we must handle only api calls we expect to be called during the scenario.
 * If the tested component will hit some unhandled endpoint, it's considered to be a functional change, and we will be informed of such a fact on the console.
 */

/**
 * Note the fact that the expected response data is passed as a handler argument.
 * This is a good pattern, as test cases are owners of data shaping journeys they assert.
 */
export const airportsHandler = (responseData: AirportsDto, status = 200) =>
    http.get('*/api/airports', () => HttpResponse.json(responseData, {status}));

/**
 * During handling api calls we should be strict down to all path params, each piece of a request body, query params or a header if they are applicable to the call.
 * That's why we will resolve an api call for only given id of an airport, not all of them.
 */
export const airportHandler = (id: number, responseData: AirportDto, status = 200) =>
    http.get(`*/api/airports/${id}`, () => HttpResponse.json(responseData, {status}));

/**
 * As the body of a post api call usually reflects all actions taken by the client, we must assert if it's in an expected shape.
 * We won't handle calls with unexpected shape, which makes the test fail.
 * Such a solution provides additional complication to testing, however, big attention is always required when it comes to such an important integration with backend services.
 */
export const addAirportHandler = (formData: AirportModel, status = 200) => {
    return http.post('*/api/airports', async ({request}) => {
        /**
         * It will resolve only if request body is equal to formData argument. Headers or cookies can also be part of such logic
         */
        if (await isModelCorrect(formData, request)) {
            /**
             * Delay added to allow to assert form element being disabled during api call.
             */
            await delay();
            if (status == 200) {
                return HttpResponse.json({data: formData}, {status});
            } else {
                return HttpResponse.json(null, {status});
            }
        }
    });
};

/**
 * Note: this function holds only the idea of arguments comparison. Due to simplification purposes it also holds
 * bad developer experience, as the result is affected by order of requestBody and formData elements.
 * It is possible to perform such checks independently of elements order, however, it requires more code to be produced.
 */
const isModelCorrect = async (formData: any, request: StrictRequest<DefaultBodyType>) => {
    const requestBody = await request.clone().text();
    const stringifiedFormData = JSON.stringify(formData);

    if (requestBody === stringifiedFormData) {
        return true;
    } else {
        console.error(
            `Request body of POST ${request.url} call does not match with expected.\nBelow data should match exactly, including appearance order.\n     Api call: ${requestBody}\nExpected data: ${stringifiedFormData}`,
        );
        return false;
    }
};
