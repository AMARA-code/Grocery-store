import ContactForm from "../components/ContactForm";

function Contact() {
  return (
    <div className="container contact-page">
      <div className="contact-layout">
        <section>
          <h1 className="page-title">Contact us</h1>
          <p className="page-subtitle">
            Have a question about your order or our products? Send us a message
            and we&apos;ll get back to you as soon as possible.
          </p>
          <div className="contact-details">
            <p>
              Email:{" "}
              <a href="mailto:amaranaeem453@gmail.com">
                amaranaeem453@gmail.com
              </a>
            </p>
            <p>
              Phone:{" "}
              <a href="tel:03346445127">03346445127</a>
            </p>
          </div>
        </section>
        <section>
          <ContactForm />
        </section>
      </div>
    </div>
  );
}

export default Contact;

