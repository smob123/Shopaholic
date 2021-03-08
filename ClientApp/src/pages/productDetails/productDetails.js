import { Fragment, useState, useEffect } from 'react';
import { Col, Container, Row, Button } from 'react-bootstrap';
import ThumbnailImageSlider from './components/thumbnailImageSlider/thumbnailImageSlider';

import ProductDetailsModel from './productDetailsModel';

import Header from '../../components/header/heaader';
import ProductCard from '../../components/productCard/productCard';
import Tabs from './components/tabs/tabs';

import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation } from 'swiper';

import { useDispatch, useSelector } from 'react-redux';
import { addProduct, editQuantity } from './redux/actions';

import Loading from '../../components/loading/loading';

SwiperCore.use([Navigation]);

export default function ProductDetails(props, { productInfo }) {

    const userAuthState = useSelector(store => store.auth);
    const cartState = useSelector(store => store.cart);

    const dispatch = useDispatch();

    // product's details
    const [info, setInfo] = useState(null);
    // selected product color
    const [productColorIndex, setProductColorIndex] = useState(0);
    // selected product size
    const [productSizeIndex, setProductSizeIndex] = useState(0);
    // specified product count
    const [productCount, setProductCount] = useState(1);
    // random products to display as recommendations
    const [randomProducts, setRandomProducts] = useState([]);

    // checks if the product is in the user's cart
    const [itemInCart, setItemInCart] = useState(null);

    useEffect(() => {
        // check if the user has navigated between two product pages
        if (productInfo && productInfo.id !== props.match.params.id) {
            setInfo(null);
        }

        // check if the product's details have not been fetched
        if (!productInfo) {
            // fetch the product's details
            (async () => {
                const productId = props.match.params.id;
                const res = await ProductDetailsModel.fetchProductById(productId);
                // check if the data was received
                if (res) {
                    // check if the product exists in the user's cart
                    const item = cartState.find(item => item.product.id === res.id);
                    if (item) {
                        setProductCount(item.quantity);
                    }

                    setItemInCart(item);
                    setInfo(res);
                } else {
                    // otherwise redirect the user to the 404 page
                    props.history.push('/404');
                }

                // get 5 random products and set them as recommendations
                const randomData = await ProductDetailsModel.fetchRandomProductsByCount(5);
                if (randomData) {
                    setRandomProducts(randomData);
                }
            })();
        } else {
            // otherwise update the product's info, and check if the product is in the user's cart
            setInfo(productInfo);
            const item = cartState.find(item => item.product.id === productInfo.id);
            if (item) {
                setProductCount(item.quantity);
            }
            setItemInCart(item);
        }
    }, [props.match.params.id, props.history, productInfo, cartState]);

    /**
     * returns random recommended products as slides containing product cards.
     */
    const getRandomProducts = () => {
        const p = [];

        for (let i = 0; i < randomProducts.length; i++) {
            p.push(
                <SwiperSlide key={`${randomProducts[i].id}_top_selling`}>
                    <ProductCard
                        id={randomProducts[i].id}
                        image={randomProducts[i].images[0].url}
                        title={randomProducts[i].title}
                        price={randomProducts[i].price}
                        discount={randomProducts[i].discountPercentage} />
                </SwiperSlide>
            );
        }

        return p;
    }

    /**
     * returns available product colors.
     */
    const getProductColors = () => {
        const colorClasses = ['background-color-primary', 'background-color-orange', 'background-color-dark-grey', 'background-color-black'];
        const htmlElements = [];

        for (let i = 0; i < colorClasses.length; i++) {
            const isSelected = i === productColorIndex;
            htmlElements.push(
                <button
                    key={`${Date.now()}_color_picker_${colorClasses[i]}`}
                    className={`${colorClasses[i]} ${isSelected ? 'active' : ''} shadow-sm`}
                    onClick={() => setProductColorIndex(i)}>
                    {
                        isSelected &&
                        <p>&#10003;</p>
                    }
                </button>
            );
        }

        return htmlElements;
    }

    /**
     * returns available product sizes.
     */
    const getProductSizes = () => {
        const sizes = [9, 9.5, 10, 10.5, 11];
        const htmlElements = [];

        for (let i = 0; i < sizes.length; i++) {
            const isSelected = productSizeIndex === i;
            htmlElements.push(
                <div
                    key={`${Date.now()}_size_picker_${sizes[i]}`}
                    className={`${isSelected ? 'active' : ''} shadow-sm`}
                    onClick={() => setProductSizeIndex(i)}>
                    <p>{sizes[i]}</p>
                </div>
            );
        }

        return htmlElements;
    }

    /**
     * returns add to/update cart button.
     */
    const getPurchaseButton = () => {
        if (userAuthState.isLoggedIn && itemInCart) {
            return (
                <Button size='lg' variant='danger' onClick={() => dispatch(editQuantity(info, productCount))}>
                    Update Cart
                </Button>
            );
        }

        return (
            <Button size='lg' variant='danger' onClick={() => dispatch(addProduct(info, productCount))}>
                Add to Cart
            </Button>
        );
    }

    return (
        <main className='product-page'>

            <Header title='Product' pageTitle='Product Details' />

            <div className='responsive-width'>
                {
                    !info ?
                        <Loading />
                        :

                        <Fragment>
                            <Container fluid className='product-details mt-5'>

                                <Row xs={1} md={2}>
                                    <Col md={5} className='d-flex align-items-center justify-content-center'>
                                        <ThumbnailImageSlider productId={info.id} images={info.images} />
                                    </Col>

                                    <Col className='info-col d-flex align-items-center justify-content-center ml-md-5'>
                                        <div>
                                            <h4>
                                                {info.title}
                                            </h4>

                                            <div>
                                                <span className='d-inline-block'>
                                                    {
                                                        info.discountPercentage > 0 &&
                                                        <del className='d-inline-block mr-2'>
                                                            <h6 className='text-muted'>
                                                                ${info.price}.00
                                        </h6>
                                                        </del>
                                                    }
                                                </span>
                                                <span className='d-inline-block'>
                                                    <h5>
                                                        ${
                                                            info.discountPercentage > 0 ?
                                                                Math.floor(info.price - (info.price * (info.discountPercentage / 100)))
                                                                :
                                                                info.price
                                                        }.00
                                                &nbsp;
                                                </h5>
                                                </span>
                                            </div>

                                            <div>
                                                <p>
                                                    Category: <span className='red-text'>{info.category}</span>
                                                </p>

                                                <p className='text-color-green'>
                                                    Availibility: In Stock
                                            </p>
                                            </div>

                                            <hr />

                                            <p className='product-description mt-4'>
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis semper mauris a elit accumsan,
                                                a volutpat massa pulvinar. Vestibulum consequat odio non lacus feugiat fringilla. Vestibulum
                                                in nunc non leo tempus ullamcorper sit amet quis lorem. Suspendisse a purus pretium, lacinia
                                                libero vel, fermentum eros.
                                        </p>

                                            <Row className='mt-5' xs={1} lg={2}>
                                                <Col lg={6}>
                                                    <h6 className='mb-3'>Color:</h6>

                                                    <div className='colors-container d-flex'>
                                                        {getProductColors()}
                                                    </div>
                                                </Col>

                                                <Col className='sizes-col'>
                                                    <h6 className='mb-3'>Size:</h6>

                                                    <div className='sizes-container d-flex'>
                                                        {getProductSizes()}
                                                    </div>
                                                </Col>
                                            </Row>

                                            <Row className='mt-5'>
                                                <Col className='d-flex align-items-center'>
                                                    <div>
                                                        <h6 className='mb-3'>Quantity:</h6>
                                                        <div className='item-count-input-container'>
                                                            <button onClick={() => productCount > 1 ? setProductCount(productCount - 1) : {}}>
                                                                -
                                                        </button>

                                                            <input
                                                                className='text-center item-count-input'
                                                                value={productCount}
                                                                onChange={() => { }} />

                                                            <button onClick={() => setProductCount(productCount + 1)}>
                                                                +
                                                        </button>
                                                        </div>
                                                    </div>
                                                </Col>

                                                <Col lg={4} className='d-flex align-items-lg-end mt-5 mt-lg-0'>
                                                    {getPurchaseButton()}
                                                </Col>
                                            </Row>
                                        </div>
                                    </Col>
                                </Row>
                            </Container>

                            <div className='tabs-container'>
                                <Tabs productId={info.id} />
                            </div>
                        </Fragment>
                }

                <div className='my-5'>
                    <h3 className='section-title'>Related Products</h3>
                    {randomProducts.length < 1 ?

                        <Loading />

                        :
                        <Swiper
                            slidesPerView={1}
                            spaceBetween={50}
                            watchOverflow={true}
                            breakpoints={{
                                500: {
                                    slidesPerView: 2
                                },
                                800: {
                                    slidesPerView: 3
                                },
                                950: {
                                    slidesPerView: 4
                                },
                                1200: {
                                    slidesPerView: 5
                                }
                            }}>

                            {getRandomProducts()}

                        </Swiper>
                    }
                </div>
            </div>
        </main>
    );
}