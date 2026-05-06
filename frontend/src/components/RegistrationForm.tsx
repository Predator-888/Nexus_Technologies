"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  domain: string;
  onSubmit: (data: { name: string; email: string; phone: string; university: string }) => void;
  onBack: () => void;
}

export default function RegistrationForm({ domain, onSubmit, onBack }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    university: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto w-full glass-panel p-8 rounded-2xl relative"
    >
      <button 
        onClick={onBack}
        className="absolute top-6 right-6 text-gray-400 hover:text-white transition"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>

      <div className="mb-8">
        <span className="text-primary text-sm font-bold tracking-wider uppercase mb-2 block">Selected Domain</span>
        <h2 className="text-3xl font-bold text-white">{domain}</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400">Full Name</label>
            <input 
              type="text" 
              required
              className="bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-primary transition"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400">Email Address</label>
            <input 
              type="email" 
              required
              className="bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-primary transition"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400">Phone Number</label>
            <input 
              type="tel" 
              required
              className="bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-primary transition"
              placeholder="+91 9876543210"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400">University / College</label>
            <input 
              type="text" 
              required
              className="bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-primary transition"
              placeholder="Stanford University"
              value={formData.university}
              onChange={(e) => setFormData({...formData, university: e.target.value})}
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="mt-4 w-full py-4 bg-primary text-white rounded-lg font-bold text-lg button-glow"
        >
          Proceed to Payment
        </button>
      </form>
    </motion.div>
  );
}
