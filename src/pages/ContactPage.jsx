import portrait from '../assets/images/contact.jpg'; // Adjust path if needed
import React, { useState } from 'react';

const ContactPage = () => {
  // Simple form state (no backend, just feedback)
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here, you would normally handle sending the form somewhere
    setSubmitted(true);
  };

  return (
    <section className="contact">
      <div className="contactcard contactphoto">
        <img className="photo" src={portrait} alt="Contact form photo" />
      </div>
      <div className="contactcard contactdetails">
        <br /><h2>GET IN TOUCH</h2>
        {submitted ? (
          <p>Thank you for your message!</p>
        ) : (
          <form onSubmit={handleSubmit} autoComplete="off" netlify>
            <div style={{ display: 'none' }}>
              {/* Honeypot field */}
              <label htmlFor="bot-field">Don't fill this out if you're human:</label>
              <input name="bot-field" id="bot-field" />
            </div>
            <label htmlFor="name"></label>
            <br />
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <br /><br />
            <label htmlFor="email"></label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
            <br /><br />
            <label htmlFor="message">Message</label>
            <br />
            <textarea
              id="message"
              name="message"
              rows={10}
              cols={40}
              placeholder="Your message..."
              value={form.message}
              onChange={handleChange}
              required
            />
            <br /><br />
            <button type="submit" className="button">Send</button>
          </form>
        )}
      </div>
    </section>
  );
};

export default ContactPage;