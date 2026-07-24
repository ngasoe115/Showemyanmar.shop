function ProductCard({ product }) {
  const { name, price, category, image, badge } = product

  return (
    <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
      {/* Image */}
      <div className="relative bg-gray-50 h-48 flex items-center justify-center">
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-6xl">{product.emoji || '🎁'}</span>
        )}
        {badge && (
          <span className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-yellow-600 font-medium uppercase tracking-wide mb-1">
          {category}
        </p>
        <h3 className="text-gray-800 font-semibold text-sm mb-3 line-clamp-2">{name}</h3>
        <div className="flex items-center justify-between">
          <span className="text-gray-900 font-bold">
            {typeof price === 'number'
              ? `${price.toLocaleString()} MMK`
              : price}
          </span>
          <button
            type="button"
            className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
