/**
 * sends product details network requests
 */

import Networking from '../../utils/networking';

class ProductDetailsModel {
    async fetchProductById(id) {
        const options = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };

        const response = await Networking.getJsonResponse(`Products/${id}`, options);
        return response.res;
    }

    async fetchRandomProductsByCount(count) {
        const options = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };

        const json = await Networking.getJsonResponse(`Products/random/${count}`, options);
        return json.res;
    }

    async getCart() {
        const options = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };
        const response = await Networking.getJsonResponse('Cart', options);
        return response.res;
    }

    async addProduct(itemId, quantity) {
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                itemId,
                quantity
            })
        };
        return await Networking.getNonJsonResponse('Cart/addItem', options);
    }

    async updateProduct(itemId, quantity) {
        const options = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                itemId,
                quantity
            })
        };

        return await Networking.getNonJsonResponse('Cart/updateItemQuantity', options);
    }

    async removeProduct(itemId) {
        const options = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: `"${itemId}"`
        };

        return await Networking.getNonJsonResponse('Cart/deleteItem', options);
    }
}

export default new ProductDetailsModel();