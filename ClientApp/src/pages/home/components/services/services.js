import { Container, Row, Col } from 'react-bootstrap';

import Shipping from '../../images/shipping1.png';
import TwentyFourHours from '../../images/24-hours1.png';
import Exchange from '../../images/exchange1.png';
import CreditCard from '../../images/credit-card1.png';

export default function Services() {
    return (
        <Container fluid className='services responsive-width py-5 border rounded'>
            <Row xs={1} md={2} xl={4}>
                <Col className='d-flex align-items-center justify-content-around w-50 mb-3 mb-xl-0'>
                    <div>
                        <img src={Shipping} alt='shipping-vehicle' />
                    </div>

                    <div>
                        <p className='uppercase font-bold mb-1'>Free Shipping</p>
                        <p className='text-secondary'>Free shipping on all orders</p>
                    </div>
                </Col>

                <Col className='d-flex align-items-center justify-content-around w-50 mb-3 mb-xl-0'>
                    <div>
                        <img src={TwentyFourHours} alt='24-hours' />
                    </div>

                    <div>
                        <p className='uppercase font-bold mb-1'>24/7 Technical Support</p>
                        <p className='text-secondary'>Online support 24 hours a day</p>
                    </div>
                </Col>

                <Col className='d-flex align-items-center justify-content-around w-50 mb-3 mb-md-0'>
                    <div>
                        <img src={CreditCard} alt='credit-card' />
                    </div>

                    <div>
                        <p className='uppercase font-bold mb-1'>Customer Loyalty Programs</p>
                        <p className='text-secondary'>Special discounts and more</p>
                    </div>
                </Col>

                <Col className='d-flex align-items-center justify-content-around w-50'>
                    <div>
                        <img src={Exchange} alt='opposing-arrows' />
                    </div>

                    <div>
                        <p className='uppercase font-bold mb-1'>Return and Exchange</p>
                        <p className='text-secondary'>Money back guarantee under 7 days</p>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}