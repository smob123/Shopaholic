import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCcVisa, faCcMastercard, faCcPaypal, faGooglePay } from '@fortawesome/free-brands-svg-icons';
import { Button, Container, Row, Col } from 'react-bootstrap';

import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faFacebookF, faTwitter, faYoutube, faGoogle, faInstagram } from '@fortawesome/free-brands-svg-icons';

import LogoLight from '../nav/images/logo-light.png';

export default function Footer() {
    return (
        <footer>
            <div className='content'>
                {/* top section */}
                <h2 className='section-title'>Keep Connected</h2>

                <p className='text-center mb-5 subtitle'>Get updates by subscribing to our news letter</p>

                <div className='newsletter-container mb-5 d-flex align-items-center justify-content-center flex-wrap'>
                    <div className='newsletter-form d-flex align-items-center justify-content-center'>
                        <FontAwesomeIcon icon={faEnvelope} size='2x' className='mr-2' />
                        <input className='px-2' placeholder='Your email address' />
                    </div>

                    <Button size='lg' variant='danger'>Subscribe</Button>
                </div>

                {/* middle section */}
                <div className='social-container d-flex justify-content-center flex-wrap mb-3'>
                    <FontAwesomeIcon icon={faFacebookF} size='sm' />
                    <FontAwesomeIcon icon={faTwitter} size='2x' />
                    <FontAwesomeIcon icon={faYoutube} size='2x' />
                    <FontAwesomeIcon icon={faGoogle} size='2x' />
                    <FontAwesomeIcon icon={faInstagram} size='2x' />
                </div>

                {/* bottom section */}
                <Container fluid className='w-100 mt-5'>
                    <Row>
                        <Col md className='logo-container text-center'>
                            <img src={LogoLight} alt='logo' />
                            <p>Copyright &#169; 2020 Shopaholic. All Rights Reserved.</p>
                        </Col>

                        <Col md className='d-flex align-items-center justify-content-center flex-wrap mt-2 mt-md-0'>
                            <FontAwesomeIcon icon={faCcVisa} size='3x' className='mx-1' />
                            <FontAwesomeIcon icon={faCcMastercard} size='3x' className='mx-1' />
                            <FontAwesomeIcon icon={faCcPaypal} size='3x' className='mx-1' />
                            <FontAwesomeIcon icon={faGooglePay} size='3x' />
                        </Col>
                    </Row>
                </Container>
            </div>
        </footer>
    );
}