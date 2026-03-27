import { useState } from "react";
import { Link } from "react-router-dom";
import imgAnt from "../assets/Ant.svg";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaCcVisa, FaCcMastercard, FaCcPaypal } from "react-icons/fa";
import { HiLocationMarker, HiPhone, HiMail, HiClock } from "react-icons/hi";

export default function Footer() {

  const [email, setEmail] = useState("");

  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: "Facebook",  icon: <FaFacebookF />,  link: "#", classes: "bg-blue-600 hover:bg-blue-700" },
    { name: "Instagram", icon: <FaInstagram />,  link: "#", classes: "bg-pink-600 hover:bg-pink-700" },
    { name: "Twitter",   icon: <FaTwitter />,    link: "#", classes: "bg-sky-500 hover:bg-sky-600" },
    { name: "YouTube",   icon: <FaYoutube />,    link: "#", classes: "bg-red-600 hover:bg-red-700" },
  ];

  const categories = [
    { name: "Teclados", link: "/categoria/teclados" },
    { name: "Ratones", link: "/categoria/ratones" },
    { name: "Monitores", link: "/categoria/pantallas" },
    { name: "Sillas Gamer", link: "/categoria/sillas" }
  ];

  const infoLinks = [
    { name: "Sobre Nosotros", link: "/about" },
    { name: "Garantías", link: "/garantias" },
    { name: "Envíos", link: "/envios" },
    { name: "Política de Privacidad", link: "/privacidad" }
  ];

  const paymentMethods = [
    { name: "Visa",       icon: <FaCcVisa /> },
    { name: "Mastercard", icon: <FaCcMastercard /> },
    { name: "PayPal",     icon: <FaCcPaypal /> },
  ];

  const subscribeNewsletter = (e) => {
    e.preventDefault();
    console.log("Email suscrito:", email);
    setEmail("");
  };

  return (
    <footer className="bg-linear-to-r from-gray-900 to-gray-800 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4">

        {/* LOGO Y DESCRIPCIÓN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center">
                <img src={imgAnt} alt="BugSolutions Logo" className="w-8 h-8" />
              </div>
              <span className="text-2xl font-bold text-white">BugSolutions</span>
            </div>
            <p className="text-gray-300 mb-6">
              Tu tienda especializada en componentes de computadoras y periféricos gaming.
              Ofrecemos los mejores productos con garantía y soporte técnico.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  target="_blank"
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors ${social.classes}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* LINKS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">

          {/* CATEGORÍAS */}
          <div>
            <h4 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2">Categorías</h4>
            <ul className="space-y-2">
              {categories.map((category, index) => (
                <li key={index}>
                  <Link to={category.link} className="text-gray-300 hover:text-blue-400 transition-colors">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* INFORMACIÓN */}
          <div>
            <h4 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2">Información</h4>
            <ul className="space-y-2">
              {infoLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.link} className="text-gray-300 hover:text-blue-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACTO */}
          <div>
            <h4 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2">Contacto</h4>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-3"><HiLocationMarker className="text-blue-400 shrink-0" /> Calle Principal #123</li>
              <li className="flex items-center gap-3"><HiPhone className="text-blue-400 shrink-0" /> +57 300 123 4567</li>
              <li className="flex items-center gap-3"><HiMail className="text-blue-400 shrink-0" /> info@bugsolutions.com</li>
              <li className="flex items-center gap-3"><HiClock className="text-blue-400 shrink-0" /> Lun - Vie: 9:00 AM - 6:00 PM</li>
            </ul>
          </div>

          {/* PAGOS */}
          <div>
            <h4 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2">Métodos de Pago</h4>
            <div className="grid grid-cols-3 gap-4">
              {paymentMethods.map((method, index) => (
                <div key={index} className="flex flex-col items-center">
                  <span className="text-3xl text-gray-300 mb-2">{method.icon}</span>
                  <span className="text-xs text-gray-400">{method.name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* COPYRIGHT */}
        <div className="pt-6 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} BugSolutions. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-gray-400 hover:text-blue-400 text-sm">Mapa del Sitio</a>
            <a href="#" className="text-gray-400 hover:text-blue-400 text-sm">Cookies</a>
            <a href="#" className="text-gray-400 hover:text-blue-400 text-sm">Accesibilidad</a>
          </div>
        </div>

      </div>

      {/* Borde RGB */}
      <div className="h-1 w-full bg-linear-to-r from-purple-600 via-blue-500 to-green-400"></div>

    </footer>
  );
}