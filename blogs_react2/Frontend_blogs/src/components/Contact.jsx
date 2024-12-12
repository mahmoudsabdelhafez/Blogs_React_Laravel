import React, { useState } from 'react';

export default function Contact() {
  // Set up state to manage form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') setName(value);
    if (name === 'email') setEmail(value);
    if (name === 'subject') setSubject(value);
    if (name === 'message') setMessage(value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!name || !email || !subject || !message) {
      setStatusMessage('All fields are required.');
      return;
    }

    // Send the form data to the server
    try {
      const response = await fetch('http://127.0.0.1:8000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (response.ok) {
        setStatusMessage('Your message has been sent successfully!');
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        setStatusMessage('Something went wrong. Please try again later.');
      }
    } catch (error) {
      setStatusMessage('Error: Unable to send your message.');
    }
  };

  return (
    <section className="section-margin--small section-margin mt-5">
      <div className="container">
        <div className="d-none d-sm-block mb-5 pb-4">
          <div className="row">
            {/* Contact Info */}
            <div className="mb-4 " style={{marginLeft:34}}>
                <h2>Get in Touch</h2>
                <p>
                  Feel free to reach out to us using the form below. Whether you have questions, feedback, or need assistance, we're here to help!
                </p>
              </div>
            <div className="col-md-4 col-lg-3 mb-4 mb-md-0">
              <div className="media contact-info">
                <span className="contact-info__icon">
                  <i className="ti-home" />
                </span>
                <div className="media-body">
                  <h3>California United States</h3>
                  <p>Santa Monica Boulevard</p>
                </div>
              </div>
              <div className="media contact-info">
                <span className="contact-info__icon">
                  <i className="ti-headphone" />
                </span>
                <div className="media-body">
                  <h3>
                    <a href="tel:454545654">00 (440) 9865 562</a>
                  </h3>
                  <p>Mon to Fri 9am to 6pm</p>
                </div>
              </div>
              <div className="media contact-info">
                <span className="contact-info__icon">
                  <i className="ti-email" />
                </span>
                <div className="media-body">
                  <h3>
                    <a href="mailto:support@colorlib.com">support@colorlib.com</a>
                  </h3>
                  <p>Send us your query anytime!</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="col-md-8 col-lg-9">
            
             

              <form
                onSubmit={handleSubmit}
                className="form-contact contact_form"
                method="post"
                id="contactForm"
                noValidate="novalidate"
              >
                <div className="row">
                  <div className="col-lg-5">
                    <div className="form-group">
                      <input
                        className="form-control"
                        name="name"
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        className="form-control"
                        name="email"
                        id="email"
                        type="email"
                        placeholder="Enter email address"
                        value={email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        className="form-control"
                        name="subject"
                        id="subject"
                        type="text"
                        placeholder="Enter Subject"
                        value={subject}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-lg-7">
                    <div className="form-group">
                      <textarea
                        className="form-control different-control w-100"
                        name="message"
                        id="message"
                        cols={30}
                        rows={5}
                        placeholder="Enter Message"
                        value={message}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="form-group text-center text-md-right mt-3">
                  <button type="submit" className="btn btn-blue">
                    Send Message
                  </button>
                </div>
              </form>

              {/* Status Message */}
              {statusMessage && (
                <div className="mt-4">
                  <p>{statusMessage}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
