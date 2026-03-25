import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { SvgAstronaut } from 'iblis-react-undraw';
import './Home.css';

const Home = () => {
  return (
    <div className="home-universe">
      <Navbar />

      <main className="content-dense-grid">
        {/* Animated Background Layers */}
        <div className="aurora-bg">
          <div className="aurora-1"></div>
          <div className="aurora-2"></div>
          <div className="aurora-3"></div>
        </div>

        {/* Hero Section embedded in grid */}
        <motion.section 
          className="hero-dense"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="hero-content-wrapper">
            <motion.div 
              className="tech-badge"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="ping-dot"></div>
              Live AI Prediction Engine
            </motion.div>
            
            <h1 className="hero-title-epic">
              <span className="static-text">Discover your </span>
              <TypeAnimation
                sequence={[
                  'Dream Career', 1500,
                  'True Potential', 1500,
                  'Perfect Job', 1500
                ]}
                wrapper="span"
                speed={50}
                className="typed-gradient"
                repeat={Infinity}
              />
            </h1>
            
            <p className="hero-subtitle-dense">
              Stop guessing. Our ensemble of ML models translates your skills, education, and experience into a statistically backed career roadmap instantly.
            </p>

            <div className="hero-actions-dense">
              <Link to="/signup" className="btn-epic-glow">
                Initialize Engine
                <span className="material-symbols-outlined">rocket_launch</span>
              </Link>
            </div>
          </div>
          
          <div className="hero-illustration">
            <SvgAstronaut width="100%" height="auto" primaryColor="#00f5ff" />
          </div>
        </motion.section>

        {/* Dense Bento Grid */}
        <section className="bento-universe">
          <motion.div 
            className="bento-cell cell-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, rotateY: 2, rotateX: 2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="cell-inner">
              <span className="material-symbols-outlined icon-epic">memory</span>
              <h3>Multiple MLA Agents</h3>
              <p>Random Forest, Logistics & Trees compute in parallel to ensure extreme predictive accuracy based on real datasets.</p>
            </div>
            <div className="bento-glow bg-blue"></div>
          </motion.div>

          <motion.div 
            className="bento-cell cell-2"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="cell-inner">
               <div className="mock-ui-card">
                  <div className="mock-line" style={{width: '90%'}}></div>
                  <div className="mock-line" style={{width: '70%', animationDelay: '0.2s'}}></div>
                  <div className="mock-line" style={{width: '40%', animationDelay: '0.4s'}}></div>
               </div>
               <h3>Skill Gap Analytics</h3>
               <p>Real-time visual node mapping from your current skills to target requirements. Know exactly what to learn next.</p>
            </div>
            <div className="bento-glow bg-purple"></div>
          </motion.div>

          <motion.div 
            className="bento-cell cell-3"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, rotateY: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="cell-inner">
              <span className="material-symbols-outlined icon-epic">visibility</span>
              <h3>Explainable AI</h3>
              <p>100% transparent reasoning for every prediction so you always understand the 'why' behind the path.</p>
            </div>
            <div className="bento-glow bg-emerald"></div>
          </motion.div>

          <motion.div 
            className="bento-cell cell-4"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
             <div className="cell-inner cta-inner">
                <h2>Join the thousands navigating their path.</h2>
                <Link to="/signup" className="btn-epic-outline">Create Free Account</Link>
             </div>
             <div className="bento-glow bg-orange"></div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
export default Home;