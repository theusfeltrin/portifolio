import './App.css';
import { colors } from './theme';
import {
  HeroSection,
  AboutSection,
  PortfolioSection,
  ContactSection,
  Footer,
  Navigation,
} from './components';

function App() {
  return (
    <div
      className="min-h-screen font-sans"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      <Navigation />
      <HeroSection />
      <AboutSection />
      <PortfolioSection />
      <ContactSection />
      <Footer />
    </div>
  );
}

export default App;
