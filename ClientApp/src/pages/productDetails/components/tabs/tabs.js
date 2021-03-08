import { Tabs, Tab } from 'react-bootstrap';

import Reviews from './reviews/reviews';

export default function MTabs({ productId }) {
    return (
        <Tabs className='product-page-tabs border' defaultActiveKey='description'>
            {/* product's description */}
            <Tab eventKey='description' title='Description'>
                <div className='ml-3 mt-4 max-width-1000'>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In at convallis risus, in rutrum dui.
                        Vestibulum congue nunc ac lorem eleifend, at bibendum diam suscipit. Fusce non purus maximus,
                        rutrum orci in, tempus magna. Morbi efficitur libero vitae gravida semper. Mauris sollicitudin
                        ipsum urna, at pulvinar magna venenatis quis. Fusce rhoncus mauris sagittis mattis molestie.
                        Donec et sem aliquam, facilisis dui id, sodales dui. Sed eget urna et urna auctor finibus.
                        Aliquam sed mollis metus, quis interdum neque. Fusce elementum urna ut vehicula vulputate.
                        </p>

                    <p>
                        Fusce porta nulla at eros tincidunt, nec hendrerit quam condimentum. Aliquam non tincidunt massa.
                        Sed pretium convallis sodales. Maecenas id pulvinar orci. Sed nec arcu sodales, tincidunt diam ut,
                        gravida est. Cras scelerisque sem vitae aliquam ultricies. In viverra at ligula sit amet lobortis.
                        Fusce dapibus quam a arcu luctus rutrum.
                        </p>
                </div>
            </Tab>

            {/* product's reviews */}
            <Tab eventKey='reviews' title='Reviews'>
                <div className='ml-3 mt-4'>
                    <Reviews productId={productId} />
                </div>
            </Tab>
        </Tabs>
    )
}