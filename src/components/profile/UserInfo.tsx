import type { IUser } from '@/domain/auth/auth.interface';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface UserInfoProps {
    user:IUser  | null;
    onLogout: () => void;
}

const UserInfo: React.FC<UserInfoProps> = ({ user, onLogout }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Información Personal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                    <p className="mt-1 text-sm text-gray-900">{user?.first_name || 'No especificado'}</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{user?.email || 'No especificado'}</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                    <p className="mt-1 text-sm text-gray-900">{user?.phone || 'No especificado'}</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha de registro</label>
                    <p className="mt-1 text-sm text-gray-900">
                        {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'No especificado'}
                    </p>
                </div>
            </div>
            <div className="mt-6 flex gap-4">
                <button
                    onClick={() => navigate('/profile/edit')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Editar Perfil
                </button>
                <button
                    onClick={onLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
};

export default UserInfo;