import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation } from 'swiper';

import FeaturedProductsModel from './featuredProductsModel';
import ProductCard from '../../../../components/productCard/productCard';

import { Link } from 'react-router-dom';

import Loading from '../../../../components/loading/loading';

SwiperCore.use([Navigation]);

export default function FeaturedProducts() {
    // products
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // fetch random products from the server
        (async () => {
            const res = await FeaturedProductsModel.fetchRandomProductsByCount(5);
            if (res) {
                setProducts(res);
            }
        })();
    }, []);

    /**
     * returns products as slides containing products cards.
     */
    const getProducts = () => {
        const p = [];

        for (let i = 0; i < products.length; i++) {
            p.push(
                <SwiperSlide key={`${products[i].id}_top_selling`}>
                    <ProductCard
                        id={products[i].id}
                        image={products[i].images[0].url}
                        title={products[i].title}
                        price={products[i].price}
                        discount={products[i].discountPercentage} />
                </SwiperSlide>
            );
        }

        return p;
    }

    return (
        <div className='top-selling'>
            <h3 className='section-title'>Featured products</h3>
            <p className='section-subtitle text-center uppercase mb-4'>
                <strong>
                    <Link to='/products' className='red-on-hover mb-5'>
                        Shop the collection
                    </Link>
                </strong>
            </p>

            {
                products.length < 1 ?
                    <Loading />
                    :
                    <Swiper
                        className='responsive-width'
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

                        {getProducts()}

                    </Swiper>
            }
        </div>
    )
}