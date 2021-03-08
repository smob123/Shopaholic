import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation } from 'swiper';
import ProductCard from '../../../../components/productCard/productCard';

import CategoryProductsModel from './categoryProductsModel';

import Loading from '../../../../components/loading/loading';

SwiperCore.use([Navigation]);

export default function CategoryProducts() {
    // selected category
    const [currentCategory, setCaurrentCategory] = useState('men');
    // products in each category
    const [products, setProducts] = useState({ men: [], women: [], kids: [] });

    useEffect(() => {
        // check if the current category's products have been fetched
        if (products[currentCategory].length === 0) {
            getProductsByCategory();
        }
    }, [currentCategory]);

    /**
     * fetches products in the selected category.
     */
    const getProductsByCategory = async () => {
        const res = await CategoryProductsModel.getProductsByCategory(currentCategory);
        if (res) {
            products[currentCategory] = res;
            setProducts({ ...products });
        }
    }

    /**
     * returns products in the current category as slides containing product cards.
     */
    const getProductCards = () => {
        const cards = [];

        for (const product of products[currentCategory]) {
            cards.push(
                <SwiperSlide key={`${product.id}_category_product`}>
                    <ProductCard
                        id={product.id}
                        title={product.title}
                        image={product.images[0].url}
                        price={product.price}
                        discount={product.discountPercentage} />
                </SwiperSlide>
            )
        }

        return cards;
    }

    return (
        <div className='category-products-container responsive-width'>
            <h2 className='section-title'>Our Categories</h2>
            <div className='category-nav-container d-flex align-items-center justify-content-center flex-wrap mb-5'>
                <div>
                    <input type='radio' id='men-products' name='category' defaultChecked='checked' onChange={() => setCaurrentCategory('men')} />
                    <label htmlFor='men-products'>
                        Men
                    </label>
                </div>

                <div>
                    <input type='radio' id='women-products' name='category' onChange={() => setCaurrentCategory('women')} />
                    <label htmlFor='women-products'>
                        Women
                    </label>
                </div>

                <div>
                    <input type='radio' id='kids-products' name='category' onChange={() => setCaurrentCategory('kids')} />
                    <label htmlFor='kids-products'>
                        Kids
                </label>
                </div>
            </div>

            { products[currentCategory].length < 1 ?
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
                    {getProductCards()}
                </Swiper>
            }
        </div>
    );
}