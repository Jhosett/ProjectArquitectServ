import { Link } from "react-router-dom";
import imgGabinetes from '../assets/banners/gabinetes.png';
import imgPerifericos from '../assets/banners/perifericos-combo2.png';
import imgStreaming from '../assets/banners/streaming.webp';
import imgCombos from '../assets/banners/combos.webp';
import imgFuentes from '../assets/banners/fuentes2.png';
import imgTeclados from '../assets/banners/teclados.png';
import imgRatones from '../assets/banners/ratones.png';
import imgDiademas from '../assets/banners/diademas.webp';
import imgParlantes from '../assets/banners/parlantes.webp';
import imgPantallas from '../assets/banners/pantallas.avif';
import imgSillas from '../assets/banners/sillas.webp';

export default function PromoBanners() {

  // BANNERS PRINCIPALES
  const mainBanners = [
    {
      id: 1,
      title: "Todo lo relacionado con gabinetes y cajas para tu set",
      description:
        "Encuentra gabinetes con iluminación RGB, paneles de vidrio templado y excelente flujo de aire para mantener tus componentes frescos.",
      bgColor: "bg-gradient-to-r from-[#1a2942] to-[#2d4a77]",
      textColor: "text-white",
      image: imgGabinetes,
      link: "/categoria/gabinetes",
      badge: "Destacado",
    },
    {
      id: 2,
      title: "COMBOS PERIFERICOS",
      subtitle: "Encuentra los mejores complementos para tu computadora.",
      description:
        "Ahorra con nuestros combos de teclado, mouse y auriculares gaming. Diseñados para darte la mejor experiencia de juego.",
      bgColor: "bg-gradient-to-r from-[#4a4a4a] to-[#636363]",
      textColor: "text-white",
      image: imgPerifericos,
      link: "/categoria/combos-perifericos",
      badge: "Oferta",
    },
    {
      id: 3,
      title: "EQUIPOS PARA STREAMING",
      subtitle: "Todo lo que necesitas para comenzar a transmitir",
      description:
        "Micrófonos, cámaras, capturadoras, iluminación y accesorios para crear contenido de calidad profesional.",
      bgColor: "bg-gradient-to-r from-[#6441a5] to-[#9146ff]",
      textColor: "text-white",
      image: imgStreaming,
      link: "/categoria/streaming",
      badge: "Nuevo",
    },
  ];

  // BANNERS SECUNDARIOS
  const secondaryBanners = [
    {
      id: 1,
      title: "Promoción",
      subtitle: "COMBOS",
      description:
        "Arma tu PC con nuestros combos de componentes seleccionados por expertos. Compatibilidad garantizada.",
      bgColor: "bg-gradient-to-r from-[#7b2cbf] to-[#9d4edd]",
      textColor: "text-white",
      image: imgCombos,
      link: "/promociones/combos",
      badge: "Hasta 20% OFF",
    },
    {
      id: 2,
      title: "FUENTES",
      description:
        "Fuentes de poder certificadas con iluminación RGB y alta eficiencia energética para tu equipo.",
      bgColor: "bg-gradient-to-r from-[#38b2ac] to-[#4fd1c5]",
      textColor: "text-white",
      image: imgFuentes,
      link: "/categoria/fuentes",
      badge: "Certificadas",
    },
  ];

  // BANNERS DE CATEGORÍAS
  const categoryBanners = [
    {
      id: 1,
      title: "TECLADOS",
      description:
        "Teclados mecánicos, ópticos y de membrana con retroiluminación RGB y switches personalizables.",
      bgColor: "bg-gradient-to-r from-[#e53e3e] to-[#f56565]",
      textColor: "text-white",
      image: imgTeclados,
      link: "/categoria/teclados",
      badge: "Gaming",
    },
    {
      id: 2,
      title: "RATONES",
      description:
        "Precisión, ergonomía y velocidad. Ratones gaming con sensores ópticos avanzados.",
      bgColor: "bg-gradient-to-r from-[#38a169] to-[#48bb78]",
      textColor: "text-white",
      image: imgRatones,
      link: "/categoria/ratones",
      badge: "Precisión",
    },
    {
      id: 3,
      title: "DIADEMAS GAMER",
      description:
        "Sonido envolvente, micrófono con cancelación de ruido y comodidad para largas sesiones de juego.",
      bgColor: "bg-gradient-to-r from-[#ed8936] to-[#f6ad55]",
      textColor: "text-white",
      image: imgDiademas,
      link: "/categoria/diademas",
      badge: "7.1 Surround",
    },
    {
      id: 4,
      title: "PARLANTES",
      description:
        "Altavoces con potencia y claridad para disfrutar de tus juegos, música y películas.",
      bgColor: "bg-gradient-to-r from-[#2c7a7b] to-[#4fd1c5]",
      textColor: "text-white",
      image: imgParlantes,
      link: "/categoria/parlantes",
      badge: "RGB",
    },
    {
      id: 5,
      title: "PANTALLAS",
      description:
        "Monitores gaming con alta tasa de refresco, baja latencia y tecnología anti-parpadeo.",
      bgColor: "bg-gradient-to-r from-[#ecc94b] to-[#f6e05e]",
      textColor: "text-gray-800",
      image: imgPantallas,
      link: "/categoria/pantallas",
      badge: "144Hz+",
    },
    {
      id: 6,
      title: "SILLAS GAMER",
      description:
        "Comodidad y soporte ergonómico para largas sesiones de juego o trabajo.",
      bgColor: "bg-gradient-to-r from-[#3182ce] to-[#63b3ed]",
      textColor: "text-white",
      image: imgSillas,
      link: "/categoria/sillas",
      badge: "Ergonómicas",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">

      {/* BANNERS PRINCIPALES */}
      {mainBanners.map((banner) => (
        <div
          key={banner.id}
          className={`${banner.bgColor} rounded-2xl overflow-hidden mb-6 shadow-lg relative group transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl`}
        >
          {banner.badge && (
            <div className="absolute top-4 right-4 bg-white text-gray-800 font-bold py-1 px-3 rounded-full text-sm shadow-md z-10">
              {banner.badge}
            </div>
          )}

          <div className="flex flex-col md:flex-row items-center justify-between p-6">

            <div className="md:w-1/2 mb-4 md:mb-0">

              <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${banner.textColor}`}>
                {banner.title}
              </h2>

              {banner.subtitle && (
                <p className={`text-lg font-semibold mb-2 ${banner.textColor}`}>
                  {banner.subtitle}
                </p>
              )}

              <p className={`mb-4 opacity-90 ${banner.textColor}`}>
                {banner.description}
              </p>

              <Link
                to={banner.link}
                className="inline-block bg-white text-gray-800 font-bold py-2 px-6 rounded-full hover:bg-gray-100 transition-colors shadow-md"
              >
                COMPRAR
              </Link>

            </div>

            <div className="md:w-1/2 flex justify-end">
              <img
                src={banner.image}
                alt={banner.title}
                className="h-48 md:h-56 object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>

          </div>
        </div>
      ))}

      {/* BANNERS SECUNDARIOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

        {secondaryBanners.map((banner) => (
          <div
            key={banner.id}
            className={`${banner.bgColor} rounded-2xl overflow-hidden shadow-lg relative group transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl`}
          >

            {banner.badge && (
              <div className="absolute top-4 right-4 bg-white text-gray-800 font-bold py-1 px-3 rounded-full text-sm shadow-md z-10">
                {banner.badge}
              </div>
            )}

            <div className="flex flex-col md:flex-row items-center justify-between p-6">

              <div className="md:w-1/2 mb-4 md:mb-0">

                {banner.subtitle ? (
                  <>
                    <h3 className={`text-xl font-bold ${banner.textColor}`}>
                      {banner.title}
                    </h3>

                    <h2 className={`text-3xl font-bold mb-2 ${banner.textColor}`}>
                      {banner.subtitle}
                    </h2>
                  </>
                ) : (
                  <h2 className={`text-3xl font-bold mb-2 ${banner.textColor}`}>
                    {banner.title}
                  </h2>
                )}

                <p className={`mb-4 opacity-90 ${banner.textColor}`}>
                  {banner.description}
                </p>

                <Link
                  to={banner.link}
                  className="inline-block bg-white text-gray-800 font-bold py-2 px-6 rounded-full hover:bg-gray-100 transition-colors shadow-md"
                >
                  COMPRAR
                </Link>

              </div>

              <div className="md:w-1/2 flex justify-end">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="h-36 object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>

            </div>
          </div>
        ))}

      </div>

      {/* CATEGORÍAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {categoryBanners.map((banner) => (
          <div
            key={banner.id}
            className={`${banner.bgColor} rounded-2xl overflow-hidden shadow-lg relative group transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl`}
          >

            {banner.badge && (
              <div className="absolute top-4 right-4 bg-white text-gray-800 font-bold py-1 px-3 rounded-full text-sm shadow-md z-10">
                {banner.badge}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between p-6">

              <div className="sm:w-1/2 mb-4 sm:mb-0">

                <h2 className={`text-2xl font-bold mb-2 ${banner.textColor}`}>
                  {banner.title}
                </h2>

                <p className={`mb-4 text-sm opacity-90 ${banner.textColor}`}>
                  {banner.description}
                </p>

                <Link
                  to={banner.link}
                  className="inline-block bg-white text-gray-800 font-bold py-2 px-6 rounded-full hover:bg-gray-100 transition-colors shadow-md"
                >
                  COMPRAR
                </Link>

              </div>

              <div className="sm:w-1/2 flex justify-end">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="h-32 object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>

            </div>
          </div>
        ))}

      </div>

    </section>
  );
}