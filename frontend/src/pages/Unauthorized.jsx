import React from 'react';
import { Link } from 'react-router-dom';
import { HiShieldExclamation } from 'react-icons/hi';

export default function Unauthorized() {
    return (
        <div className="flex flex-col h-screen items-center justify-center bg-gray-50 px-4 text-center font-sans">
            <div className="bg-red-50 text-red-500 p-4 rounded-full mb-4">
                <HiShieldExclamation className="text-6xl" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Acceso Denegado</h1>
            <p className="text-gray-500 mb-6 max-w-sm">
                No tienes permisos para acceder a esta sección. Solo el administrador autorizado puede ingresar aquí.
            </p>
            <Link
                to="/"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-colors shadow-md"
            >
                Volver al Inicio
            </Link>
        </div>
    );
}
