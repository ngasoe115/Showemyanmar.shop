import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { products, categories } from '../data/products'

const featuredProducts = products.slice(0, 4)

const highlights = [
  { icon: '🚀', title: 'Fast Delivery', desc: 'Nationwide shipping across Myanmar' },
  { icon: '🤝', title: 'Authentic Products', desc: 'Sourced directly from local artisans' },
  { icon: '🔒', title: 'Secure Payment', desc: 'Safe and trusted payment methods' },
  { icon: '💬', title: '24/7 Support', desc: 'We are always here to help you' },
]

function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-yellow-600 font-semibold uppercase tracking-widest text-sm mb-4">
            🇲🇲 Discover Myanmar&apos;s Finest
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Authentic Myanmar
            <br />
            <span className="text-yellow-500">Products &amp; Culture</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
            Shop genuine handicrafts, traditional wear, gems, and local delicacies
            crafted by Myanmar&apos;s talented artisans — delivered to your doorstep.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold px-8 py-3 rounded-xl text-lg transition-colors shadow-md"
            >
              Shop Now
            </Link>
            <Link
              to="/about"
              className="bg-white hover:bg-gray-50 text-gray-700 font-bold px-8 py-3 rounded-xl text-lg transition-colors border border-gray-200 shadow-sm"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map(({ icon, title, desc }) => (
            <div key={title} className="text-center p-6 rounded-2xl bg-gray-50">
              <div className="text-4xl mb-3">{icon}</div>
              <h3 className="font-bold text-gray-800 mb-1">{title}</h3>
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.slice(1).map(({ id, label }) => (
              <Link
                key={id}
                to={`/products?category=${id}`}
                className="bg-white border border-gray-100 rounded-2xl p-5 text-center hover:border-yellow-300 hover:shadow-md transition-all group"
              >
                <p className="text-gray-700 font-medium text-sm group-hover:text-yellow-600">
                  {label}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <Link
              to="/products"
              className="text-yellow-600 hover:text-yellow-700 font-semibold text-sm"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Banner / CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-yellow-900 mb-4">
            Support Local Myanmar Artisans
          </h2>
          <p className="text-yellow-800 text-lg mb-8">
            Every purchase helps sustain traditional craftsmanship and supports
            artisan families across Myanmar.
          </p>
          <Link
            to="/products"
            className="bg-yellow-900 hover:bg-yellow-800 text-yellow-100 font-bold px-8 py-3 rounded-xl text-lg transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </section>
    </>
  )
}

export default Home
