function ContactForm() {
  return (
    <form
      className="contact-form"
      action="https://formspree.io/f/mwvrloey"
      method="POST"
    >
      <div className="field-grid">
        <div className="field">
          <label htmlFor="full-name">Full name</label>
          <input
            id="full-name"
            name="name"
            type="text"
            required
            placeholder="Your name"
          />
        </div>
        <div className="field">
          <label htmlFor="contact-email">Email</label>
          <input
            id="contact-email"
            name="_replyto"
            type="email"
            required
            placeholder="you@gmail.com"
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor="subject">Subject</label>
        <input
          id="subject"
          name="subject"
          type="text"
          placeholder="How can we help?"
        />
      </div>
      <div className="field">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          placeholder="Tell us a bit more..."
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Send message
      </button>
      <p className="contact-note">
        This form uses Formspree and sends messages directly to{" "}
        <code>amaranaeem453@gmail.com</code> through the configured form endpoint.
      </p>
    </form>
  );
}

export default ContactForm;

