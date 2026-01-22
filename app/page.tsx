import Header from './components/Header';
import Banner from './components/Banner';
import FeaturedProducts from './components/FeaturedProducts';
import Categories from './components/Categories';
import TrustBadges from './components/TrustBadges';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div>
      <Header />
      <Banner />
      <FeaturedProducts />
      <Categories />
      <TrustBadges />
      <Footer />
    </div>
  );
}
