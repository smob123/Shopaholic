import { useEffect, useState } from 'react';

export default function ThumbnailImageSlider({ productId, images }) {
    // selected slide
    const [currentSlide, setCurrentSlide] = useState(images[0]);
    // selected slide's index
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        // update the current slide whenever the product id or images change
        setCurrentSlide(images[0]);
    }, [productId, images]);

    /**
     * updates the selected thumbnail.
     */
    const updateThumbnail = (index) => {
        // check if the index of the newly selected slide is less than the active index
        if (index > activeIndex) {
            // shift the bottom slider to the left
            handleShiftingThumbnailContainerToLeft();
        } else if (index < activeIndex) {
            // shift the bottom slider to the right
            handleShiftingThumbnailContainerToRight();
        } else {
            return;
        }

        // update the current slide and the active index
        setCurrentSlide(images[index]);
        setActiveIndex(index);
    }

    /**
     * shifts the bottom slider to the left.
     */
    const handleShiftingThumbnailContainerToLeft = () => {
        const thumbnailContainer = document.querySelector('.thumbnail-container');
        const containerLeftScroll = thumbnailContainer.scrollLeft;

        thumbnailContainer.scroll(
            {
                left: containerLeftScroll + 100,
                behavior: 'smooth'
            }
        );
    }

    /**
     * shifts the bottom slider to the right.
     */
    const handleShiftingThumbnailContainerToRight = () => {
        const thumbnailContainer = document.querySelector('.thumbnail-container');
        const containerLeftScroll = thumbnailContainer.scrollLeft;

        thumbnailContainer.scroll(
            {
                left: containerLeftScroll - 100,
                behavior: 'smooth'
            }
        );
    }

    return (
        <div className='thumbnail-image-slider-container'>
            <img src={currentSlide.url} alt='product-preview' className='slide' />

            <div className='thumbnail-container'>
                {
                    images.map((item, index) => (
                        <button
                            onClick={() => updateThumbnail(index)}
                            key={`${productId}_thumbnail_image_${index}`} >
                            <img
                                src={item.url}
                                alt={`thumbnail-${index}`}
                                className={activeIndex === index ? 'active' : ''} />
                        </button>
                    ))
                }
            </div>
        </div>
    );
}