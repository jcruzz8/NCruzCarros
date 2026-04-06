import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import Inventory from '../components/Inventory';
import ImportProcess from '../components/ImportProcess';
import ContactSection from '../components/ContactSection';

const Home = () => {

  useEffect(() => {
    document.title = "NCRUZ Carros | Stand Automóvel";
    window.scrollTo(0, 0);
  }, []);

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