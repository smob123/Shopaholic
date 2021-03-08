/**
 * sends category products network requests
 */

import Networking from '../../../../utils/networking';

class CategoryProductsModel {
    async getProductsByCategory(category) {
        const options = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };

        const response = await Networking.getJsonResponse(`products?category=${category}&count=5`, options);
        return response.res;
    }
}

export default new CategoryProductsModel();