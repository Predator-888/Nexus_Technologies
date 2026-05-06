"use client";

import { useState } from "react";
import Hero from "../components/Hero";
import DomainSelection from "../components/DomainSelection";
import RegistrationForm from "../components/RegistrationForm";
import Checkout from "../components/Checkout";

export default function Home() {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [userData, setUserData] = useState<{name: string, email: string} | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [docsUrl, setDocsUrl] = useState<{offer: string, cert: string} | null>(null);

  const handleDomainSelect = (domain: string) => {
    setSelectedDomain(domain);
  };

  const handleRegistrationSubmit = (data: {name: string, email: string}) => {
    setUserData(data);
    setIsRegistered(true);
  };

  const handlePaymentSuccess = (docs: {offer: string, cert: string}) => {
    setIsPaid(true);
    setDocsUrl(docs);
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center">
      {/* Navbar Placeholder */}
      <nav className="w-full p-6 flex justify-between items-center glass-panel fixed top-0 z-50">
        <div className="text-2xl font-bold text-gradient tracking-wider">CODSOFT</div>
        <div className="flex gap-6 text-sm text-gray-300">
          <a href="#hero" className="hover:text-white transition">Home</a>
          <a href="#domains" className="hover:text-white transition">Domains</a>
          <a href="#register" className="hover:text-white transition">Register</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="w-full h-screen">
        <Hero />
      </section>

      <div className="max-w-6xl w-full px-6 pb-24 flex flex-col gap-24">
        
        {/* Domain Selection */}
        {!selectedDomain && (
          <section id="domains" className="w-full scroll-mt-24">
            <DomainSelection onSelect={handleDomainSelect} />
          </section>
        )}

        {/* Registration Form */}
        {selectedDomain && !isRegistered && (
          <section id="register" className="w-full scroll-mt-24">
            <RegistrationForm 
              domain={selectedDomain} 
              onSubmit={handleRegistrationSubmit} 
              onBack={() => setSelectedDomain(null)}
            />
          </section>
        )}

        {/* Checkout & Document Download */}
        {isRegistered && !isPaid && (
          <section id="checkout" className="w-full scroll-mt-24 flex flex-col items-center text-center">
            <h2 className="text-4xl font-bold mb-6">Complete Your Registration</h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              You have selected the <span className="text-white font-semibold">{selectedDomain}</span> domain. 
              Please pay the 69 RS processing fee to generate your Offer Letter and Internship Certificate.
            </p>
            <Checkout amount={69} onSuccess={handlePaymentSuccess} userData={userData} />
          </section>
        )}

        {/* Success / Download Links */}
        {isPaid && docsUrl && (
          <section className="w-full text-center glass-panel p-12 rounded-2xl border border-green-500/30">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-green-400">Payment Successful!</h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Welcome to CodSoft! Your documents have been generated. You can download them below.
              (Note: The actual email feature is disabled for this prototype).
            </p>
            <div className="flex justify-center gap-6">
              <a href={docsUrl.offer} target="_blank" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition button-glow">
                Download Offer Letter
              </a>
              <a href={docsUrl.cert} target="_blank" className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold transition button-glow">
                Download Certificate
              </a>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
