import React, { useState, useEffect } from 'react'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2'

const slides = [
  {
    title: 'Nueva Temporada',
    subtitle: 'Descubre los mejores productos para tu hogar y oficina',
    cta: 'Ver Tienda',
    bg: 'from-indigo-600 to-violet-700',
    badge: 'Nuevo',
  },
  {
    title: 'Ofertas Exclusivas',
    subtitle: 'Hasta 50% de descuento en marcas seleccionadas',
    cta: 'Ver Ofertas',
    bg: 'from-rose-500 to-orange-500',
    badge: 'Oferta',
  },
  {
    title: 'Top Marcas',
    subtitle: 'Las mejores marcas del mercado en un solo lugar',
    cta: 'Ver Marcas',
    bg: 'from-emerald-500 to-teal-600',
    badge: 'Destacado',
  },
]

export default function Carrusel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setCurrent(p => (p + 1) % slides.length), 5000)
    return () => clearInterval(timer)
  }, [])

  const prev = () => setCurrent(p => (p - 1 + slides.length) % slides.length)
  const next = () => setCurrent(p => (p + 1) % slides.length)

  return (
    <div className='relative w-full overflow-hidden'>
      {/* Slides */}
      <div
        className='flex transition-transform duration-700 ease-in-out'
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`min-w-full bg-linear-to-br ${slide.bg} flex items-center justify-center`}
            style={{ height: '480px' }}
          >
            <div className='text-center text-white px-6 max-w-2xl'>
              <span className='inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-widest uppercase'>
                {slide.badge}
              </span>
              <h1 className='text-5xl font-extrabold mb-4 drop-shadow-lg'>{slide.title}</h1>
              <p className='text-lg text-white/80 mb-8'>{slide.subtitle}</p>
              <button className='bg-white text-gray-900 font-semibold px-8 py-3 rounded-full shadow-lg hover:scale-105 transition-transform'>
                {slide.cta}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className='absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-2 rounded-full transition'
      >
        <HiChevronLeft className='text-2xl' />
      </button>
      <button
        onClick={next}
        className='absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-2 rounded-full transition'
      >
        <HiChevronRight className='text-2xl' />
      </button>

      {/* Dots */}
      <div className='absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2'>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === current ? 'bg-white scale-125' : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
