import { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { useSelector } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';

import ReviewsModel from './reviewsModel';

import UserImage from '../../../../../components/nav/images/profile-dark.png';

import Cookies from 'js-cookie';

export default function Reviews({ productId }) {

    const userAuthState = useSelector(store => store.auth);

    // list of the product's reviews
    const [productReviews, setProductReviews] = useState([]);

    // user's review form rating
    const [userRating, setUserRating] = useState(5);
    // user's review form comment
    const [userComment, setUserComment] = useState('');

    useEffect(() => {
        // fetch the product's reviews whenever the product id changes
        (async () => {
            const res = await ReviewsModel.getReviews(productId);
            if (res) {
                setProductReviews(res);
            }
        })();
    }, [productId]);

    /**
     * returns 5 stars.
     * @param count number of highlighted stars
     */
    const getStars = (count) => {
        const stars = [];

        for (let i = 0; i < 5; i++) {
            stars.push(
                <FontAwesomeIcon
                    className={i < count ? 'active' : ''}
                    size='lg'
                    icon={faStar}
                    onClick={() => setUserRating(i + 1)}
                    key={`${Date.now()}_${i}/${count}_rating_star`} />
            );
        }

        return <div>{stars}</div>;
    }

    /**
     * counts the number of reviews that have a certain rating.
     */
    const countReviewsByRating = (rating) => {
        let count = 0;

        for (const review of productReviews) {
            if (review.rating === rating) {
                count++;
            }
        }

        return count;
    }

    /**
     * returns parsed product reviews.
     */
    const getProductReviews = () => {
        const reviewsList = [];

        const authToken = Cookies.get('Auth-Token');

        for (const review of productReviews) {
            // parse the review's date
            const datetime = new Date(review.datetime);
            const reviewDate = `${datetime.getDate()}/${datetime.getMonth() + 1}/${datetime.getFullYear()}`;

            reviewsList.push(
                <div className='d-lg-flex flex-wrap mb-5' key={review.id}>
                    {/* review author's info and rating */}
                    <div className='mb-3 mb-lg-0'>
                        <div className='d-flex align-items-center mb-2'>
                            <img src={UserImage} className='d-block mr-2' alt='user-avatar' />
                            <strong>{review.user.firstName} {review.user.lastName}</strong>
                        </div>

                        {getStars(review.rating)}
                    </div>

                    {/* review's comment */}
                    <div className='review-comment d-flex justify-content-between border ml-lg-5 p-2'>
                        <div>
                            <p>{review.comment}</p>
                            <span className='text-secondary'>{reviewDate}</span>
                        </div>

                        {
                            /* display a delete icon if the current comment belongs to the user */
                            authToken === review.user.id &&
                            <div>
                                <FontAwesomeIcon
                                    className='cursor-pointer ml-3'
                                    icon={faTrashAlt}
                                    size='lg'
                                    onClick={() => removeReview(review.id)} />
                            </div>
                        }
                    </div>
                </div>
            );
        }

        return reviewsList;
    }

    /**
     * sends the user's form input to the server.
     */
    const submitReview = async () => {
        const res = await ReviewsModel.addReview(productId, userRating, userComment);

        if (res) {
            setProductReviews([res, ...productReviews]);
            setUserRating(5);
            setUserComment('');
        }
    }

    /**
     * removes the user's comment from the server and the local state.
     */
    const removeReview = async (reviewId) => {
        // confirm that the user wants to delete the specified review
        const confirmRemoval = window.confirm('Are you sure you want to delete this comment?');

        if (!confirmRemoval) {
            return;
        }

        const res = await ReviewsModel.removeReview(reviewId);

        if (res.status === 200) {
            const newReviewsList = productReviews.filter(review => review.id !== reviewId);
            setProductReviews(newReviewsList);
        }
    }

    return (
        <Container fluid className='reviews-container'>
            <Row>
                <Col className='order-2 order-lg-1' lg={8}>
                    <h5>All Reviews ({productReviews.length})</h5>

                    <div className='my-5'>
                        {getProductReviews()}
                    </div>

                    {userAuthState.isLoggedIn ?
                        <Form className='review-submission-form mt-5' onSubmit={(e) => e.preventDefault()}>
                            <Form.Label>
                                <h6>
                                    Add a rating:
                            </h6>
                            </Form.Label>

                            {getStars(userRating)}

                            <Form.Control
                                required
                                as='textarea'
                                placeholder='What do you think about this product?'
                                className='d-block p-2 my-4 shadow-none'
                                value={userComment}
                                onChange={(e) => setUserComment(e.target.value)} />

                            <Button type='submit' variant='danger' size='lg' className='px-5' onClick={() => submitReview()}>
                                Submit
                            </Button>
                        </Form>

                        :

                        <p className='medium-text'>
                            <Link className='red-text medium-text' to='/auth'>Login</Link> to add a review
                        </p>
                    }
                </Col>

                <Col className='order-1 order-lg-2 mb-5 mb-lg-0 assessment-reviews'>
                    <h5>Assessment Reviews</h5>

                    <div className='mt-4 d-flex justify-content-between'>
                        <div>
                            {getStars(5)}
                        </div>

                        <div>
                            {countReviewsByRating(5)}
                            <span> Reviews</span>
                        </div>
                    </div>

                    <div className='mt-3 d-flex justify-content-between'>
                        <div>
                            {getStars(4)}
                        </div>

                        <div>
                            {countReviewsByRating(4)}
                            <span> Reviews</span>
                        </div>
                    </div>

                    <div className='mt-3 d-flex justify-content-between'>
                        <div>
                            {getStars(3)}
                        </div>

                        <div>
                            {countReviewsByRating(3)}
                            <span> Reviews</span>
                        </div>
                    </div>

                    <div className='mt-3 d-flex justify-content-between'>
                        <div>
                            {getStars(2)}
                        </div>

                        <div>
                            {countReviewsByRating(2)}
                            <span> Reviews</span>
                        </div>
                    </div>

                    <div className='mt-3 d-flex justify-content-between'>
                        <div>
                            {getStars(1)}
                        </div>

                        <div>
                            {countReviewsByRating(1)}
                            <span> Reviews</span>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}