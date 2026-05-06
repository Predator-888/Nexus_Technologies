"use client";

import { motion } from "framer-motion";

const domains = [
  { id: "data-science", name: "Data Science", icon: "📊", desc: "Analyze data, build models, and discover insights." },
  { id: "python", name: "Python Programming", icon: "🐍", desc: "Master the versatile language for web, scripting & AI." },
  { id: "java", name: "Java Programming", icon: "☕", desc: "Build enterprise-grade applications and systems." },
  { id: "ai", name: "Artificial Intelligence", icon: "🧠", desc: "Create intelligent agents and neural networks." },
  { id: "ml", name: "Machine Learning", icon: "🤖", desc: "Train algorithms to learn from complex datasets." },
  { id: "web-dev", name: "Web Development", icon: "💻", desc: "Build modern, responsive full-stack applications." }
];

interface Props {
  onSelect: (domain: string) => void;
}

export default function DomainSelection({ onSelect }: Props) {
  return (
    <div className="w-full">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Choose Your Path</h2>
        <p className="text-gray-400">Select the internship domain you wish to enroll in.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {domains.map((domain, i) => (
          <motion.div
            key={domain.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => onSelect(domain.name)}
            className="glass-panel p-8 rounded-2xl cursor-pointer hover:border-primary/50 transition-colors group"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{domain.icon}</div>
            <h3 className="text-xl font-bold mb-2 text-white group-hover:text-primary transition-colors">{domain.name}</h3>
            <p className="text-sm text-gray-400">{domain.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
