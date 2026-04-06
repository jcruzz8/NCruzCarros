import React from 'react';
import Hero from '../components/Hero';
import Inventory from '../components/Inventory';
import ImportProcess from '../components/ImportProcess';
import ContactSection from '../components/ContactSection';

const Home = () => {
  return (
    <>
      <Hero />
      <Inventory />
      <ImportProcess />
      <ContactSection />
    </>
  );
};

export default Home;