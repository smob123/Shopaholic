/**
 * displays a product's image, title, and final price
 */

import { Link } from 'react-router-dom';

export default function ProductCard({ id, image, title, price, discount }) {
    return (
        <div className='product-card'>
            <div className='image-container'>
                {
                    /* display a badge if there is a discount on the item */
                    discount > 0 &&
                    <p className='discount-value'>
                        Sale
                    </p>
                }
                <Link to={`/product/${id}`}>
                    <img src={image} alt={`${title}`} />
                </Link>
            </div>

            <div className='info-container'>
                <p className='product-title'>
                    <Link to={`/product/${id}`}>
                        {title}
                    </Link>
                </p>

                {
                    /* check if there is a discount and apply it to the products value */
                    discount ?
                        <div>
                            <p className='old-price d-inline-block mr-3'>
                                ${price}.00
                            </p>

                            <p className='price d-inline-block'>
                                ${Math.floor(price - (price * (discount / 100)))}.00
                            </p>
                        </div>

                        :

                        /* otherwise, just display the product's original price */
                        <p className='price'>
                            ${price}.00
                        </p>
                }
            </div>
        </div>
    );
}