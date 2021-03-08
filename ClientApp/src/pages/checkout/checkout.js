import { useState } from 'react';
import Header from '../../components/header/heaader';
import { Container, Row, Col, Card, Form, Table, Button } from 'react-bootstrap';

import { addNotification } from '../../components/notification/redux/actions';
import { useSelector, useDispatch } from 'react-redux';

import { loadStripe } from '@stripe/stripe-js';

import CheckoutModel from './checkoutModel';

import { stripeKey } from './credentials/credentials';

const stripePromise = loadStripe(stripeKey);

export default function Checkout() {

    // checks if the website is waiting for the payment page's response
    const [isLoading, setIsLoading] = useState(false);
    // user's cart items
    const cartState = useSelector(store => store.cart);

    const dispatch = useDispatch();

    /**
     * returns table cells containing the title, quantity, and price of all cart items
     */
    const getProductInfo = () => {
        const productInfo = [];

        for (const item of cartState) {
            productInfo.push(
                <tr key={`cart_item_${item.product.id}`}>
                    <td>
                        <p>
                            {item.product.title} <strong>&nbsp; x {item.quantity}</strong>
                        </p>
                    </td>

                    <td>
                        {item.product.discountPercentage === 0 ?
                            <p>
                                ${item.product.price * item.quantity}
                            </p>

                            :
                            <p>
                                ${(item.product.price - (item.product.price * item.product.discountPercentage / 100)) * item.quantity}
                            </p>
                        }
                    </td>
                </tr>
            );
        }

        return productInfo;
    }

    /**
     * sends a checkout request to the server
     */
    const handleCheckout = async (e) => {
        e.preventDefault();

        setIsLoading(true);

        const stripe = await stripePromise;

        const sessionId = await CheckoutModel.checkout();

        const result = await stripe.redirectToCheckout({
            sessionId,
        });

        if (result.error) {
            setIsLoading(false);
            dispatch(addNotification({ type: 'Error', message: 'Could not proceed with your payment' }));
        }
    }

    return (
        <main className='checkout mb-5'>
            <Header title='Checkout' pageTitle='Checkout' />

            <Form onSubmit={(e) => handleCheckout(e)}>
                <Container fluid className='responsive-width'>
                    <Row xs={1} md={2}>
                        {/* user's billing and shipment details */}
                        <Col>
                            <Card className='border-0'>
                                <Card.Header className='bg-dark'>
                                    <Card.Title className='text-light mb-0 py-2 uppercase'>
                                        Billing Details
                                </Card.Title>
                                </Card.Header>

                                <Card.Body>
                                    <Form.Group>
                                        <Form.Label>First Name<span className='red-text'>*</span></Form.Label>
                                        <Form.Control required type='text' />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Last Name<span className='red-text'>*</span></Form.Label>
                                        <Form.Control required type='text' />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Company Name</Form.Label>
                                        <Form.Control type='text' />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Street Address<span className='red-text'>*</span></Form.Label>
                                        <Form.Control required type='text' />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Town / City<span className='red-text'>*</span></Form.Label>
                                        <Form.Control required type='text' />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>State / Country<span className='red-text'>*</span></Form.Label>
                                        <Form.Control required type='text' />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Phone Number<span className='red-text'>*</span></Form.Label>
                                        <Form.Control required type='text' />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Order Notes</Form.Label>
                                        <Form.Control as='textarea' placeholder='Notes about your order, e.g. delivery instructions' />
                                    </Form.Group>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* cart summary */}
                        <Col>
                            <Card className='border-0'>
                                <Card.Header className='bg-dark'>
                                    <Card.Title className='text-light mb-0 py-2 uppercase'>
                                        Your Order
                                    </Card.Title>
                                </Card.Header>

                                <Card.Body>
                                    <Table bordered>
                                        <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {getProductInfo()}
                                        </tbody>
                                    </Table>

                                    <Button
                                        disabled={cartState.length === 0 || isLoading}
                                        variant='danger'
                                        size='lg'
                                        className='px-3 py-2'
                                        type='submit'>
                                        Proceed to Payment
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </Form>
        </main>
    );
}