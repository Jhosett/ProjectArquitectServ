import React from 'react'
import Header from '../components/Header'
import Carrusel from '../components/Carrusel'
import PromoBanners from '../components/PromoBanner'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div>
      <Header/>
      <Carrusel/>
      <PromoBanners/>
      <Footer/>
    </div>

  )
}
