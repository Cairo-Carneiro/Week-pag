import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

interface LoginFormData {
    email: string;
    password: string;
}

function LoginPage() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormData>();

    const navigate = useNavigate();
    
    const onSubmit = (data: LoginFormData) => { 
        console.log(data);
        navigate('/dashboard');
    };

    return (
        <div 
            className="min-h-screen flex items-center justify-center px-6"
            style={{
                background: 'linear-gradient(-45deg, #1e3a8a, #3b82f6, #60a5fa, #2563eb)',
                backgroundSize: '400% 400%',
                animation: 'gradient 15s ease infinite'
            }}
        >
            <style>{`
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>
            {/* Card de Login */}
            <div className="w-full max-w-md">
                {/* Header com gradiente azul */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-8 px-8 rounded-t-lg">
                    <div className="flex items-center gap-3 mb-2">
                        <LogIn size={32} />
                        <h1 className="text-3xl font-bold">Bem-vindo</h1>
                    </div>
                    <p className="text-blue-100">Faça login para acessar sua agenda</p>
                </div>

                {/* Formulário */}
                <form 
                    onSubmit={handleSubmit(onSubmit)} 
                    className="bg-white border border-gray-200 rounded-b-lg p-8 shadow-sm"
                >
                    {/* Campo de Email */}
                    <div className="mb-5">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Email
                        </label>
                        <input 
                            type="email"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                            placeholder="seu@email.com"
                            {...register('email', {
                                required: 'Email é obrigatório',
                                pattern: {
                                    value: /^[^@]+@[^@]+\.[^@]+$/,
                                    message: 'Email inválido'
                                }
                            })} 
                        />
                        {errors.email && (
                            <span className="text-red-500 text-sm mt-1 block">
                                {errors.email?.message}
                            </span>
                        )}
                    </div>
                    
                    {/* Campo de Senha */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Senha
                        </label>
                        <input 
                            type="password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                            placeholder="••••••••"
                            {...register('password', {
                                required: 'Senha é obrigatória'
                            })} 
                        />
                        {errors.password && (
                            <span className="text-red-500 text-sm mt-1 block">
                                {errors.password?.message}
                            </span>
                        )}
                    </div>
                    
                    {/* Botão de Submit */}
                    <button 
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;