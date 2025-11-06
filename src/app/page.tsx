'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null); // dùng thật để tránh ESLint “unused”

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { message?: string };
        setFormError(data.message ?? 'Đăng ký thất bại. Vui lòng thử lại.');
        setSubmitting(false);
        return;
      }

      // Đăng ký xong chuyển sang login
      router.push('/auth/login');
    } catch {
      setFormError('Có lỗi xảy ra. Vui lòng thử lại.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-100 to-white px-4 py-12">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 border border-neutral-200">
        <h1 className="text-2xl font-bold text-neutral-900 mb-6 text-center">
          Tạo tài khoản mới
        </h1>

        {formError && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {formError}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-neutral-700">
              Họ và tên
            </label>
            <input
              id="name"
              type="text"
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nguyễn Văn A"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tối thiểu 8 ký tự"
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full btn btn-primary"
          >
            {submitting ? 'Đang tạo tài khoản...' : 'Đăng ký'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-600">
          Đã có tài khoản?{' '}
          <Link href="/auth/login" className="text-primary underline underline-offset-4">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
