/**
 * sends checkout network requests
 */

import Networking from '../../utils/networking';

class CheckoutModel {
    async checkout() {
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        };

        const response = await Networking.getJsonResponse('Cart/purchase', options);
        return response.res;
    }
}

export default new CheckoutModel();