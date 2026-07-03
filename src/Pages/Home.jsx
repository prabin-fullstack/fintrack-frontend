import React from 'react'
import Hero from '../Components/Hero'
import About from '../Components/About'
import HowItWorks from '../Components/HowItWorks'
import Features from '../Components/Features'
import Testimonials from '../Components/Testimonials'
import FinalCTA from '../Components/FinalCTA'
import Footer from '../Components/Footer'

function Home() {
  return (
    <div>
      <div id="hero"><Hero/></div>
      <div id="how-it-works"><HowItWorks/></div>
      <div id="features"><Features/></div>
      <div id="testimonials"><Testimonials/></div>
      <div id="final-cta"><FinalCTA/></div>
      <div id="about"><About/></div>
      <Footer/>
    </div>
  )
}

export default Home