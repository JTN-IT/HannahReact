import GreenBox from '../components/GreenBox.jsx';
import portrait from '../assets/images/portrait.jpg'; // Adjust path to match your file

function HomePage() {
  return (
    <section className="home">
        <GreenBox to="/about" className="homebox">
            <img className="photo" src={portrait} />
        </GreenBox>
    </section>
  );
}

export default HomePage;
