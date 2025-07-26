import React, { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { submitReferral } from '../services/api';
import { UserIcon } from './icons/UserIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { RECAPTCHA_SITE_KEY } from '../config';

/**
 * A form that allows users to recommend a new contact. This component uses
 * explicit state management instead of the experimental `useActionState`
 * and `useFormStatus` hooks to ensure compatibility across React versions.
 */
export const ReferralForm: React.FC = () => {
  // Form fields
  const [recommendedName, setRecommendedName] = useState('');
  const [referrerName, setReferrerName] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // refs to reset form and recaptcha after submission
  const formRef = useRef<HTMLFormElement>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    // Validate required fields
    if (!recommendedName) {
      setError('Bitte geben Sie den Namen des Kontakts an, den Sie empfehlen möchten.');
      return;
    }
    if (!captchaToken) {
      setError('Bitte bestätigen Sie, dass Sie kein Roboter sind.');
      return;
    }
    setLoading(true);
    try {
      await submitReferral({ recommendedName, referrerName, preferredDate });
      setIsSuccess(true);
      // reset form fields
      formRef.current?.reset();
      recaptchaRef.current?.reset();
      setCaptchaToken(null);
      setRecommendedName('');
      setReferrerName('');
      setPreferredDate('');
    } catch (err) {
      console.error(err);
      setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  // Render success message if form was submitted successfully
  if (isSuccess) {
    return (
      <Card className="text-center animate-fade-in-up">
        <div className="p-4 rounded-lg">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-500/20">
              <svg
                className="h-6 w-6 text-green-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <h3 className="text-lg leading-6 font-medium text-slate-800">Empfehlung erfolgreich!</h3>
              <div className="mt-2">
                <p className="text-sm text-slate-600">
                  Vielen Dank! Ihre Empfehlung wurde erfolgreich übermittelt.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Button variant="secondary" onClick={() => setIsSuccess(false)}>
              Weitere Empfehlung absenden
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 font-montserrat">
          Empfehlen Sie mich weiter!
        </h2>
        <p className="text-slate-600 mt-2">
          Kennen Sie jemanden, der von einer professionellen Vermögensberatung profitieren könnte?
        </p>
      </div>
      <form onSubmit={handleSubmit} ref={formRef} className="space-y-6">
        <Input
          id="recommendedName"
          name="recommendedName"
          label="Name des Kontakts *"
          required
          placeholder="Max Mustermann"
          onChange={(e) => setRecommendedName((e.target as HTMLInputElement).value)}
          icon={<UserIcon className="h-5 w-5 text-slate-500" />}
        />
        <Input
          id="referrerName"
          name="referrerName"
          label="Ihr Name (Optional, für Belohnung)"
          placeholder="Anna Schmidt"
          onChange={(e) => setReferrerName((e.target as HTMLInputElement).value)}
          icon={<UserIcon className="h-5 w-5 text-slate-500" />}
        />
        <Input
          id="preferredDate"
          name="preferredDate"
          label="Bevorzugter Termin (Optional)"
          type="date"
          onChange={(e) => setPreferredDate((e.target as HTMLInputElement).value)}
          icon={<CalendarIcon className="h-5 w-5 text-slate-500" />}
        />

        {/* Hidden field to attach captcha token to the form submission */}
        <input type="hidden" name="captchaToken" value={captchaToken || ''} />

        <div className="flex justify-center">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={handleRecaptchaChange}
            onExpired={() => setCaptchaToken(null)}
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center font-medium">
            {error}
          </p>
        )}

        <Button type="submit" variant="accent" className="w-full" disabled={loading}>
          {loading ? 'Wird gesendet...' : 'Empfehlung absenden'}
        </Button>
      </form>
    </Card>
  );
};