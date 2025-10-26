'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { loginUser, signupUser } from '@/store/slices/authSlice';

export default function HomePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        await dispatch(loginUser({ email: formData.email, password: formData.password })).unwrap();
      } else {
        await dispatch(signupUser({ email: formData.email, password: formData.password, name: formData.name })).unwrap();
      }
      router.push('/dashboard');
    } catch (err: any) {
      setError(err || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isLogin ? 'Sign In' : 'Sign Up'}</CardTitle>
          <CardDescription>{isLogin ? 'Welcome back' : 'Create account'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <div className="bg-red-50 text-red-700 p-3 rounded">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div><Label>Name</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></div>
            )}
            <div><Label>Email</Label><Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required /></div>
            <div><Label>Password</Label><Input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required /></div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}</Button>
          </form>
          <Button variant="outline" className="w-full" onClick={() => window.location.href = 'http://localhost:5000/api/auth/google'}>
            Sign in with Google
          </Button>
          <div className="text-center text-sm">
            <button onClick={() => {setIsLogin(!isLogin); setError('');}} className="text-blue-600">{isLogin ? 'Create account' : 'Sign in'}</button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
