import React, { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import GreenBox from '../components/GreenBox.jsx';
import portrait from '../assets/images/portrait.jpg';
import './AboutPage.css';


function AboutPage() {
  const { setTopbox } = useOutletContext();

  useEffect(() => {
    setTopbox(<></>);
  }, [setTopbox]);

  return (
    <section className="about">
      <GreenBox className="aboutcard portrait">
          <img className="photo" src={portrait} alt="Portrait of Hannah Myers" />
      </GreenBox>
      <GreenBox className="aboutcard bio">
        <h2>Who is Hannah?</h2>
        <p>
          Hannah graduated from studying Performance Costume BA (Hons) at Edinburgh College 
          of Art. She prefers not to settle on one form of creativity but instead enjoys 
          bringing many elements into her work including: expressive mark-making, performance, 
          sculpture, textiles, puppetry, stop motion animation, film, poetry, comedy and more…
          <br />
          She is an artist with a strong desire to make the world a more connected place 
          through creating ecologically conscious art that encourages a stronger bond between 
          people and nature; reuniting people with their natural habitat in hopes to inspire 
          respect for what we have and to realise our role in the earth's ecosystem.
          <br />
          Hannah has facilitated creative activities for children and adults whilst working for 
          SEALL. These activities focus on fun, exploration and nurturing our own unique 
          creative expression. She loves to bring people together to create meaningful 
          connections.
        </p>
        <a href="/cv.pdf" target="_blank" rel="noopener noreferrer">View my CV</a>
      </GreenBox>
      </section>
  );
}

export default AboutPage;