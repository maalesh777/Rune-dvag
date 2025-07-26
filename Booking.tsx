import React, { useState, useMemo, useEffect, useRef } from 'react';
// Like in the Login component, `useActionState` and `useFormStatus` are
// experimental hooks provided by the `react-dom` package rather than `react`.
// Importing them from `react` leads to undefined values during runtime.
// Import `useFormStatus` for potential future use, though we no longer rely on
// `useActionState`.  Keeping `useFormStatus` here in case you wish to
// implement custom pending indicators at the field level.
import { useFormStatus } from 'react-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { submitBookingRequest } from '../services/api';
import { UserIcon } from './icons/UserIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { RECAPTCHA_SITE_KEY } from '../config';

// Helper function to get the next 5 weekdays
const getNextWeekdays = () => {
    const days = [];
    const today = new Date();
    let count = 0;
    let dayIncrement = 0;
    
    while (count < 5) {
        const nextDay = new Date();
        nextDay.setDate(today.getDate() + dayIncrement);
        const dayOfWeek = nextDay.getDay();

        if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Monday to Friday
            days.push({
                display: new Intl.DateTimeFormat('de-DE', { weekday: 'long', month: 'long', day: 'numeric' }).format(nextDay),
            });
            count++;
        }
        dayIncrement++;
    }
    return days;
};

type FormState = {
  error: string | null;
  isSuccess: boolean;
};

const initialState: FormState = {
  error: null,
  isSuccess: false,
};

// Render a submit button with explicit loading state.  Using our own loading
// indicator avoids reliance on the experimental `useActionState` hook.
const SubmitButton: React.FC<{ loading: boolean }> = ({ loading }) => (
  <Button variant="accent" type="submit" disabled={loading}>
    {loading ? 'Wird gesendet...' : 'Termin anfragen'}
  </Button>
);


export const Booking: React.FC = () => {
  const weekdays = useMemo(() => getNextWeekdays(), []);
  const availableTimes = ['09:00', '11:00', '13:00', '15:00', '17:00'];

  // UI state
  const [selectedSlot, setSelectedSlot] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [name, setName] = useState('');

  // Refs to access form and recaptcha instances
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const formRef = useRef<HTMLFormElement>(null);

  /**
   * Handle booking form submission. Validates required fields, sends the
   * booking request to Firestore and updates UI state accordingly.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!selectedSlot) {
      setError('Bitte wählen Sie einen Termin.');
      return;
    }
    if (!captchaToken) {
      setError('Bitte bestätigen Sie, dass Sie kein Roboter sind.');
      return;
    }
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const formName = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
    if (!formName || !email || !phoneNumber) {
      setError('Bitte füllen Sie alle Felder aus und wählen Sie einen Termin.');
      return;
    }
    setLoading(true);
    try {
      await submitBookingRequest({ name: formName, email, phoneNumber, requestedSlot: selectedSlot });
      setName(formName);
      setIsSuccess(true);
      formRef.current.reset();
      recaptchaRef.current?.reset();
      setCaptchaToken(null);
    } catch (err) {
      console.error(err);
      setError('Terminanfrage konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  // Render the success message when the request has completed successfully
  if (isSuccess) {
    return (
      <Card className="max-w-4xl mx-auto animate-fade-in-up">
        <div className="text-center p-8 bg-green-500/10 rounded-lg border border-green-500/30">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-500/20 mb-4">
            <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Anfrage erhalten!</h2>
          <p className="mt-2 text-slate-600">Vielen Dank, {name}. Ihre Terminanfrage für <strong className="text-blue-600">{selectedSlot}</strong> wurde versendet. Ich melde mich in Kürze bei Ihnen, um den Termin zu bestätigen.</p>
          <Button className="mt-6" variant="secondary" onClick={() => { setIsSuccess(false); setSelectedSlot(''); setName(''); setCaptchaToken(null); }}>Weitere Anfrage senden</Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-montserrat">
          <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">Ihren Wunschtermin anfragen</span>
        </h1>
        <p className="text-xl text-slate-600 mt-3">Wählen Sie einen passenden Termin für Ihr unverbindliches Erstgespräch.</p>
      </div>

      <div className="space-y-6">
        {weekdays.map((day) => (
          <div key={day.display}>
            <h3 className="font-semibold text-lg text-blue-600 border-b-2 border-blue-500/30 pb-2 mb-4">{day.display}</h3>
            <div className="flex flex-wrap gap-3">
              {availableTimes.map((time) => {
                const fullSlotId = `${day.display} um ${time} Uhr`;
                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedSlot(fullSlotId)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 transform hover:scale-105 ${selectedSlot === fullSlotId ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-lg' : 'bg-white/40 text-slate-700 border-slate-300/70 hover:border-blue-500 hover:text-blue-600'}`}
                  >
                    {time} Uhr
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {selectedSlot && (
        <form onSubmit={handleSubmit} ref={formRef} className="mt-8 pt-6 border-t border-slate-300/70 space-y-6 animate-fade-in-up">
          <p className="text-lg font-semibold text-slate-800 text-center">Ihre Auswahl: <span className="text-blue-600">{selectedSlot}</span></p>
          <input type="hidden" name="requestedSlot" value={selectedSlot} />
          <input type="hidden" name="captchaToken" value={captchaToken || ''} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              id="name"
              name="name"
              label="Ihr Name *"
              onChange={(e) => setName((e.target as HTMLInputElement).value)}
              required
              placeholder="Max Mustermann"
              icon={<UserIcon className="h-5 w-5 text-slate-500" />}
            />
            <Input
              id="email"
              name="email"
              label="Ihre E-Mail *"
              type="email"
              required
              placeholder="max.mustermann@mail.com"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />
            <Input
              id="phoneNumber"
              name="phoneNumber"
              label="Ihre Telefonnummer *"
              type="tel"
              required
              placeholder="0123 456789"
              icon={<PhoneIcon className="h-5 w-5 text-slate-500" />}
            />
          </div>

          <div className="flex justify-center">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={handleRecaptchaChange}
              onExpired={() => setCaptchaToken(null)}
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}
          <div className="text-center">
            <SubmitButton loading={loading} />
          </div>
        </form>
      )}
    </Card>
  );
};