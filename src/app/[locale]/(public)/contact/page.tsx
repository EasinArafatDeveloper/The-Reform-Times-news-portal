import { Mail, Phone, MapPin, ShieldAlert } from "lucide-react";

export const metadata = {
  title: "Contact Us | The Reform Times",
  description: "Get in touch with our newsroom, submit a story tip, or contact our team.",
};

export default function ContactPage() {
  return (
    <div className="bg-brand-gray-light min-h-screen py-12 md:py-20">
      <div className="container max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="font-serif font-bold text-4xl md:text-5xl text-brand-navy mb-4">Contact The Newsroom</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Whether you have a story tip, feedback on our coverage, or general inquiries, we want to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 border border-gray-200">
              <h3 className="font-serif font-bold text-xl text-brand-navy mb-6">General Inquiries</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-gray-600">
                  <Mail className="text-brand-red shrink-0" size={20} />
                  <div>
                    <p className="font-medium text-brand-navy">Email</p>
                    <a href="mailto:info@reformtimes.org" className="hover:text-brand-red transition-colors">info@reformtimes.org</a>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-gray-600">
                  <Phone className="text-brand-red shrink-0" size={20} />
                  <div>
                    <p className="font-medium text-brand-navy">Phone</p>
                    <a href="tel:+15551234567" className="hover:text-brand-red transition-colors">+1 (555) 123-4567</a>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-gray-600">
                  <MapPin className="text-brand-red shrink-0" size={20} />
                  <div>
                    <p className="font-medium text-brand-navy">Office</p>
                    <p>123 Journalism Way<br />Suite 400<br />New York, NY 10001</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-brand-navy text-white p-8">
              <div className="flex items-center gap-3 mb-4">
                <ShieldAlert className="text-brand-red" size={24} />
                <h3 className="font-serif font-bold text-xl">Secure Tips</h3>
              </div>
              <p className="text-gray-300 text-sm mb-6">
                Have confidential information? Use our secure channels to protect your identity.
              </p>
              <a href="#" className="inline-block bg-transparent border border-white text-white px-6 py-2 text-sm font-semibold hover:bg-white hover:text-brand-navy transition-colors">
                Learn How to Send Secure Tips
              </a>
            </div>
          </div>

          {/* Forms Area */}
          <div className="lg:col-span-2 bg-white p-8 md:p-12 border border-gray-200">
            <h2 className="font-serif font-bold text-2xl text-brand-navy mb-8 border-b pb-4">Send a Message or Story Idea</h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-brand-navy mb-2">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-brand-navy mb-2">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-brand-navy mb-2">Subject / Story Title</label>
                <input 
                  type="text" 
                  id="subject" 
                  className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                  placeholder="What is this regarding?"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-brand-navy mb-2">Category (Optional)</label>
                <select 
                  id="category" 
                  className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all bg-white"
                >
                  <option value="">General Inquiry</option>
                  <option value="tip">Story Tip</option>
                  <option value="correction">Correction Request</option>
                  <option value="press">Press / Media</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-brand-navy mb-2">Message</label>
                <textarea 
                  id="message" 
                  rows={6}
                  className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                  placeholder="Provide details here..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-navy mb-2">Attachments (Optional)</label>
                <div className="border-2 border-dashed border-gray-300 p-6 text-center hover:border-brand-red transition-colors cursor-pointer bg-gray-50">
                  <p className="text-sm text-gray-500">Click to upload files or drag and drop</p>
                  <p className="text-xs text-gray-400 mt-1">Max file size: 10MB</p>
                </div>
              </div>

              <button type="submit" className="bg-brand-red text-white px-8 py-3 font-semibold text-sm hover:bg-brand-red/90 transition-colors">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
