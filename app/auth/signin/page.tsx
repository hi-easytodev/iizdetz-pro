'use client';

import { signIn } from 'next-auth/react';
import { Github } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Welcome Back
          </h1>
          <p className="text-[var(--text-secondary)]">
            Sign in to save and manage your idea analyses
          </p>
        </div>

        {/* Sign In Card */}
        <div className="bg-[var(--card-bg)] border-2 border-[var(--border-color)] rounded-2xl p-8 shadow-xl">
          <div className="space-y-4">
            {/* Google Sign In */}
            <button
              onClick={() => signIn('google', { callbackUrl: '/' })}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
            >
              <FcGoogle className="w-6 h-6" />
              <span className="font-medium text-gray-700">Continue with Google</span>
            </button>

            {/* GitHub Sign In */}
            <button
              onClick={() => signIn('github', { callbackUrl: '/' })}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-[#24292e] text-white rounded-lg hover:bg-[#1a1e22] transition-all shadow-sm hover:shadow-md"
            >
              <Github className="w-6 h-6" />
              <span className="font-medium">Continue with GitHub</span>
            </button>
          </div>

          {/* Features List */}
          <div className="mt-8 pt-8 border-t border-[var(--border-color)]">
            <p className="text-sm text-[var(--text-secondary)] mb-4 font-medium">
              With an account, you can:
            </p>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li className="flex items-start gap-2">
                <span className="text-purple-500">✓</span>
                <span>Save unlimited idea analyses</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500">✓</span>
                <span>Access your analyses from any device</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500">✓</span>
                <span>Export analyses to PDF</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500">✓</span>
                <span>Get email notifications for new ideas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500">✓</span>
                <span>Track your analysis history</span>
              </li>
            </ul>
          </div>

          {/* Privacy Note */}
          <p className="mt-6 text-xs text-center text-[var(--text-secondary)]">
            By signing in, you agree to our Terms of Service and Privacy Policy.
            We'll only use your email to send important updates.
          </p>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
          Don't have an account? No problem!{' '}
          <span className="text-purple-500 font-medium">
            Signing in automatically creates one.
          </span>
        </p>
      </div>
    </div>
  );
}
