/**
 * handles sending and receiveing network requests
 */

// get the website's base url
const protocol = window.location.protocol;
const hostname = window.location.hostname;

let url = `${protocol}//${hostname}`;

if (hostname === 'localhost') {
    url += `:${window.location.port}`;
}

const apiPath = 'api/v1';
url += `/${apiPath}`;

class Networking {

    /**
     * makes a request and expects a json response
     */
    async getJsonResponse(path, options) {
        const request = await fetch(`${url}/${path}`, options)
            .then(async response => {
                const json = await response.json();

                if (response.status !== 200) {
                    const message = json.err;
                    return { status: response.status, message };
                }

                return { status: response.status, res: json.res };
            });

        return request;
    }

    /**
     * makes a request and expects a non json response
     */
    async getNonJsonResponse(path, options) {
        const request = await fetch(`${url}/${path}`, options)
            .then(async response => {

                if (response.status !== 200) {
                    const message = (await response.json()).err;
                    return { status: response.status, message };
                }

                return { status: response.status, res: response.res };
            });

        return request;
    }
}

export default new Networking();