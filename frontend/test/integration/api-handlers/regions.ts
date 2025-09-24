import {http, HttpResponse} from 'msw';
import {RegionsDto} from '../../../src/api/rest/regions.dto';

export const regionsHandler = (responseData: RegionsDto, status = 200) =>
    http.get(`*/api/regions`, () => HttpResponse.json(responseData, {status}));
