import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../FireBase/firebaseConfig';
import { FaGoogle, FaGithub, FaFacebookF } from 'react-icons/fa';
import { HiMail, HiSearch, HiUsers, HiStatusOnline, HiShieldCheck, HiCalendar, HiX } from 'react-icons/hi';
import { MdOutlineLogout } from 'react-icons/md';
import Header from '../components/Header';

const providerIcon = {
    google:   <FaGoogle    className="text-red-500"   />,
    github:   <FaGithub    className="text-gray-700"  />,
    facebook: <FaFacebookF className="text-blue-600"  />,
    email:    <HiMail      className="text-indigo-500" />,
};

const providerLabel = {
    google: 'Google', github: 'GitHub', facebook: 'Facebook', email: 'Email',
};

const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('es-CO', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
};

export default function AdminPanel() {
    const [sessions, setSessions]           = useState([]);
    const [loading, setLoading]             = useState(true);
    const [searchName, setSearchName]         = useState('');
    const [searchEmail, setSearchEmail]       = useState('');
    const [filterStatus, setFilterStatus]     = useState('all');
    const [filterProvider, setFilterProvider] = useState('all');
    const [dateFrom, setDateFrom]             = useState('');
    const [dateTo, setDateTo]                 = useState('');

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const usersSnap = await getDocs(collection(db, 'users'));
                const allSessions = [];

                for (const userDoc of usersSnap.docs) {
                    const userData = userDoc.data();
                    const sessionsSnap = await getDocs(
                        collection(db, 'users', userDoc.id, 'sessions')
                    );
                    sessionsSnap.docs.forEach((sessionDoc) => {
                        allSessions.push({
                            id:       sessionDoc.id,
                            uid:      userDoc.id,
                            nombre:   userData.nombre   || '—',
                            apellido: userData.apellido || '—',
                            email:    userData.email    || '—',
                            ...sessionDoc.data(),
                        });
                    });
                }

                allSessions.sort((a, b) => new Date(b.loginAt) - new Date(a.loginAt));
                setSessions(allSessions);
            } catch (error) {
                console.error('Error al cargar sesiones:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSessions();
    }, []);

    const hasActiveFilters = searchName || searchEmail || filterStatus !== 'all' || filterProvider !== 'all' || dateFrom || dateTo;

    const clearFilters = () => {
        setSearchName('');
        setSearchEmail('');
        setFilterStatus('all');
        setFilterProvider('all');
        setDateFrom('');
        setDateTo('');
    };

    const filtered = sessions.filter((s) => {
        const matchName     = s.nombre.toLowerCase().includes(searchName.toLowerCase());
        const matchEmail    = s.email.toLowerCase().includes(searchEmail.toLowerCase());
        const matchStatus   = filterStatus   === 'all' || s.status   === filterStatus;
        const matchProvider = filterProvider === 'all' || s.provider === filterProvider;
        const sessionDate   = s.loginAt ? new Date(s.loginAt) : null;
        const matchFrom     = !dateFrom || (sessionDate && sessionDate >= new Date(dateFrom));
        const matchTo       = !dateTo   || (sessionDate && sessionDate <= new Date(dateTo + 'T23:59:59'));
        return matchName && matchEmail && matchStatus && matchProvider && matchFrom && matchTo;
    });

    const totalSessions  = sessions.length;
    const activeSessions = sessions.filter(s => s.status === 'active').length;
    const uniqueUsers    = new Set(sessions.map(s => s.uid)).size;

    const statCards = [
        { label: 'Total Sesiones',    value: totalSessions,  icon: <MdOutlineLogout className="text-2xl" />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Sesiones Activas',  value: activeSessions, icon: <HiStatusOnline  className="text-2xl" />, color: 'text-green-600',  bg: 'bg-green-50'  },
        { label: 'Usuarios Únicos',   value: uniqueUsers,    icon: <HiUsers         className="text-2xl" />, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    return (
        <div className="bg-gray-50 min-h-screen">
            <Header />

            <div className="max-w-7xl mx-auto px-4 py-8">

                {/* Encabezado */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <HiShieldCheck className="text-3xl text-indigo-600" />
                            <h1 className="text-3xl font-bold text-gray-800">Panel de Administración</h1>
                        </div>
                        <p className="text-gray-500 text-sm ml-10">Registro y monitoreo de sesiones de usuarios</p>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    {statCards.map((card) => (
                        <div key={card.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
                            <div className={`${card.bg} ${card.color} p-3 rounded-xl`}>
                                {card.icon}
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                                <p className="text-sm text-gray-500">{card.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filtros */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Filtros</p>
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
                            >
                                <HiX className="text-sm" /> Limpiar filtros
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">

                        {/* Buscar por nombre */}
                        <div className="relative xl:col-span-1">
                            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Nombre..."
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                            />
                        </div>

                        {/* Buscar por email */}
                        <div className="relative xl:col-span-1">
                            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Email..."
                                value={searchEmail}
                                onChange={(e) => setSearchEmail(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                            />
                        </div>

                        {/* Filtro por estado */}
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                        >
                            <option value="all">Todos los estados</option>
                            <option value="active">Activo</option>
                            <option value="finalized">Finalizado</option>
                        </select>

                        {/* Filtro por proveedor */}
                        <select
                            value={filterProvider}
                            onChange={(e) => setFilterProvider(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                        >
                            <option value="all">Todos los métodos</option>
                            <option value="email">Email</option>
                            <option value="google">Google</option>
                            <option value="github">GitHub</option>
                            <option value="facebook">Facebook</option>
                        </select>

                        {/* Fecha desde */}
                        <div className="relative">
                            <HiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                            />
                        </div>

                        {/* Fecha hasta */}
                        <div className="relative">
                            <HiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                            />
                        </div>

                    </div>

                    {/* Tags de filtros activos */}
                    {hasActiveFilters && (
                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                            {searchName && (
                                <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1 rounded-full">
                                    Nombre: {searchName}
                                    <button onClick={() => setSearchName('')}><HiX /></button>
                                </span>
                            )}
                            {searchEmail && (
                                <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1 rounded-full">
                                    Email: {searchEmail}
                                    <button onClick={() => setSearchEmail('')}><HiX /></button>
                                </span>
                            )}
                            {filterStatus !== 'all' && (
                                <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1 rounded-full">
                                    Estado: {filterStatus === 'active' ? 'Activo' : 'Finalizado'}
                                    <button onClick={() => setFilterStatus('all')}><HiX /></button>
                                </span>
                            )}
                            {filterProvider !== 'all' && (
                                <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1 rounded-full">
                                    Método: {providerLabel[filterProvider]}
                                    <button onClick={() => setFilterProvider('all')}><HiX /></button>
                                </span>
                            )}
                            {dateFrom && (
                                <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1 rounded-full">
                                    Desde: {dateFrom}
                                    <button onClick={() => setDateFrom('')}><HiX /></button>
                                </span>
                            )}
                            {dateTo && (
                                <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1 rounded-full">
                                    Hasta: {dateTo}
                                    <button onClick={() => setDateTo('')}><HiX /></button>
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Tabla */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                    {/* Tabla header con contador */}
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-gray-700">Sesiones registradas</h2>
                        {!loading && (
                            <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                                {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
                            </span>
                        )}
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-3">
                            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                            <p className="text-sm text-gray-400">Cargando sesiones...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-2">
                            <HiUsers className="text-4xl text-gray-300" />
                            <p className="text-gray-400 text-sm">No se encontraron sesiones.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {['Nombre', 'Email', 'Entrada', 'Salida', 'Estado', 'Método'].map((h) => (
                                            <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filtered.map((s) => (
                                        <tr key={`${s.uid}-${s.id}`} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-800">{s.nombre}</td>
                                            <td className="px-6 py-4 text-gray-500">{s.email}</td>
                                            <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{formatDate(s.loginAt)}</td>
                                            <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{formatDate(s.logoutAt)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                                                    s.status === 'active'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${s.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                                                    {s.status === 'active' ? 'Activo' : 'Finalizado'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-base">{providerIcon[s.provider] ?? <HiMail className="text-indigo-500" />}</span>
                                                    <span className="text-gray-600">{providerLabel[s.provider] ?? 'Email'}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}