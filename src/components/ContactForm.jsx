import { useState } from 'react';
import { motion } from 'framer-motion';

const WHATSAPP_NUMBER = '254791154865'; // country code + number, no "+", no spaces

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const text =
      `New message from portfolio site\n\n` +
      `Name: ${form.name}\n` +
      (form.email ? `Email: ${form.email}\n` : '') +
      `Message: ${form.message}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <form className="contact-form-card" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" value={form.name} onChange={handleChange} required />
      </div>

      <div className="form-field">
        <label htmlFor="email">Email (optional)</label>
        <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
      </div>

      <div className="form-field">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" rows={3} value={form.message} onChange={handleChange} required />
      </div>

      <motion.button
        type="submit"
        className="form-submit"
        onMouseEnter={() => setIsButtonHovered(true)}
        onMouseLeave={() => setIsButtonHovered(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.span
          className="form-submit-shine"
          animate={isButtonHovered ? { translateX: '200%' } : { translateX: '-100%' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
        <span className="form-submit-text">Send on WhatsApp</span>
      </motion.button>
    </form>
  );
}