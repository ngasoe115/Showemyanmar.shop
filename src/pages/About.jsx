const team = [
  { name: 'Aung Kyaw', role: 'Founder & CEO', emoji: '👨‍💼' },
  { name: 'Su Su Lwin', role: 'Head of Artisan Relations', emoji: '👩‍🎨' },
  { name: 'Ko Zaw', role: 'Logistics Manager', emoji: '🚀' },
]

const values = [
  {
    icon: '🎨',
    title: 'Authentic Craftsmanship',
    description:
      'We partner exclusively with verified local artisans who carry on generations of traditional craft knowledge.',
  },
  {
    icon: '🌱',
    title: 'Sustainable Practices',
    description:
      'Our artisans use locally sourced, sustainable materials and eco-friendly production methods.',
  },
  {
    icon: '🤝',
    title: 'Fair Trade',
    description:
      'We ensure every artisan receives fair compensation, directly supporting livelihoods across Myanmar.',
  },
  {
    icon: '🇲🇲',
    title: 'Cultural Preservation',
    description:
      'By connecting artisans with global buyers, we help preserve Myanmar\'s rich cultural heritage.',
  },
]

function About() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-yellow-600 font-semibold uppercase tracking-widest text-sm mb-4">Our Story</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">
            Bringing Myanmar to the World
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Showemyanmar.shop was founded with a simple mission: to connect the world
            with the extraordinary talent of Myanmar&apos;s artisans. We believe every
            handmade product carries a story — and we&apos;re here to share those stories.
          </p>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map(({ icon, title, description }) => (
              <div key={title} className="text-center p-6 rounded-2xl bg-gray-50">
                <div className="text-5xl mb-4">{icon}</div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-yellow-400">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { stat: '500+', label: 'Local Artisans' },
            { stat: '1,200+', label: 'Products Listed' },
            { stat: '20,000+', label: 'Happy Customers' },
            { stat: '15', label: 'States & Regions' },
          ].map(({ stat, label }) => (
            <div key={label}>
              <p className="text-4xl font-extrabold text-yellow-900">{stat}</p>
              <p className="text-yellow-800 font-medium mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet the Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            {team.map(({ name, role, emoji }) => (
              <div key={name} className="text-center p-8 rounded-2xl bg-gray-50">
                <div className="text-6xl mb-4">{emoji}</div>
                <h3 className="font-bold text-gray-800 text-lg">{name}</h3>
                <p className="text-gray-500 text-sm mt-1">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
