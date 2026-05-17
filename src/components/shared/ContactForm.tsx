'use client';

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Name, email, and message are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Your message has been sent successfully!');
        setFormData({
          name: '',
          email: '',
          subject: '',
          category: '',
          message: '',
        });
      } else {
        toast.error(data.error || 'Failed to send message.');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-title mb-2">Full Name</label>
          <input 
            type="text" 
            id="name" 
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-surface border border-border p-3 text-sm text-body rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-caption/50"
            placeholder="Jane Doe"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-title mb-2">Email Address</label>
          <input 
            type="email" 
            id="email" 
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-surface border border-border p-3 text-sm text-body rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-caption/50"
            placeholder="jane@example.com"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-semibold text-title mb-2">Subject / Story Title</label>
        <input 
          type="text" 
          id="subject" 
          value={formData.subject}
          onChange={handleChange}
          className="w-full bg-surface border border-border p-3 text-sm text-body rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-caption/50"
          placeholder="What is this regarding?"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-semibold text-title mb-2">Category (Optional)</label>
        <select 
          id="category" 
          value={formData.category}
          onChange={handleChange}
          className="w-full bg-surface border border-border p-3 text-sm text-body rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-card"
        >
          <option value="">General Inquiry</option>
          <option value="tip">Story Tip</option>
          <option value="correction">Correction Request</option>
          <option value="press">Press / Media</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-title mb-2">Message</label>
        <textarea 
          id="message" 
          rows={6}
          value={formData.message}
          onChange={handleChange}
          className="w-full bg-surface border border-border p-3 text-sm text-body rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-caption/50"
          placeholder="Provide details here..."
          required
        ></textarea>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="bg-primary text-white px-8 py-3.5 font-bold text-sm rounded-xl hover:bg-primary/95 transition-all shadow-md shadow-primary/10 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Sending...
          </>
        ) : 'Send Message'}
      </button>
    </form>
  );
}
