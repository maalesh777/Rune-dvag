
import React, { useState } from 'react';
// `useActionState` and `useFormStatus` are part of the React 19 experimental APIs
// that live in the `react-dom` package. Importing them from `react` causes
// undefined values and runtime errors. See:
// https://react.dev/learn/suspense
// We avoid using the experimental `useActionState` and `useFormStatus` hooks
// because they may not be available in all React versions. Instead we
// implement our own loading and error handling within the component.
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { RECAPTCHA_SITE_KEY } from '../config';

// Simple Mail Icon
const MailIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

// Simple Lock Icon
const LockIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

// Render a submit button that reflects the current loading state.
const SubmitButton: React.FC<{ loading: boolean }> = ({ loading }) => (
    <Button type="submit" variant="primary" className="w-full" disabled={loading}>
        {loading ? 'Anmelden...' : 'Anmelden'}
    </Button>
);


export const Login: React.FC = () => {
  const navigate = useNavigate();
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles form submission manually instead of relying on React’s experimental
   * `useActionState`.  This ensures compatibility across React versions and
   * provides explicit control over loading and error states.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!captchaToken) {
      setError('Bitte bestätigen Sie, dass Sie kein Roboter sind.');
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error('Login Error:', err);
      switch (err.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          setError('Falsche E-Mail oder falsches Passwort.');
          break;
        case 'auth/invalid-email':
          setError('Das E-Mail-Format ist ungültig.');
          break;
        case 'auth/user-disabled':
          setError('Dieses Benutzerkonto wurde deaktiviert.');
          break;
        case 'auth/too-many-requests':
          setError('Zu viele Anmeldeversuche. Bitte versuchen Sie es später erneut.');
          break;
        default:
          setError('Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRecaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  return (
    <div className="flex justify-center items-center py-12 animate-fade-in-up">
      <Card className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 font-montserrat">Admin Login</h2>
          <p className="text-slate-600 mt-2">Bitte authentifizieren Sie sich.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="email"
            name="email"
            label="E-Mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="admin@beispiel.de"
            icon={<MailIcon className="h-5 w-5 text-slate-500" />}
          />
          <Input
            id="password"
            name="password"
            label="Passwort"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="********"
            icon={<LockIcon className="h-5 w-5 text-slate-500" />}
          />

          {/* Include the reCAPTCHA token as a hidden field in case a backend endpoint expects it */}
          <input type="hidden" name="captchaToken" value={captchaToken || ''} />

          <div className="flex justify-center">
            <ReCAPTCHA
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={handleRecaptchaChange}
              onExpired={() => setCaptchaToken(null)}
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}
          <SubmitButton loading={loading} />
        </form>
      </Card>
    </div>
  );
};
