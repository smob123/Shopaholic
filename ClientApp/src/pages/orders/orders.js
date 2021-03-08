import { useState, useEffect } from 'react';

import Header from '../../components/header/heaader';
import { Accordion, Card, Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import OrdersModel from './ordersModel';

export default function Orders() {

    // user's completed orders
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        (async () => {
            // get the user's completed orders from the network
            const res = await OrdersModel.getUserOrders();
            if (res) {
                setOrders(res);
            }
        })();
    }, []);

    /**
     * returns table cells containing the image, title, unit price, 
     * quantity, and total price of each ordered item.
     */
    const getOrderProducts = (products) => {
        const productList = [];

        for (const item of products) {
            productList.push(
                <tr key={`${Date.now()}_${item.product.id}_order_item`}>
                    <td className='align-middle text-center'>
                        <Link to={`/product/${item.product.id}`}>
                            <img
                                src={item.product.images[0].url}
                                alt='order-item-thumbnail'
                                className='w-50 product-thumbnail' />
                        </Link>
                    </td>

                    <td className='align-middle text-center'>
                        <Link to={`/product/${item.product.id}`}>
                            {item.product.title}
                        </Link>
                    </td>

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

                    <td className='align-middle text-center'>
                        <p>
                            {item.quantity}
                        </p>
                    </td>

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

        return productList;
    }

    /**
     * calculates the total price of a single order
     */
    const calculateTotalPrice = (products) => {
        let total = 0;

        for (const item of products) {
            total += (item.product.price - (item.product.price * item.product.discountPercentage / 100)) * item.quantity;
        }

        return total;
    }

    /**
     * returns a list of accordion toggle elements resembling individual orders.
     */
    const getOrders = () => {
        const ordersList = [];

        // unique key for each accordion toggle element
        let eventKey = 1;

        for (const order of orders) {
            const purchasedAt = new Date(order.purchasedAt);
            const purchaseDate = `${purchasedAt.getDate()}/${purchasedAt.getMonth()}/${purchasedAt.getFullYear()}`;
            const purchaseTime = `${purchasedAt.getHours()}:${purchasedAt.getMinutes()}`;

            ordersList.push(
                <Card key={Date.now() + eventKey}>
                    <Accordion.Toggle
                        eventKey={eventKey}
                        as={Button}
                        variant='dark'
                        className='text-light rounded'>
                        <Card.Header className='rounded'>
                            <span className='text-light'>
                                {purchaseDate} at {purchaseTime}
                            </span>
                        </Card.Header>
                    </Accordion.Toggle>


                    <Accordion.Collapse eventKey={eventKey}>
                        <Card.Body>
                            <Table bordered>
                                <thead>
                                    <tr>
                                        <th className='align-middle text-center'>Image</th>
                                        <th className='align-middle text-center'>Product</th>
                                        <th className='align-middle text-center'>Price</th>
                                        <th className='align-middle text-center'>Quantity</th>
                                        <th className='align-middle text-center'>Total</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {getOrderProducts(order.purchasedItems)}
                                </tbody>
                            </Table>

                            <p className='total-price'>Total Amount: <span className='red-text'>${calculateTotalPrice(order.purchasedItems)}</span></p>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            );

            eventKey++;
        }

        return ordersList;
    }

    return (
        <main className='orders mb-5'>
            <Header title='Order History' pageTitle='Orders' />
            {
                /* display a messgae if the user hasn't made any orders */
                orders.length < 1 ?
                    <h2 className='text-center'>You have not made any orders yet</h2>
                    :
                    /* otherwise display a list of accordion toggles */
                    <Accordion className='responsive-width'>
                        {getOrders()}
                    </Accordion>
            }
        </main>
    );
}