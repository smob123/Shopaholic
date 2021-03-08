import { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Button, Card, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router-dom';

import Header from '../../components/header/heaader';

import { editQuantity } from '../productDetails/redux/actions';

import { useSelector, useDispatch } from 'react-redux';
import { removeProduct } from '../productDetails/redux/actions';

export default function Cart() {

    // total price of the user's cart items
    const [totalPrice, setTotalPrice] = useState(0);

    // list of cart items
    const cartState = useSelector(store => store.cart);

    const dispatch = useDispatch();

    useEffect(() => {
        // calculate the total price every time the cart list changes
        calculateTotalPrice();
    }, [cartState]);

    /**
     * claculates the total price of the user's cart items
     */
    const calculateTotalPrice = () => {
        let total = 0;

        for (const item of cartState) {
            const originalPrice = item.product.price;
            const discountAmount = (item.product.price * item.product.discountPercentage / 100);

            total += (originalPrice - discountAmount) * item.quantity;
        }

        setTotalPrice(total);
    }

    /**
     * returns table cells displaying all the cart items
     */
    const getProducts = () => {
        const items = [];

        for (const item of cartState) {
            items.push(
                <tr key={`cart_item_${item.product.id}`}>
                    {/* button to delete the item from the cart */}
                    <td className='align-middle text-center'>
                        <FontAwesomeIcon
                            className='cursor-pointer'
                            icon={faTrashAlt}
                            size='lg'
                            onClick={() => dispatch(removeProduct(item.product.id))} />
                    </td>

                    {/* product's image */}
                    <td className='align-middle text-center'>
                        <Link to={`/product/${item.product.id}`}>
                            <img
                                src={item.product.images[0].url}
                                alt='cart-item-thumbnail'
                                className='w-50 product-thumbnail' />
                        </Link>
                    </td>

                    {/* products' title */}
                    <td className='align-middle text-center'>
                        <Link to={`/product/${item.product.id}`}>
                            {item.product.title}
                        </Link>
                    </td>

                    {/* product's final price */}
                    <td className='align-middle text-center'>
                        {item.product.discountPercentage === 0 ?
                            <p>
                                ${item.product.price}
                            </p>

                            :

                            <p>
                                ${(item.product.price - (item.product.price * item.product.discountPercentage / 100))}
                            </p>
                        }
                    </td>

                    {/* product's quantity */}
                    <td className='align-middle text-center'>
                        <input
                            type='number'
                            defaultValue={item.quantity}
                            min={1}
                            onChange={(e) => item.quantity = parseInt(e.target.value)}
                            className='text-center' />
                    </td>

                    {/* product's final tital price */}
                    <td className='align-middle text-center'>
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

        return items;
    }

    /**
     * upates the quantity of cart items
     */
    const updateCart = () => {
        for (const item of cartState) {
            dispatch(editQuantity(item.product, item.quantity));
        }
    }

    return (
        <main>
            <Header title='Cart' pageTitle='Shopping Cart' />

            <div className='cart responsive-width mb-5 mx-auto'>

                {/* table showing cart items */}
                <div className='cart-table-container'>
                    <Table bordered>
                        <thead>
                            <tr>
                                <th className='align-middle text-center'>Delete</th>
                                <th className='align-middle text-center'>Image</th>
                                <th className='align-middle text-center'>Product</th>
                                <th className='align-middle text-center'>Price</th>
                                <th className='align-middle text-center'>Quantity</th>
                                <th className='align-middle text-center'>Total</th>
                            </tr>
                        </thead>

                        <tbody>
                            {getProducts()}
                        </tbody>
                    </Table>
                </div>

                {/* updates cart items */}
                <div className='text-right'>
                    <Button
                        disabled={cartState.length === 0}
                        variant='dark'
                        className='mt-3 px-3 py-2 uppercase'
                        onClick={() => updateCart()}>
                        Update Cart
                </Button>
                </div>

                <Container fluid className='mt-5'>
                    <Row xs={1} sm={2}>
                        {/* coupon input form */}
                        <Col className='mb-3 mb-sm-0'>
                            <Card>
                                <Card.Header className='bg-dark py-3'>
                                    <p className='uppercase text-light mb-0'>Coupon</p>
                                </Card.Header>

                                <Card.Body>
                                    <p>Enter your coupon code here</p>
                                    <Form.Control type='text' placeholder='Coupon Code' className='py-4 shadow-none' />
                                    <Button variant='dark' className='uppercase mt-3 px-3 py-2'>
                                        Apply Coupon
                                </Button>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* total calculated price */}
                        <Col>
                            <Card>
                                <Card.Header className='bg-dark py-3'>
                                    <p className='uppercase text-light mb-0'>
                                        Cart Totals
                                    </p>
                                </Card.Header>

                                <Card.Body>
                                    <Row>
                                        <Col>
                                            <p>Subtotal</p>
                                            <p>Shipping</p>
                                        </Col>

                                        <Col className='text-right'>
                                            <p>
                                                ${totalPrice}
                                            </p>

                                            <p>
                                                $0.00
                                        </p>
                                        </Col>
                                    </Row>
                                </Card.Body>

                                <Card.Footer className='bg-white text-right'>
                                    <Row className='text-left'>
                                        <Col>
                                            <p className='mb-0'>
                                                Total
                                            </p>
                                        </Col>

                                        <Col className='text-right'>
                                            <p>
                                                ${totalPrice}
                                            </p>
                                        </Col>
                                    </Row>
                                    <Button
                                        as={cartState.length === 0 ? Button : Link}
                                        to='/checkout'
                                        disabled={cartState.length === 0}
                                        variant='danger'
                                        className='mt-3 px-3 py-2'>
                                        Proceed to Checkout
                                     </Button>
                                </Card.Footer>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </main>
    )
}