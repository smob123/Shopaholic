/**
 * sends orders network requests
 */

import Networking from '../../utils/networking';

class OrdersModel {
    async getUserOrders() {
        const options = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };

        const res = await Networking.getJsonResponse('orders', options);
        return res.res;
    }
}

export default new OrdersModel();