/**
 * sends auth network requests
 */

import Networking from '../../utils/networking';

class AuthModel {

    async login(email, password) {
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        };

        return await this.makeRequest('login', options);
    }

    async signup(firstName, lastName, email, password) {
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName, email, password })
        };

        return await this.makeRequest('signup', options);
    }

    async logout() {
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        };
        return await this.makeRequest('logout', options);
    }

    async makeRequest(path, options) {
        return await Networking.getNonJsonResponse(`Auth/${path}`, options);
    }
}

export default new AuthModel();