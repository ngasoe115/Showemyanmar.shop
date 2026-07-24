import { useState } from 'react'

const contactMethods = [
  { icon: '📧', label: 'Email', value: 'hello@showemyanmar.shop' },
  { icon: '📞', label: 'Phone', value: '+95 9 000 000 000' },
  { icon: '📍', label: 'Address', value: 'Yangon, Myanmar' },
  { icon: '🕒', label: 'Hours', value: 'Mon–Sat: 9 AM – 6 PM' },
]

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    // In a real app, this would send data to a backend API
    setSubmitted(true)
  }

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-yellow-600 font-semibold uppercase tracking-widest text-sm mb-4">
            Get in Touch
          </p>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-gray-600 text-lg">
            Have a question or want to partner with us? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Reach Us At</h2>
          <div className="space-y-4 mb-10">
            {contactMethods.map(({ icon, label, value }) => (
              <div key={label} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <span className="text-2xl">{icon}</span>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {label}
                  </p>
                  <p className="text-gray-800 font-medium">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-yellow-50 rounded-2xl border border-yellow-100">
            <h3 className="font-bold text-gray-800 mb-2">🤝 Partner with Us</h3>
            <p className="text-sm text-gray-600">
              Are you a Myanmar artisan or business? We&apos;d love to feature your products
              on our platform. Reach out to discuss partnership opportunities.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          {submitted ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h2>
              <p className="text-gray-600 mb-6">
                Thank you for reaching out. We&apos;ll get back to you within 24 hours.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false)
                  setForm({ name: '', email: '', subject: '', message: '' })
                }}
                className="text-yellow-600 hover:text-yellow-700 font-semibold"
              >
                Send another message
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-3 rounded-xl transition-colors text-lg"
                >
                  Send Message
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Contact
