
import React, { useEffect, useState } from 'react';
import BannerArea from './BannerArea';
import PostGrid from './PostGrid';
import PostTrending from './PostTrending';
import { Link } from 'react-router-dom';
import { fetchHomeData, fetchFavorites, toggleFavorite as toggleFavoriteApi } from '../../Services/Api.jsx';



import PostLatest from './PostLatest';




export default function Landing() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(new Set()); // Set to manage favorites

  const userId = localStorage.getItem("USER_ID"); // Replace with the actual user ID

  useEffect(() => {
    const fetchData = async () => {
      try {
        const homeData = await fetchHomeData();
        const favoriteIds = await fetchFavorites(userId);

        setData(homeData);
        setFavorites(favoriteIds);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const toggleFavorite = async (blogId) => {
    try {
      const isFavorite = favorites.has(blogId);
      await toggleFavoriteApi(userId, blogId, isFavorite);

      setFavorites((prev) => {
        const updated = new Set(prev);
        if (isFavorite) {
          updated.delete(blogId);
        } else {
          updated.add(blogId);
        }
        return updated;
      });
    } catch (err) {
      console.error("Error toggling favorite:", err.message);
    }
  };


  if (loading) return (
    <div className="preloader" id="preloader">
      <div className="preloader-inner">
        <div className="spinner">
          <div className="dot1"></div>
          <div className="dot2"></div>
        </div>
      </div>
    </div>
  );

  if (error) return <div>Error: {error}</div>;

  const latest = data.latest.slice(1, 5);
  const grid = data.latest.slice(5, 13);


  return (
    <span style={{position:'relative'}}>
      <BannerArea 
        data={data.latest} 
        favorites={favorites} 
        toggleFavorite={toggleFavorite} 
      />
      <PostTrending 
        trends={data.trends} 
        latest={latest} 
        favorites={favorites} 
        toggleFavorite={toggleFavorite} 
      />
              <CreateWithAISection />
              <DiscountSection />
      <PostGrid 
        grid={grid} 
        favorites={favorites} 
        toggleFavorite={toggleFavorite} 
      />
  
    </span>
)

}



function CreateWithAISection() {
  return (
    <section className="create-with-ai-section" style={{ padding: '50px 0', backgroundColor: '#102950', height: '600px' }}>
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <img
              src="https://images.unsplash.com/photo-1728755696561-f8fd6ff03630?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Create with AI"
              className="img-fluid rounded"
              style={{ width: '100%', borderRadius: '8px' }}
            />
          </div>
          <div className="col-lg-6">
            <h2 style={{ color: 'white' }}>Create with <span style={{ color: '#FFBE00' }}>AI</span></h2>
            <p style={{ color: 'white' }}>
              At <span style={{ color: '#FFBE00' }}>Next</span> Page, we empower you to unleash your creativity. Write insightful articles and generate stunning images using our AI-powered tools.
            </p>
            <p style={{ marginBottom: '15px', color: 'white' }}>
              Whether you are a seasoned writer or just starting, our platform provides the resources you need to share your thoughts and visuals with the world.
            </p>
            <p style={{ marginBottom: '15px', color: 'white' }}>
              Our AI tools make it easy to create professional-quality content and eye-catching images effortlessly. Join our community and start creating today!
            </p>
            <Link to="/user" className="btn btn-base" style={{ padding: '', fontSize: '16px' }}>Start Creating</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
function DiscountSection() {
  return (
<section className="chatbot-section" style={{ padding: '26px 20px', background: 'linear-gradient(70deg, #6aafe6 0%, #097BED 100%)', color: '#ffffff', height: '210px', width: '90%', position: 'relative', top: '-100px', left: '75px' }}>
  <div className="container">
    <div className="row">
      <div className="col-lg-9">
        <h2 style={{ color: '#FFBE00' }}>Interactive Q&A</h2>
        <p style={{ color: '#ffffff' }}>
          Engage with our articles through our interactive Q&A chatbot. Ask questions, get insights, and discuss the content directly with our AI-powered assistant. Join us now and enhance your reading experience!
        </p>
      </div>
      <div className="col-lg-3">
        <img
          src="https://media.istockphoto.com/id/1494104649/photo/ai-chatbot-artificial-intelligence-digital-concept.jpg?s=612x612&w=0&k=20&c=1Zq2sj3W0tWcpc-n1fVt4dQQOBGhtwcAk1H2eQ5MAbI="
          alt="Interactive Q&A"
          className="img-fluid rounded"
          style={{ width: '280px', borderRadius: '8px'}}
        />
      </div>
    </div>
  </div>
</section>


  );
}
