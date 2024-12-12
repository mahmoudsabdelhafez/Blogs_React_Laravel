import React from 'react';

export default function AboutUs() {
  return (
    <section className="about-us-area section-margin mt-4" style={{ padding: '20px' }}>
      <div className="container" style={{ maxWidth: '1140px', margin: '0 auto' }}>
        <div className="row" style={{ display: 'flex', flexWrap: 'wrap', margin: '-15px' }}>
          <div className="col-lg-6" style={{ padding: '15px' }}>
            <div className="about-us-text" style={{ marginBottom: '30px' }}>
              <h2 className="section-title" style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '20px' }}>About Us</h2>
              <p className="lead" style={{ fontSize: '18px', lineHeight: '1.5', marginBottom: '20px' }}>
                Welcome to <strong>Next Page</strong>, your go-to destination for insightful articles, stories, and thought-provoking content across a wide range of topics.
              </p>
              <p style={{ marginBottom: '15px' }}>
                At Next Page, we believe in the power of words to inspire, inform, and entertain. Our mission is to bring you fresh perspectives on everything from lifestyle and culture to technology, business, and personal growth.
              </p>
              <p style={{ marginBottom: '15px' }}>
                Our team of passionate writers, journalists, and experts are dedicated to creating content that resonates with curious minds. We aim to spark conversation, encourage learning, and provide readers with valuable insights that help them navigate the ever-changing world around us.
              </p>
              <p style={{ marginBottom: '15px' }}>
                Whether you're here to explore new ideas, stay up-to-date on current events, or dive deep into specific topics of interest, you'll find something for you on Next Page. Our commitment to quality writing and engaging storytelling is at the heart of everything we do.
              </p>
            </div>
          </div>
          <div className="col-lg-6" style={{ padding: '15px' }}>
            <div className="about-us-image" style={{ marginBottom: '30px' }}>
              <img
                src="https://media.istockphoto.com/id/1658987072/photo/aerial-shot-of-people-walking-on-the-gay-pride-parade.jpg?s=612x612&w=0&k=20&c=fynCoY9f4R-GauVDTP5pnstBa0DQKri9Vr99KAxiKUA=" // Replace with your image
                alt="Next Page Blog"
                className="img-fluid rounded "
                style={{ width: '100%', borderRadius: '8px' , marginTop:'150px' }}
              />
            </div>
          </div>
        </div>
        <div className="row mt-5" style={{ display: 'flex', flexWrap: 'wrap', margin: '-15px' }}>
          <div className="col-12" style={{ padding: '15px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Our Mission</h3>
            <p style={{ marginBottom: '15px' }}>
              Our mission is to provide you with high-quality content that not only entertains but also informs and educates. We want to be a platform where you can always turn to for the next page of knowledge, creativity, and inspiration.
            </p>
          </div>
        </div>
        <div className="row mt-5" style={{ display: 'flex', flexWrap: 'wrap', margin: '-15px' }}>
          <div className="col-md-4" style={{ padding: '15px' }}>
            <h4 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Our Values</h4>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '10px' }}><strong>Creativity:</strong> We embrace creativity in all forms and encourage new ideas to take shape.</li>
              <li style={{ marginBottom: '10px' }}><strong>Integrity:</strong> We are committed to honesty and transparency in our content.</li>
              <li style={{ marginBottom: '10px' }}><strong>Engagement:</strong> Our goal is to spark meaningful conversations and build a community of like-minded individuals.</li>
            </ul>
          </div>
          <div className="col-md-4" style={{ padding: '15px' }}>
            <h4 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Meet the Team</h4>
            <p style={{ marginBottom: '15px' }}>
              The Next Page team is a group of passionate writers, editors, and content creators from diverse backgrounds. We’re all driven by a love for storytelling and a commitment to providing content that matters.
            </p>
          </div>
          <div className="col-md-4" style={{ padding: '15px' }}>
            <h4 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Join Our Community</h4>
            <p style={{ marginBottom: '15px' }}>
              Stay connected with us by following Next Page on social media, subscribing to our newsletter, and joining our ever-growing community of readers. Share your thoughts, leave comments, and let's make every page count together.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
