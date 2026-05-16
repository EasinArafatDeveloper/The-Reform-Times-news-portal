import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { authors } from "@/lib/data";

export const metadata = {
  title: "About Us | The Reform Times",
  description: "Learn about our mission, vision, and the team behind The Reform Times.",
};

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-brand-navy text-white py-20 md:py-32">
        <div className="container max-w-4xl text-center">
          <h1 className="font-serif font-bold text-4xl md:text-6xl leading-tight mb-6">
            Truth. Transparency. Transformation.
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-serif italic max-w-3xl mx-auto">
            "We believe that a well-informed public is the foundation of a just society."
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h2 className="font-serif font-bold text-3xl text-brand-navy mb-6">Our Mission</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                The Reform Times is an independent, non-profit newsroom dedicated to investigative journalism in the public interest. We focus on uncovering the truth behind abuses of power, betrayals of the public trust, and systemic failures.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                By shining a light on the most critical issues of our time, we empower citizens to demand accountability and advocate for meaningful reform.
              </p>
            </div>
            <div>
              <h2 className="font-serif font-bold text-3xl text-brand-navy mb-6">Our Vision</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                We envision a society where transparency is the norm, where the marginalized are heard, and where those in power are held strictly accountable to the people they serve.
              </p>
              <ul className="space-y-4 text-brand-navy font-semibold">
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-brand-red rounded-full"></span>
                  Uncompromising Editorial Independence
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-brand-red rounded-full"></span>
                  Evidence-Based Reporting
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-brand-red rounded-full"></span>
                  Amplifying Marginalized Voices
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Meet The Team */}
      <section className="py-16 md:py-24 bg-brand-gray-light">
        <div className="container">
          <SectionHeader title="Meet Our Newsroom" subtitle="Award-winning journalists dedicated to the truth." className="text-center" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {authors.map(author => (
              <div key={author.id} className="bg-white p-6 border border-gray-200 text-center hover:border-brand-red transition-colors group">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden relative mb-6 border-4 border-white shadow-lg">
                  <Image src={author.avatar} alt={author.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                </div>
                <h3 className="font-serif font-bold text-xl text-brand-navy mb-1">{author.name}</h3>
                <p className="text-brand-red text-xs font-bold uppercase tracking-wider mb-4">{author.role}</p>
                <p className="text-gray-600 text-sm line-clamp-4">
                  {author.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-brand-red text-white text-center">
        <div className="container max-w-3xl">
          <h2 className="font-serif font-bold text-4xl mb-6">Support Independent Journalism</h2>
          <p className="text-xl text-red-100 mb-10 leading-relaxed">
            We rely on readers like you to fund our investigations. Join us in the fight for transparency and justice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-brand-red px-8 py-4 font-bold text-lg hover:bg-gray-100 transition-colors rounded-sm">
              Become a Member
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-4 font-bold text-lg hover:bg-white hover:text-brand-red transition-colors rounded-sm">
              Submit a Tip
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
