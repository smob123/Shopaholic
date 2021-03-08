import Header from './components/header/header';
import Categories from './components/categories/categories';
import Services from './components/services/services';
import Offers from './components/offers/offers';
import Banner from './components/banner/banner';
import FeaturedProducts from './components/featuredProducts/featuredProducts';
import CategoryProducts from './components/categoryProducts/categoryProducts';

export default function Home() {
    return (
        <main className='home'>
            <Header />

            <section>
                <Categories />
            </section>

            <section>
                <Services />
            </section>

            <section>
                <FeaturedProducts />
            </section>

            <section>
                <Offers />
            </section>

            <section>
                <CategoryProducts />
            </section>

            <section>
                <Banner />
            </section>
        </main>
    );
}