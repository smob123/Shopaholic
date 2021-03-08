/**
 * sends top selling network requests
 */

import Networking from '../../../../utils/networking';

class FeaturedProductsModel {
    async fetchRandomProductsByCount(count) {
        const options = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };

        const json = await Networking.getJsonResponse(`Products/random/${count}`, options);
        return json.res;
    }
}

export default new FeaturedProductsModel();