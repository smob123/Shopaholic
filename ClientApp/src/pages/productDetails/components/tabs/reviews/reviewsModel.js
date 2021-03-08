import Networking from '../../../../../utils/networking';

const baseUrl = 'ProductReviews';

class ReviewsModel {
    async getReviews(productId) {
        const options = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };

        const response = await Networking.getJsonResponse(`${baseUrl}/${productId}`, options);
        return response.res;
    }

    async addReview(productId, rating, comment) {
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                productId,
                rating,
                comment
            })
        };

        const response = await Networking.getJsonResponse(`${baseUrl}/addReview`, options);
        return response.res;
    }

    async removeReview(reviewId) {
        const options = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: `"${reviewId}"`
        };

        return await Networking.getNonJsonResponse(`${baseUrl}/removeReview`, options);
    }
}

export default new ReviewsModel();