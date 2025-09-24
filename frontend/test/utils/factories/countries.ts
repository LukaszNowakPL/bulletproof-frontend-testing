import {CountryDto} from '../../../src/api/rest/countries.dto';
import * as Factory from 'factory.ts';
import {faker} from '@faker-js/faker';

export const countryFactory = Factory.Sync.makeFactory<CountryDto>({
    id: faker.number.int(),
    name: faker.location.country(),
    is_in_schengen: true,
});
