import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { products, categories } from '../data/products'

function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')

  const activeCategory = searchParams.get('category') || 'all'

  const filtered = products.filter((p) => {
    const matchesCategory =
      activeCategory === 'all' || p.categoryId === activeCategory
    const matchesSearch =
      search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  function handleCategoryChange(id) {
    if (id === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ category: id })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 py-12 px-4 border-b border-yellow-100">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Our Products</h1>
          <p className="text-gray-600">
            Explore authentic Myanmar products crafted with tradition and care.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Search */}
        <div className="mb-6">
          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => handleCategoryChange(id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                activeCategory === id
                  ? 'bg-yellow-400 border-yellow-400 text-yellow-900'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-yellow-300 hover:text-yellow-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {filtered.length > 0 ? (
          <>
            <p className="text-sm text-gray-500 mb-4">{filtered.length} products found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-gray-500 text-lg">No products found.</p>
            <button
              type="button"
              onClick={() => {
                setSearch('')
                setSearchParams({})
              }}
              className="mt-4 text-yellow-600 hover:text-yellow-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Products
