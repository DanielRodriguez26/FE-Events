// src/application/pages/auth/Register.tsx

import { useNavigate } from 'react-router-dom';
import { useRegisterForm } from '@application/hooks';
import InputField from '@components/ui/InputField';
import ErrorMessage from '@/components/ui/ErrorMessage';

const Register: React.FC = () => {
	const navigate = useNavigate();
	const { formData, isSubmitting, error, handleChange, handleSubmit, passwordsMatch } = useRegisterForm();

	const onNavigateToLogin = () => {
		navigate('/login');
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 '>
			<div className='max-w-md w-full space-y-8  sm:w-96'>
				<div>
					<h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>Crear Cuenta</h2>
					<p className='mt-2 text-center text-sm text-gray-600'>Regístrate para acceder a todos los eventos</p>
				</div>

				<form className='mt-8 mb-2 w-80 max-w-screen-lg sm:w-96' onSubmit={handleSubmit}>
					<div className='mb-1 flex flex-col gap-6'>
						<InputField
							id='first_name'
							name='first_name'
							type='text'
							placeholder='Nombre'
							value={formData.first_name}
							onChange={handleChange}
							required
							className='rounded-t-md'
						/>
						<InputField
							id='last_name'
							name='last_name'
							type='text'
							placeholder='Apellido'
							value={formData.last_name}
							onChange={handleChange}
							required
						/>
						<InputField
							id='email'
							name='email'
							type='email'
							placeholder='Email'
							value={formData.email}
							onChange={handleChange}
							required
						/>
						<InputField
							id='phone'
							name='phone'
							type='text'
							placeholder='Teléfono'
							value={formData.phone}
							onChange={handleChange}
							required
						/>
						<InputField
							id='username'
							name='username'
							type='text'
							placeholder='Nombre de usuario'
							value={formData.username}
							onChange={handleChange}
							required
						/>
						<InputField
							id='password'
							name='password'
							type='password'
							placeholder='Contraseña'
							value={formData.password}
							onChange={handleChange}
							required
						/>
						<InputField
							id='confirmPassword'
							name='confirmPassword'
							type='password'
							placeholder='Confirmar contraseña'
							value={formData.confirmPassword}
							onChange={handleChange}
							required
							className='rounded-b-md'
						/>
					</div>

					{error && <ErrorMessage error={error} />}

					{!passwordsMatch && formData.confirmPassword && (
						<div className='text-sm text-yellow-700 bg-yellow-50 p-4 rounded-md'>Las contraseñas no coinciden</div>
					)}

					<div>
						<button
							type='submit'
							disabled={isSubmitting || !passwordsMatch}
							className='mt-4 w-full rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'>
							{isSubmitting ? (
								<div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
							) : (
								'Crear Cuenta'
							)}
						</button>
					</div>

					<div className='text-center mt-4'>
						<p className='text-sm text-gray-600'>
							¿Ya tienes cuenta?{' '}
							<button
								type='button'
								onClick={onNavigateToLogin}
								className='font-medium text-blue-600 hover:text-blue-500'>
								Inicia sesión aquí
							</button>
						</p>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Register;
