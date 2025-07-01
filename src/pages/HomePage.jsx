import React, { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import GreenBox from '../components/GreenBox.jsx';
import portrait from '../assets/images/portrait.jpg';
import './HomePage.css';

function HomePage() {
  const { setTopbox } = useOutletContext();

  useEffect(() => {
    setTopbox(<></>);
  }, [setTopbox]);

  return (
    <section className="home">
        <GreenBox to="/about" className="homebox">
            <img className="photo" src={portrait} />
        </GreenBox>
      </section>
  );
}

export default HomePage;