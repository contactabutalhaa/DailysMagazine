'use client';

import React, { useState } from 'react';
import { Mail, MessageSquare, HelpCircle, ChevronDown, CheckCircle2, Send, MapPin, Sparkles } from 'lucide-react';

const FAQS = [
  {
    q: 'How do I pitch a story to DailysMagazine?',
    a: 'Please visit our dedicated Write For Us page and submit your pitch via our interactive form, or email your pitch directly to lucamarvass@gmail.com. Our commissioning editors review incoming pitches twice weekly.',
  },
  {
    q: 'Can I syndicate or republish DailysMagazine content?',
    a: 'We grant republication licenses to accredited non-profit journals, universities, and partner publications with proper canonical attribution. Contact lucamarvass@gmail.com for syndication rights.',
  },
  {
    q: 'How do I submit an editorial correction?',
    a: 'Editorial accuracy is paramount. If you spot a factual error in any published dispatch, email lucamarvass@gmail.com with the article link and verified supporting sources.',
  },
  {
    q: 'How do I manage or cancel my newsletter subscription?',
    a: 'Every daily dispatch includes a 1-click unsubscribe link in the footer. You can also customize your category topic preferences via the subscribe modal on the website.',
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    inquiryType: 'editorial',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header Banner */}
      <section className="bg-slate-50 border-b border-slate-200/80 pt-16 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider">
            <Mail className="w-3.5 h-3.5" />
            Direct Communications
          </div>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-slate-900 tracking-tight">
            Contact DailysMagazine.
          </h1>
          <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Have a question, feedback, story tip, or partnership inquiry? Our editorial desks are here to assist you.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        {/* 2-Column Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column (5 cols): Contact Desks & FAQ Accordion */}
          <div className="lg:col-span-5 space-y-8">
            {/* Direct Desks Card */}
            <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200">
              <h3 className="font-heading font-extrabold text-lg text-slate-900 mb-4">
                Editorial & Business Desks
              </h3>
              <div className="space-y-4 text-sm">
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-subtle">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 block mb-1">
                    Primary Editorial & Story Tips
                  </span>
                  <a
                    href="mailto:lucamarvass@gmail.com"
                    className="font-bold text-slate-900 hover:text-orange-600 transition-colors flex items-center gap-1.5"
                  >
                    <Mail className="w-4 h-4 text-orange-500" />
                    lucamarvass@gmail.com
                  </a>
                  <p className="text-xs text-slate-500 mt-1">
                    For story tips, letters to the editor, pitch inquiries, and corrections.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-subtle">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block mb-1">
                    Brand Partnerships & Media Kit
                  </span>
                  <a
                    href="mailto:lucamarvass@gmail.com?subject=Brand%20Partnership%20Inquiry"
                    className="font-bold text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-1.5"
                  >
                    <Mail className="w-4 h-4 text-blue-500" />
                    lucamarvass@gmail.com
                  </a>
                  <p className="text-xs text-slate-500 mt-1">
                    For advertising proposals, sponsorships, and newsletter takeovers.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-subtle">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block mb-1">
                    Press & Syndication Rights
                  </span>
                  <a
                    href="mailto:lucamarvass@gmail.com?subject=Press%20Syndication%20Rights"
                    className="font-bold text-slate-900 hover:text-emerald-600 transition-colors flex items-center gap-1.5"
                  >
                    <Mail className="w-4 h-4 text-emerald-500" />
                    lucamarvass@gmail.com
                  </a>
                  <p className="text-xs text-slate-500 mt-1">
                    Media inquiries, interview requests, and content licensing.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Accordion */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="w-4 h-4 text-orange-600" />
                <h3 className="font-heading font-extrabold text-lg text-slate-900">
                  Frequently Asked Questions
                </h3>
              </div>

              <div className="space-y-3">
                {FAQS.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="border border-slate-200 rounded-2xl overflow-hidden bg-white"
                    >
                      <button
                        onClick={() => toggleFaq(idx)}
                        className="w-full p-4 text-left flex items-center justify-between gap-3 text-sm font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-orange-600' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column (7 cols): Interactive Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
            {submitted ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-extrabold text-2xl text-slate-900">
                  Message Dispatched!
                </h3>
                <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-slate-900">{formData.name}</strong>. Your communication regarding &ldquo;{formData.subject}&rdquo; has been routed to the appropriate editor. We typically reply within 24–48 hours at <strong className="text-slate-900">{formData.email}</strong>.
                </p>
                <div className="pt-6">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-8 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-orange-600 text-xs font-bold uppercase tracking-wider mb-1">
                    <Sparkles className="w-4 h-4" />
                    Send An Inquiry
                  </div>
                  <h3 className="font-heading font-extrabold text-2xl text-slate-900">
                    Reach Out Directly
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    All inquiries are monitored by our editorial staff during business hours (Monday–Friday).
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Maya Thorne"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@domain.com"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Inquiry Topic *
                      </label>
                      <select
                        value={formData.inquiryType}
                        onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                      >
                        <option value="editorial">Editorial & Letter to Editor</option>
                        <option value="advertising">Advertising & Media Kit</option>
                        <option value="press">Press & Syndication</option>
                        <option value="general">General Support / Subscription</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Subject Line *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Brief summary of inquiry"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please provide details about your inquiry..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-sm uppercase tracking-wider transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 group"
                  >
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    <span>Send Message to DailysMagazine</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
