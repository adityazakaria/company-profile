import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Lock } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { LoadingState } from '../../components/ui/States';
import { loginSchema } from '../../lib/schemas';
import { useAuth } from '../../lib/useAuth';
import { usePageTitle } from '../../lib/usePageTitle';
import { getErrorMessage } from '../../lib/utils';

export default function Login() {
  usePageTitle('Login Admin');
  const { admin, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  if (loading) return <LoadingState className="min-h-screen" />;
  if (admin) return <Navigate to="/admin/dashboard" replace />;

  const onSubmit = async (values) => {
    setServerError('');
    try {
      await login(values);
      navigate(location.state?.from || '/admin/dashboard', { replace: true });
    } catch (err) {
      setServerError(getErrorMessage(err, 'Login gagal'));
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-navy p-12 text-white lg:flex">
        <div className="absolute -right-24 top-1/4 h-96 w-96 rounded-full bg-primary/30 blur-3xl" aria-hidden />
        <Link to="/" className="relative flex items-center gap-2 text-sm text-white/75 hover:text-white"><ArrowLeft className="h-4 w-4" /> Kembali ke website</Link>
        <div className="relative">
          <h1 className="text-4xl leading-tight !text-white">Kelola konten website perusahaan dengan mudah.</h1>
          <p className="mt-4 max-w-md text-white/70">Perbarui profil, produk, berita, dan pantau pesan pelanggan dari satu panel.</p>
        </div>
        <p className="relative text-xs text-white/50">Panel Admin</p>
      </div>

      <div className="flex items-center justify-center bg-surface px-4 py-12">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-card">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white"><Lock className="h-5 w-5" aria-hidden /></span>
          <h2 className="mt-5 text-2xl">Masuk ke Admin</h2>
          <p className="mt-1 text-sm text-navy-muted">Gunakan akun administrator Anda.</p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-5">
            <Input label="Email" type="email" autoComplete="username" required error={errors.email?.message} {...register('email')} />
            <Input label="Password" type="password" autoComplete="current-password" required error={errors.password?.message} {...register('password')} />
            {serverError && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{serverError}</p>}
            <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>Masuk</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
