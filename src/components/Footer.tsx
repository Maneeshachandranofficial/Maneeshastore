'use client';

import Link from 'next/link';

import { Mail, Phone } from 'lucide-react';
import { useState, FormEvent } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setEmail('');
        setMessage('Welcome to The Inner Circle.');
        // Reset success message after 5 seconds
        setTimeout(() => {
          setStatus('idle');
          setMessage('');
        }, 5000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <footer className="bg-ivory pt-32 pb-12 border-t border-charcoal/5">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col items-center justify-center mb-20">
          <Link href="/">
            <img src="/logo.svg" alt="Maneesha Chandran" className="h-16 md:h-20 object-contain" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-20 text-center md:text-left">
          <div className="flex flex-col gap-6">
            <h4 className="font-sans font-medium text-charcoal tracking-widest text-xs uppercase">Shop</h4>
            <div className="flex flex-col gap-4">
              <Link href="/category/bridal" className="text-charcoal-light font-light hover:text-charcoal transition-colors text-sm">Bridal</Link>
              <Link href="/category/grooms" className="text-charcoal-light font-light hover:text-charcoal transition-colors text-sm">Grooms</Link>
              <Link href="/category/kids" className="text-charcoal-light font-light hover:text-charcoal transition-colors text-sm">Kids</Link>
            </div>
          </div>
          
          <div className="flex flex-col gap-6">
            <h4 className="font-sans font-medium text-charcoal tracking-widest text-xs uppercase">Collections</h4>
            <div className="flex flex-col gap-4">
              <Link href="/category/ethnic-wear" className="text-charcoal-light font-light hover:text-charcoal transition-colors text-sm">Ethnic Wear</Link>
              <Link href="/category/onam-2026" className="text-charcoal-light font-light hover:text-charcoal transition-colors text-sm">Onam '26</Link>
              <Link href="/category/eves-garden" className="text-charcoal-light font-light hover:text-charcoal transition-colors text-sm">Eves Garden '24</Link>
            </div>
          </div>
          
          <div className="flex flex-col gap-6">
            <h4 className="font-sans font-medium text-charcoal tracking-widest text-xs uppercase">Assistance</h4>
            <div className="flex flex-col gap-4">
              <a href="mailto:maneeshachandranofficial@gmail.com" className="flex items-center gap-3 text-charcoal-light hover:text-maroon transition-colors group">
                <Mail className="w-4 h-4 text-charcoal/40 group-hover:text-maroon transition-colors" />
                <span className="text-sm font-light">Email Us</span>
              </a>
              <a href="tel:+919526266369" className="flex items-center gap-3 text-charcoal-light hover:text-maroon transition-colors group">
                <Phone className="w-4 h-4 text-charcoal/40 group-hover:text-maroon transition-colors" />
                <span className="text-sm font-light">+91 9526266369</span>
              </a>
              <a href="https://wa.me/919526266369" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-charcoal-light hover:text-maroon transition-colors group">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-charcoal/40 group-hover:text-maroon transition-colors"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                <span className="text-sm font-light">WhatsApp</span>
              </a>
              <a href="https://instagram.com/maneesha_chandran_official" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-charcoal-light hover:text-maroon transition-colors group">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-charcoal/40 group-hover:text-maroon transition-colors"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                <span className="text-sm font-light">Instagram</span>
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-6 items-center md:items-start">
            <h4 className="font-sans font-medium text-charcoal tracking-widest text-xs uppercase">The Inner Circle</h4>
            <p className="text-charcoal-light font-light text-sm leading-relaxed text-center md:text-left">Subscribe for exclusive releases and private viewing invitations.</p>
            <form onSubmit={handleSubscribe} className="flex w-full border-b border-charcoal/20 pb-2 relative">
              <input 
                type="email" 
                placeholder="Email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading'}
                required
                className="bg-transparent flex-grow text-sm outline-none text-charcoal placeholder:text-charcoal/40 font-light disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={status === 'loading'}
                className="text-charcoal font-sans text-xs tracking-widest uppercase hover:text-gold-dark transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? 'Joining...' : 'Subscribe'}
              </button>
              
              {message && (
                <div className={`absolute top-full left-0 mt-3 text-xs tracking-wide ${status === 'success' ? 'text-gold-dark' : 'text-maroon'}`}>
                  {message}
                </div>
              )}
            </form>
          </div>
        </div>
        
        <div className="mt-20 border-t border-charcoal/10 pt-8" />

        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-charcoal/40 text-xs font-light">
          <p>&copy; {new Date().getFullYear()} Maneesha Chandran. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-charcoal transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-charcoal transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
