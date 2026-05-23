import { Mail, Phone, MapPin, ShieldAlert } from "lucide-react";
import ContactForm from "@/components/shared/ContactForm";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isBangla = locale === 'bn';
  return {
    title: isBangla ? "যোগাযোগ করুন | দি রিফর্ম টাইমস" : "Contact Us | The Reform Times",
    description: isBangla 
      ? "আমাদের নিউজরুমের সাথে যোগাযোগ করুন, সংবাদের টিপস পাঠান বা আমাদের টিমের সাথে যোগাযোগ করুন।" 
      : "Get in touch with our newsroom, submit a story tip, or contact our team.",
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isBangla = locale === 'bn';

  return (
    <div className="bg-surface min-h-screen py-12 md:py-20 transition-colors duration-300">
      <div className="container max-w-6xl px-4">
        <div className="text-center mb-16">
          <h1 className="font-serif font-bold text-4xl md:text-5xl text-title mb-4">
            {isBangla ? 'নিউজরুমের সাথে যোগাযোগ' : 'Contact The Newsroom'}
          </h1>
          <p className="text-caption max-w-2xl mx-auto text-lg">
            {isBangla 
              ? 'আপনার কাছে কোনো সংবাদের সূত্র বা টিপস থাকলে, আমাদের কভারেজ নিয়ে মতামত বা যেকোনো সাধারণ জিজ্ঞাসা থাকলে আমাদের জানান।' 
              : 'Whether you have a story tip, feedback on our coverage, or general inquiries, we want to hear from you.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-card p-8 border border-border rounded-2xl shadow-sm transition-colors duration-300">
              <h3 className="font-serif font-bold text-xl text-title mb-6">
                {isBangla ? 'সাধারণ জিজ্ঞাসা' : 'General Inquiries'}
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-body">
                  <Mail className="text-primary shrink-0" size={20} />
                  <div>
                    <p className="font-semibold text-title">{isBangla ? 'ইমেইল' : 'Email'}</p>
                    <a href="mailto:thereformtimes@gmail.com" className="hover:text-primary transition-colors text-caption">thereformtimes@gmail.com</a>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-body">
                  <Phone className="text-primary shrink-0" size={20} />
                  <div>
                    <p className="font-semibold text-title">{isBangla ? 'ফোন' : 'Phone'}</p>
                    <span className="text-caption">+880 ****-******</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-body">
                  <MapPin className="text-primary shrink-0" size={20} />
                  <div>
                    <p className="font-semibold text-title">{isBangla ? 'কার্যালয়' : 'Office'}</p>
                    <p className="text-caption">{isBangla ? 'ঢাকা, বাংলাদেশ' : 'Dhaka, Bangladesh'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-secondary text-white p-8 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <ShieldAlert className="text-primary animate-pulse" size={24} />
                <h3 className="font-serif font-bold text-xl">
                  {isBangla ? 'সুরক্ষিত তথ্য' : 'Secure Tips'}
                </h3>
              </div>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                {isBangla 
                  ? 'আপনার কাছে কি কোনো গোপন তথ্য আছে? আপনার পরিচয় সম্পূর্ণ গোপন রেখে আমাদের তথ্য পাঠাতে আমাদের সুরক্ষিত চ্যানেল ব্যবহার করুন।' 
                  : 'Have confidential information? Use our secure channels to protect your identity.'}
              </p>
              <a href="#" className="inline-block bg-transparent border border-white text-white px-6 py-2 text-sm font-semibold hover:bg-white hover:text-secondary rounded-xl transition-colors">
                {isBangla ? 'কিভাবে সুরক্ষিত টিপস পাঠাবেন' : 'Learn How to Send Secure Tips'}
              </a>
            </div>
          </div>

          {/* Forms Area */}
          <div className="lg:col-span-2 bg-card p-8 md:p-12 border border-border rounded-2xl shadow-sm transition-colors duration-300">
            <h2 className="font-serif font-bold text-2xl text-title mb-8 border-b border-border pb-4">
              {isBangla ? 'একটি বার্তা বা সংবাদের আইডিয়া পাঠান' : 'Send a Message or Story Idea'}
            </h2>
            
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
