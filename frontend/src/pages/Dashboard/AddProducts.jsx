import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../FireBase/firebaseConfig';
import Header from '../../components/Header';
import { Link } from 'react-router-dom';
import { HiArrowLeft, HiPlus, HiPencil, HiTrash, HiX, HiSearch, HiTag, HiPhotograph } from 'react-icons/hi';
import { MdOutlineInventory2 } from 'react-icons/md';
import Swal from 'sweetalert2';

const EMPTY_FORM = {
    nombre: '',
    descripcion: '',
    precio: '',
    imagen: '',
    categoria: '',
    marca: '',
    stock: '',
};

const CATEGORIES = ['Teclados', 'Ratones', 'Monitores', 'Diademas', 'Parlantes', 'Gabinetes', 'Fuentes', 'Sillas', 'Streaming', 'Combos', 'Otros'];

export default function AddProducts() {
    const [products, setProducts]       = useState([]);
    const [loading, setLoading]         = useState(true);
    const [modalOpen, setModalOpen]     = useState(false);
    const [editingId, setEditingId]     = useState(null);
    const [formData, setFormData]       = useState(EMPTY_FORM);
    const [saving, setSaving]           = useState(false);
    const [search, setSearch]           = useState('');
    const [filterCat, setFilterCat]     = useState('all');
    const [imgErrors, setImgErrors]     = useState({});

    const handleImgError = (id) => setImgErrors(prev => ({ ...prev, [id]: true }));

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const snap = await getDocs(collection(db, 'products'));
            setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    const openAdd = () => {
        setFormData(EMPTY_FORM);
        setEditingId(null);
        setModalOpen(true);
    };

    const openEdit = (product) => {
        setFormData({
            nombre:      product.nombre      || '',
            descripcion: product.descripcion || '',
            precio:      product.precio      || '',
            imagen:      product.imagen      || '',
            categoria:   product.categoria   || '',
            marca:       product.marca       || '',
            stock:       product.stock       || '',
        });
        setEditingId(product.id);
        setModalOpen(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                ...formData,
                precio: parseFloat(formData.precio) || 0,
                stock:  parseInt(formData.stock)    || 0,
                updatedAt: new Date().toISOString(),
            };

            if (editingId) {
                await updateDoc(doc(db, 'products', editingId), payload);
                Swal.fire({ icon: 'success', title: '¡Producto actualizado!', timer: 1500, showConfirmButton: false });
            } else {
                payload.createdAt = new Date().toISOString();
                await addDoc(collection(db, 'products'), payload);
                Swal.fire({ icon: 'success', title: '¡Producto agregado!', timer: 1500, showConfirmButton: false });
            }

            setModalOpen(false);
            fetchProducts();
        } catch (e) {
            console.error(e);
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo guardar el producto.', confirmButtonColor: '#6366f1' });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id, nombre) => {
        const result = await Swal.fire({
            title: `¿Eliminar "${nombre}"?`,
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });
        if (!result.isConfirmed) return;
        try {
            await deleteDoc(doc(db, 'products', id));
            setProducts(prev => prev.filter(p => p.id !== id));
            Swal.fire({ icon: 'success', title: 'Eliminado', timer: 1200, showConfirmButton: false });
        } catch (e) {
            Swal.fire({ icon: 'error', title: 'Error al eliminar', confirmButtonColor: '#6366f1' });
        }
    };

    const filtered = products.filter(p => {
        const matchSearch = p.nombre?.toLowerCase().includes(search.toLowerCase()) ||
                            p.marca?.toLowerCase().includes(search.toLowerCase());
        const matchCat    = filterCat === 'all' || p.categoria === filterCat;
        return matchSearch && matchCat;
    });

    return (
        <div className="bg-gray-50 min-h-screen">
            <Header />
            <div className="max-w-7xl mx-auto px-4 py-8">

                {/* Back */}
                <div className="mb-6">
                    <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-medium transition-colors">
                        <HiArrowLeft className="text-xl" />
                        Volver al Dashboard
                    </Link>
                </div>

                {/* Header card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        <MdOutlineInventory2 className="text-3xl text-indigo-600" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Gestión de Productos</h1>
                            <p className="text-gray-500 text-sm">{products.length} producto{products.length !== 1 ? 's' : ''} registrado{products.length !== 1 ? 's' : ''}</p>
                        </div>
                    </div>
                    <button
                        onClick={openAdd}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
                    >
                        <HiPlus className="text-lg" /> Agregar Producto
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o marca..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
                    <select
                        value={filterCat}
                        onChange={e => setFilterCat(e.target.value)}
                        className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                        <option value="all">Todas las categorías</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                {/* Products grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-24">
                        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-3">
                        <MdOutlineInventory2 className="text-5xl text-gray-300" />
                        <p className="text-gray-400 text-sm">No se encontraron productos.</p>
                        <button onClick={openAdd} className="text-indigo-600 text-sm font-semibold hover:underline">
                            + Agregar el primero
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filtered.map(p => (
                            <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                                {/* Image */}
                                <div className="h-44 bg-gray-50 flex items-center justify-center overflow-hidden">
                                    {p.imagen && !imgErrors[p.id] ? (
                                        <img
                                            src={p.imagen}
                                            alt={p.nombre}
                                            className="h-full w-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                                            onError={() => handleImgError(p.id)}
                                        />
                                    ) : (
                                        <HiPhotograph className="text-4xl text-gray-300" />
                                    )}
                                </div>

                                {/* Info */}
                                <div className="p-4">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <h3 className="font-semibold text-gray-800 text-sm leading-tight line-clamp-2">{p.nombre}</h3>
                                        {p.categoria && (
                                            <span className="shrink-0 text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
                                                {p.categoria}
                                            </span>
                                        )}
                                    </div>
                                    {p.marca && <p className="text-xs text-gray-400 mb-2">{p.marca}</p>}
                                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">{p.descripcion}</p>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-lg font-bold text-indigo-600">
                                                ${Number(p.precio).toLocaleString('es-CO')}
                                            </p>
                                            {p.stock !== undefined && p.stock !== '' && (
                                                <p className="text-xs text-gray-400">Stock: {p.stock}</p>
                                            )}
                                        </div>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => openEdit(p)}
                                                className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
                                            >
                                                <HiPencil />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(p.id, p.nombre)}
                                                className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition"
                                            >
                                                <HiTrash />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal Add/Edit */}
            {modalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
                    onClick={() => setModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-800">
                                {editingId ? 'Editar Producto' : 'Agregar Producto'}
                            </h2>
                            <button onClick={() => setModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg transition">
                                <HiX className="text-gray-500 text-xl" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">

                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-1 block">Nombre *</label>
                                <input
                                    name="nombre" value={formData.nombre} onChange={handleChange} required
                                    placeholder="Ej: Teclado Mecánico RGB"
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-1 block">Descripción</label>
                                <textarea
                                    name="descripcion" value={formData.descripcion} onChange={handleChange}
                                    placeholder="Descripción del producto..."
                                    rows={3}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Precio (COP) *</label>
                                    <input
                                        name="precio" value={formData.precio} onChange={handleChange} required
                                        type="number" min="0" placeholder="0"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Stock</label>
                                    <input
                                        name="stock" value={formData.stock} onChange={handleChange}
                                        type="number" min="0" placeholder="0"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Categoría</label>
                                    <select
                                        name="categoria" value={formData.categoria} onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                                    >
                                        <option value="">Sin categoría</option>
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Marca</label>
                                    <input
                                        name="marca" value={formData.marca} onChange={handleChange}
                                        placeholder="Ej: Logitech"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-1 block">URL de Imagen</label>
                                {formData.imagen && (
                                    <img
                                        src={formData.imagen} alt="preview"
                                        className="w-20 h-20 object-contain rounded-xl border border-gray-100 mb-2"
                                        onError={e => e.target.style.display = 'none'}
                                    />
                                )}
                                <input
                                    name="imagen" value={formData.imagen} onChange={handleChange}
                                    type="url" placeholder="https://..."
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button" onClick={() => setModalOpen(false)}
                                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit" disabled={saving}
                                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition disabled:bg-indigo-300 flex items-center justify-center gap-2"
                                >
                                    {saving ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : editingId ? 'Guardar Cambios' : 'Agregar Producto'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
