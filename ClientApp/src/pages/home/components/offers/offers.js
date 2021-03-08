import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Offer1 from '../../images/offer1.jpg';
import Offer2 from '../../images/offer2.jpg';
import Offer3 from '../../images/offer3.jpg';

export default function Offers() {
    return (
        <Container fluid className='home-offer responsive-width'>
            <Row xs={1} md={2} lg={3}>
                <Col className='image-container mb-4 my-lg-0 mx-auto ml-md-0 pr-md-1 p-xl-0'>
                    <Link to='/products'>
                        <img src={Offer1} alt='offer 1' className='w-100 h-100 p-xl-0' />
                    </Link>
                </Col>

                <Col className='image-container mb-4 my-lg-0 mx-auto pr-lg-1 pl-md-1 p-xl-0'>
                    <Link to='/products'>
                        <img src={Offer2} alt='offer 1' className='w-100' />
                    </Link>
                </Col>

                <Col className='image-container mb-4 my-lg-0 mx-auto mr-lg-0 pl-lg-1 p-xl-0'>
                    <Link to='/products'>
                        <img src={Offer3} alt='offer 1' className='w-100' />
                    </Link>
                </Col>
            </Row>
        </Container>
    )
}