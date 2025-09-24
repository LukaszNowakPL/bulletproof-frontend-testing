import {http, HttpResponse} from 'msw';
import {CountriesDto} from '../../../src/api/rest/countries.dto';

export const countriesHandler = (responseData: CountriesDto, status = 200) =>
    http.get(`*/api/countries`, () => HttpResponse.json(responseData, {status}));
