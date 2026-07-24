import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-white text-lg font-bold mb-3">
              🇲🇲 ShowMyanmar.shop
            </h3>
            <p className="text-sm leading-relaxed">
              Discover authentic Myanmar products, traditional crafts, and
              unique cultural items from across the country.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { to: '/', label: 'Home' },
                { to: '/products', label: 'Products' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="hover:text-yellow-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-3">Categories</h4>
            <ul className="space-y-2 text-sm">
              {['Handicrafts', 'Traditional Wear', 'Gems & Jewelry', 'Food & Tea', 'Beauty & Wellness'].map(
                (cat) => (
                  <li key={cat}>
                    <Link
                      to="/products"
                      className="hover:text-yellow-400 transition-colors"
                    >
                      {cat}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>📧 hello@showemyanmar.shop</li>
              <li>📞 +95 9 000 000 000</li>
              <li>📍 Yangon, Myanmar</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Showemyanmar.shop. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer
