/**
 * sends products network requests
 */

class ProductsModel {
    async fetchProducts(params = null) {
        let url = 'api/v1/products';

        if (params) {
            url += '?';
            let appendedParam = false;
            for (const key of Object.keys(params)) {
                url += appendedParam ? '&' : '';
                url += `${key}=${params[key]}`;

                if (!appendedParam) {
                    appendedParam = true;
                }
            }
        }

        let json = await (await fetch(url)).json();

        return json.res;
    }
}

export default new ProductsModel();