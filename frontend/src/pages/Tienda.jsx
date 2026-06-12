import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getProducts, createInvoice, getInvoices } from '../services/productService';
import { useAuth } from '../context/AuthContext';

import Swal from 'sweetalert2';
import {
  HiSearch,
  HiShoppingCart,
  HiTrash,
  HiPlus,
  HiMinus,
  HiReceiptTax,
  HiOutlineEmojiSad,
  HiCheckCircle,
  HiChevronDown,
  HiChevronUp,
  HiTicket,
  HiUser,
  HiPhone,
  HiMail,
  HiIdentification,
  HiHeart,
  HiOutlineHeart
} from 'react-icons/hi';
import { MdHistory } from 'react-icons/md';
import { addToWishlist, removeFromWishlist } from '../services/wishlistService';

export default function Tienda() {
  const { currentUser, userData } = useAuth();

  // State for products and invoices
  const [products, setProducts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingInvoices, setLoadingInvoices] = useState(true);

  // Shopping Cart state
  const [cart, setCart] = useState(() => {
    const localCart = localStorage.getItem('bugsolutions_cart');
    return localCart ? JSON.parse(localCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [expandedInvoiceId, setExpandedInvoiceId] = useState(null);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [showOnlyWishlist, setShowOnlyWishlist] = useState(false);

  // Client simulated form for invoice (prefilled with user data if logged in)
  const [clientForm, setClientForm] = useState({
    nombre: '',
    tipoDocumento: 'CC',
    numeroDocumento: '',
    telefono: '',
    email: ''
  });

  // Load products and invoices
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoadingProducts(true);
        const prods = await getProducts();
        setProducts(prods);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoadingProducts(false);
      }

      try {
        setLoadingInvoices(true);
        const invs = await getInvoices();
        setInvoices(invs);
      } catch (err) {
        console.error('Error fetching invoices:', err);
      } finally {
        setLoadingInvoices(false);
      }
    };

    fetchAllData();
  }, []);

  // Update client form when userData is loaded
  useEffect(() => {
    if (userData || currentUser) {
      setClientForm({
        nombre: userData?.nombre || currentUser?.displayName || '',
        tipoDocumento: userData?.tipoDocumento || 'CC',
        numeroDocumento: userData?.numeroDocumento || '',
        telefono: userData?.telefono || '',
        email: userData?.email || currentUser?.email || ''
      });
    }
  }, [userData, currentUser]);

  // Save cart to local storage
  useEffect(() => {
    localStorage.setItem('bugsolutions_cart', JSON.stringify(cart));
  }, [cart]);

  // Refresh invoices list
  const refreshInvoices = async () => {
    try {
      setLoadingInvoices(true);
      const invs = await getInvoices();
      setInvoices(invs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInvoices(false);
    }
  };

  // Add to cart
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          Swal.fire({
            icon: 'warning',
            title: 'Stock Límite',
            text: `No hay más stock disponible para ${product.nombre}.`,
            confirmButtonColor: '#4f46e5'
          });
          return prevCart;
        }
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });

    // Toast notification
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });
    Toast.fire({
      icon: 'success',
      title: `${product.nombre} añadido al carrito`
    });
  };

  const handleToggleWishlist = async (productId) => {
    if (!currentUser) {
      Swal.fire({
        icon: 'info',
        title: 'Inicia Sesión',
        text: 'Debes estar autenticado para guardar productos en tu lista de deseos.',
        confirmButtonColor: '#4f46e5'
      });
      return;
    }

    // Comprobamos si el ID ya existe en el array 'wishlist' de las credenciales del usuario
    const isFavorite = userData?.wishlist?.includes(productId);

    try {
      if (isFavorite) {
        await removeFromWishlist(currentUser.uid, productId);
        const Toast = Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 1500 });
        Toast.fire({ icon: 'success', title: 'Eliminado de la lista de deseos' });
      } else {
        await addToWishlist(currentUser.uid, productId);
        const Toast = Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 1500 });
        Toast.fire({ icon: 'success', title: 'Añadido a tu lista de deseos' });
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar la lista de deseos.' });
    }
  };

  // Remove one item/quantity
  const decreaseQuantity = (productId) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === productId);
      if (existingItem.quantity === 1) {
        return prevCart.filter((item) => item.id !== productId);
      }
      return prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  // Increase quantity
  const increaseQuantity = (productId, stock) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === productId);
      if (existingItem.quantity >= stock) {
        Swal.fire({
          icon: 'warning',
          title: 'Stock Límite',
          text: 'No hay más unidades en stock.',
          confirmButtonColor: '#4f46e5'
        });
        return prevCart;
      }
      return prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      );
    });
  };

  // Remove completely from cart
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
  };

  // Cart Calculations
  const subtotal = cart.reduce((acc, item) => acc + (item.precio * item.quantity), 0);
  const iva = Math.round(subtotal * 0.19);
  const total = subtotal + iva;

  // Handle client form input
  const handleClientInputChange = (e) => {
    const { name, value } = e.target;
    setClientForm(prev => ({ ...prev, [name]: value }));
  };

  // Generate simulated invoice
  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Carrito Vacío',
        text: 'Agrega productos al carrito antes de generar la factura.',
        confirmButtonColor: '#4f46e5'
      });
      return;
    }

    if (!clientForm.nombre.trim() || !clientForm.email.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Datos Faltantes',
        text: 'Por favor ingresa al menos Nombre y Correo.',
        confirmButtonColor: '#4f46e5'
      });
      return;
    }

    // Prepare Invoice Data
    const invoiceNumber = `FAC-${Math.floor(100000 + Math.random() * 900000)}`;
    const invoiceData = {
      numeroFactura: invoiceNumber,
      cliente: {
        nombre: clientForm.nombre,
        tipoDocumento: clientForm.tipoDocumento,
        numeroDocumento: clientForm.numeroDocumento || 'S.D.',
        telefono: clientForm.telefono || 'S.D.',
        email: clientForm.email
      },
      items: cart.map(item => ({
        id: item.id,
        nombre: item.nombre,
        precioUnitario: item.precio,
        cantidad: item.quantity,
        subtotal: item.precio * item.quantity
      })),
      subtotal,
      iva,
      total,
      creadoPor: currentUser ? currentUser.uid : 'invitado'
    };

    try {
      Swal.fire({
        title: 'Generando factura...',
        text: 'Guardando datos en Firestore',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const newInvoice = await createInvoice(invoiceData);

      // Clear Cart
      setCart([]);
      refreshInvoices();

      // Show beautiful receipt modal
      Swal.fire({
        icon: 'success',
        title: '¡Factura Creada Exitosamente!',
        html: `
          <div class="text-left bg-gray-50 p-4 rounded-lg border border-gray-200 mt-3 text-sm font-sans max-h-96 overflow-y-auto">
            <div class="flex justify-between border-b pb-2 mb-2">
              <span class="font-bold text-gray-800">${invoiceNumber}</span>
              <span class="text-gray-500">${new Date().toLocaleDateString('es-CO')}</span>
            </div>
            
            <div class="mb-4">
              <p class="font-semibold text-gray-700 text-xs uppercase tracking-wide mb-1">Cliente</p>
              <p class="font-medium text-gray-800">${clientForm.nombre}</p>
              <p class="text-gray-500 text-xs">${clientForm.tipoDocumento} ${clientForm.numeroDocumento || 'S.D.'}</p>
              <p class="text-gray-500 text-xs">Email: ${clientForm.email}</p>
            </div>

            <div class="border-b pb-2 mb-2">
              <p class="font-semibold text-gray-700 text-xs uppercase tracking-wide mb-1">Productos</p>
              ${invoiceData.items.map(item => `
                <div class="flex justify-between my-1 text-xs text-gray-600">
                  <span>${item.nombre} (x${item.cantidad})</span>
                  <span>$ ${item.subtotal.toLocaleString('es-CO')}</span>
                </div>
              `).join('')}
            </div>

            <div class="space-y-1 text-right text-xs">
              <div class="flex justify-between font-medium text-gray-500">
                <span>Subtotal:</span>
                <span>$ ${subtotal.toLocaleString('es-CO')}</span>
              </div>
              <div class="flex justify-between font-medium text-gray-500">
                <span>IVA (19%):</span>
                <span>$ ${iva.toLocaleString('es-CO')}</span>
              </div>
              <div class="flex justify-between text-base font-bold text-indigo-700 pt-1 border-t">
                <span>Total:</span>
                <span>$ ${total.toLocaleString('es-CO')}</span>
              </div>
            </div>
            
            <div class="mt-4 text-center text-xs text-gray-400">
              <p>Factura guardada en Firestore</p>
              <p class="text-[10px] break-all font-mono">${newInvoice.id}</p>
            </div>
          </div>
        `,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4f46e5'
      });
      setIsCartOpen(false);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al guardar la factura en Firestore.',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  // Categories list
  const categories = [
    { value: 'todos', label: 'Todos los productos' },
    { value: 'ratones', label: 'Ratones' },
    { value: 'teclados', label: 'Teclados' },
    { value: 'diademas', label: 'Diademas' },
    { value: 'gabinetes', label: 'Gabinetes' },
    { value: 'fuentes', label: 'Fuentes de Poder' },
    { value: 'pantallas', label: 'Monitores' },
    { value: 'sillas', label: 'Sillas Gamer' },
    { value: 'streaming', label: 'Streaming' },
    { value: 'parlantes', label: 'Parlantes' },
  ];

  // Filtering products
  const filteredProducts = products.filter((prod) => {
    const matchesSearch = prod.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'todos' || prod.categoria === selectedCategory;
    const matchesWishlist = !showOnlyWishlist || (userData?.wishlist?.includes(prod.id));
    return matchesSearch && matchesCategory && matchesWishlist;
  });

  const toggleInvoiceExpand = (id) => {
    setExpandedInvoiceId(prev => prev === id ? null : id);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Banner de Bienvenida */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 text-white rounded-3xl p-8 mb-6 shadow-xl relative overflow-hidden flex justify-between items-center">
          <div className="z-10">
            <h1 className="text-3xl md:text-4xl font-extrabold mt-3 tracking-tight">
              BugSolutions
            </h1>
            <p className="text-indigo-100 text-sm mt-2 max-w-2xl">
              Explora periféricos gamer, añádelos al carrito y simula una compra generando facturas reales almacenadas en Firestore.
            </p>
          </div>

          {/* Decoración abstracta */}
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-indigo-500 rounded-full opacity-20 filter blur-3xl pointer-events-none -mr-16 -mb-16"></div>
        </div>

        {/* Sticky Header Bar for Shop Controls */}
        <div className="sticky top-[72px] z-30 bg-white/95 backdrop-blur-md shadow-md border border-gray-100 py-3.5 px-6 mb-8 rounded-2xl flex flex-wrap md:flex-nowrap justify-between items-center gap-4 transition-all duration-200">
          {!showHistory ? (
            <>
              {/* Buscador */}
              <div className="relative w-full md:w-64">
                <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar ratón, teclado, marca..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Categorías horizontal scroller */}
              <div className="w-full md:w-auto flex-grow overflow-x-auto scrollbar-none py-1">
                <div className="flex gap-2 min-w-max">
                  <button
                    onClick={() => {
                      setShowOnlyWishlist(!showOnlyWishlist);
                      setSelectedCategory('todos');
                    }}
                    className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${showOnlyWishlist
                      ? 'bg-red-500 text-white shadow-md shadow-red-100'
                      : 'bg-red-50 text-red-600 hover:bg-red-100'
                      }`}
                  >
                    <HiHeart className="text-sm" />
                    <span>Mis Favoritos ({userData?.wishlist?.length || 0})</span>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      disabled={showOnlyWishlist}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${selectedCategory === cat.value
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm sm:text-base">
              <MdHistory className="text-xl" />
              <span>Facturas Guardadas</span>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-2 shrink-0 w-full md:w-auto justify-end">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 px-4 py-2 rounded-xl font-bold flex items-center justify-center gap-2 text-xs transition-all shadow-sm"
            >
              {showHistory ? (
                <>
                  <HiShoppingCart className="text-base" />
                  <span>Ver Catálogo</span>
                </>
              ) : (
                <>
                  <MdHistory className="text-base" />
                  <span>Ver Facturas ({invoices.length})</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-xl font-bold flex items-center justify-center gap-2 text-xs relative transition-all shadow-md active:scale-[0.98]"
            >
              <HiShoppingCart className="text-base" />
              <span>Carrito</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white animate-pulse">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {showHistory ? (
          /* ========================================================
             HISTORIAL DE FACTURAS EN FIRESTORE
             ======================================================== */
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <MdHistory className="text-indigo-600 text-2xl" /> Historial de Facturas
                </h2>
                <p className="text-xs text-gray-400 mt-1">Registradas de forma simulada en Firestore</p>
              </div>
              <button
                onClick={refreshInvoices}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                Actualizar Lista
              </button>
            </div>

            {loadingInvoices ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 text-sm font-medium">Cargando facturas de Firestore...</p>
              </div>
            ) : invoices.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <HiOutlineEmojiSad className="text-5xl text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">No se han generado facturas en Firestore aún.</p>
                <p className="text-xs text-gray-400 mt-1">Simula una compra en la sección de tienda.</p>
                <button
                  onClick={() => setShowHistory(false)}
                  className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Ir a la Tienda
                </button>
              </div>
            ) : (
              <div className="space-y-4 max-w-4xl mx-auto">
                {invoices.map((inv) => {
                  const isExpanded = expandedInvoiceId === inv.id;
                  return (
                    <div
                      key={inv.id}
                      className="border border-gray-100 rounded-2xl bg-gray-50 overflow-hidden transition-all duration-200"
                    >
                      <div
                        onClick={() => toggleInvoiceExpand(inv.id)}
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-white cursor-pointer hover:bg-gray-50 transition-colors gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-xl">
                            <HiTicket className="text-xl" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-800 text-sm">{inv.numeroFactura}</span>
                              <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-mono">
                                {inv.id.substring(0, 8)}...
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {inv.cliente?.nombre} | {new Date(inv.fecha).toLocaleString('es-CO')}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 self-end sm:self-auto">
                          <div className="text-right">
                            <span className="text-sm font-bold text-indigo-600 block">
                              $ {inv.total?.toLocaleString('es-CO')}
                            </span>
                            <span className="text-[10px] text-gray-400 block">
                              {inv.items?.length} artículo(s)
                            </span>
                          </div>
                          {isExpanded ? <HiChevronUp className="text-gray-400" /> : <HiChevronDown className="text-gray-400" />}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="p-5 border-t border-gray-100 bg-gray-50 text-xs sm:text-sm text-gray-700 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wide mb-2">
                                Datos del Cliente
                              </h4>
                              <p className="font-medium text-gray-900">{inv.cliente?.nombre}</p>
                              <p className="text-gray-500 text-xs">Documento: {inv.cliente?.tipoDocumento} {inv.cliente?.numeroDocumento}</p>
                              <p className="text-gray-500 text-xs">Teléfono: {inv.cliente?.telefono}</p>
                              <p className="text-gray-500 text-xs">Email: {inv.cliente?.email}</p>
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wide mb-2">
                                Detalle Técnico Firestore
                              </h4>
                              <p className="text-gray-500 text-xs font-mono">ID Documento: {inv.id}</p>
                              <p className="text-gray-500 text-xs">Generado por UID: {inv.creadoPor}</p>
                              <p className="text-gray-500 text-xs">Fecha ISO: {inv.fecha}</p>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wide mb-2">
                              Productos Adquiridos
                            </h4>
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                              <table className="w-full text-left text-xs">
                                <thead className="bg-gray-50 text-gray-500">
                                  <tr>
                                    <th className="px-4 py-2">Producto</th>
                                    <th className="px-4 py-2 text-center">Cant.</th>
                                    <th className="px-4 py-2 text-right">Precio Unit.</th>
                                    <th className="px-4 py-2 text-right">Total</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                  {inv.items?.map((item, index) => (
                                    <tr key={index}>
                                      <td className="px-4 py-2 font-medium text-gray-800">{item.nombre}</td>
                                      <td className="px-4 py-2 text-center text-gray-500">{item.cantidad}</td>
                                      <td className="px-4 py-2 text-right text-gray-500">$ {item.precioUnitario?.toLocaleString('es-CO')}</td>
                                      <td className="px-4 py-2 text-right font-medium text-gray-800">$ {item.subtotal?.toLocaleString('es-CO')}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          <div className="flex flex-col items-end pt-2 border-t border-gray-200 space-y-1 text-xs">
                            <div className="flex gap-4">
                              <span className="text-gray-400">Subtotal:</span>
                              <span className="font-medium text-gray-700">$ {inv.subtotal?.toLocaleString('es-CO')}</span>
                            </div>
                            <div className="flex gap-4">
                              <span className="text-gray-400">IVA (19%):</span>
                              <span className="font-medium text-gray-700">$ {inv.iva?.toLocaleString('es-CO')}</span>
                            </div>
                            <div className="flex gap-4 text-sm font-bold text-indigo-600 pt-1">
                              <span>Total Facturado:</span>
                              <span>$ {inv.total?.toLocaleString('es-CO')}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* ========================================================
             SECCIÓN DE LA TIENDA Y CATÁLOGO
             ======================================================== */
          <div className="w-full">
            {/* Listado de Productos */}
            <section className="w-full">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {showOnlyWishlist ? 'Mis Productos Favoritos' : 'Catálogo de Productos'}
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Mostrando {filteredProducts.length} de {products.length} productos
                  </p>
                </div>
              </div>

              {loadingProducts ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm animate-pulse space-y-4">
                      <div className="w-full h-48 bg-gray-200 rounded-2xl"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-8 bg-gray-200 rounded w-full"></div>
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center">
                  <HiOutlineEmojiSad className="text-5xl text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium">No se encontraron productos coincidentes.</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {showOnlyWishlist
                      ? 'Aún no has guardado productos en tus favoritos o tu sesión expiró.'
                      : 'Prueba cambiando tu búsqueda o filtro.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                    >
                      {/* Imagen con badges superpuestos */}
                      <div className="relative overflow-hidden bg-gray-100 aspect-video md:aspect-square max-h-48">
                        <img
                          src={prod.imagenURL}
                          alt={prod.nombre}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={e => { e.target.src = ''; e.target.style.display = 'none'; }}
                        />

                        {/* BOTÓN DE WISHLIST INTERACTIVO */}
                        <button
                          onClick={() => handleToggleWishlist(prod.id)}
                          className="absolute top-3 right-3 z-10 bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-md text-red-500 hover:bg-white transition-all transform active:scale-95"
                        >
                          {userData?.wishlist?.includes(prod.id) ? (
                            <HiHeart className="text-xl text-red-500" />
                          ) : (
                            <HiOutlineHeart className="text-xl text-gray-500 hover:text-red-500" />
                          )}
                        </button>

                        {/* BADGE DESTACADO */}
                        {prod.destacado && (
                          <span className="absolute top-3 left-3 z-10 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                            ★ Destacado
                          </span>
                        )}

                        {/* BADGE CATEGORÍA */}
                        <span className="absolute bottom-3 right-3 z-10 bg-gray-900 bg-opacity-70 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize">
                          {prod.categoria}
                        </span>
                      </div>

                      {/* Info de Producto */}
                      <div className="p-5 flex-grow flex flex-col">
                        <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                          <span>{prod.marca}</span>
                          <span className="text-amber-500 font-medium">⭐ {prod.calificacion ?? '—'}</span>
                        </div>

                        <h3 className="font-bold text-gray-800 text-base group-hover:text-indigo-600 transition-colors line-clamp-1">
                          {prod.nombre}
                        </h3>

                        <p className="text-xs text-gray-500 mt-2 line-clamp-2 flex-grow">
                          {prod.descripcion}
                        </p>

                        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-gray-400 block">Precio (COP)</span>
                            <span className="text-lg font-extrabold text-indigo-600">
                              $ {prod.precio.toLocaleString('es-CO')}
                            </span>
                          </div>

                          <div className="text-right">
                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full block ${prod.stock > 10
                              ? 'bg-green-50 text-green-600'
                              : prod.stock > 0
                                ? 'bg-amber-50 text-amber-600'
                                : 'bg-red-50 text-red-600'
                              }`}>
                              {prod.stock > 0 ? `${prod.stock} disponibles` : 'Sin stock'}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => addToCart(prod)}
                          disabled={prod.stock === 0}
                          className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-colors duration-150 flex items-center justify-center gap-2"
                        >
                          <HiShoppingCart />
                          {prod.stock > 0 ? 'Añadir al Carrito' : 'Agotado'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      {/* ========================================================
         CARRITO DE COMPRAS - DRAWER LATERAL
         ======================================================== */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end font-sans">
          {/* Overlay de fondo */}
          <div
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity"
          ></div>

          {/* Panel del Carrito */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 transition-transform duration-300">
            {/* Header del Carrito */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2.5">
                <div className="bg-indigo-100 text-indigo-600 p-2 rounded-xl">
                  <HiShoppingCart className="text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-base">Tu Carrito</h3>
                  <p className="text-xs text-gray-400">
                    {cart.reduce((acc, item) => acc + item.quantity, 0)} producto(s) en total
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCartOpen(false)}
                className="text-gray-400 hover:text-gray-600 bg-white p-2 rounded-xl border border-gray-100 hover:shadow-sm transition-all text-xs font-semibold"
              >
                Cerrar
              </button>
            </div>

            {/* Cuerpo / Items del Carrito */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 space-y-2">
                  <HiShoppingCart className="text-6xl text-gray-200" />
                  <p className="font-medium text-gray-500">El carrito está vacío</p>
                  <p className="text-xs">¡Agrega algunos productos del catálogo!</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center pb-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Artículos agregados</span>
                    <button
                      onClick={clearCart}
                      className="text-xs text-red-500 hover:text-red-600 font-semibold flex items-center gap-1"
                    >
                      <HiTrash /> Vaciar carrito
                    </button>
                  </div>

                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.imagenURL || item.imagen}
                            alt={item.nombre}
                            className="w-12 h-12 rounded-xl object-cover border border-gray-200 bg-white"
                            onError={e => e.target.style.display = 'none'}
                          />
                          <div>
                            <h4 className="font-bold text-gray-800 text-xs sm:text-sm line-clamp-1">{item.nombre}</h4>
                            <p className="text-xs text-indigo-600 font-bold mt-0.5">
                              $ {item.precio.toLocaleString('es-CO')}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Controles de cantidad */}
                          <div className="flex items-center bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <button
                              onClick={() => decreaseQuantity(item.id)}
                              className="p-1.5 hover:bg-gray-50 text-gray-500 active:scale-95 transition-transform"
                            >
                              <HiMinus className="text-xs" />
                            </button>
                            <span className="px-2 text-xs font-bold text-gray-700 min-w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => increaseQuantity(item.id, item.stock)}
                              className="p-1.5 hover:bg-gray-50 text-gray-500 active:scale-95 transition-transform"
                            >
                              <HiPlus className="text-xs" />
                            </button>
                          </div>

                          {/* Eliminar item */}
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-600 p-1 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-all"
                          >
                            <HiTrash className="text-base" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Formulario Cliente (siempre visible si hay productos) */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide block mb-3">
                  Datos de Facturación
                </span>
                <form onSubmit={handleCheckout} className="space-y-3">
                  <div className="relative">
                    <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="nombre"
                      value={clientForm.nombre}
                      onChange={handleClientInputChange}
                      placeholder="Nombre del cliente"
                      required
                      className="w-full pl-9 pr-4 py-2 border border-gray-200 bg-white rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <select
                      name="tipoDocumento"
                      value={clientForm.tipoDocumento}
                      onChange={handleClientInputChange}
                      className="col-span-1 border border-gray-200 bg-white px-2 py-2 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="CC">CC</option>
                      <option value="NIT">NIT</option>
                      <option value="CE">CE</option>
                      <option value="PP">Pasaporte</option>
                    </select>
                    <div className="col-span-2 relative">
                      <HiIdentification className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="numeroDocumento"
                        value={clientForm.numeroDocumento}
                        onChange={handleClientInputChange}
                        placeholder="N° Documento"
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 bg-white rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <HiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="telefono"
                        value={clientForm.telefono}
                        onChange={handleClientInputChange}
                        placeholder="Teléfono"
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 bg-white rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="relative">
                      <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={clientForm.email}
                        onChange={handleClientInputChange}
                        placeholder="Correo"
                        required
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 bg-white rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Cálculos e importes */}
                  <div className="pt-4 border-t border-gray-200 space-y-1.5 text-xs text-gray-600 font-medium">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>$ {subtotal.toLocaleString('es-CO')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>IVA (19%):</span>
                      <span>$ {iva.toLocaleString('es-CO')}</span>
                    </div>
                    <div className="flex justify-between text-base font-extrabold text-indigo-700 pt-1.5 border-t border-gray-200">
                      <span>Total:</span>
                      <span>$ {total.toLocaleString('es-CO')}</span>
                    </div>
                  </div>

                  {/* Botón de Checkout */}
                  <button
                    type="submit"
                    className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md active:scale-[0.98]"
                  >
                    Generar Factura
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
