import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { getReferrals, getReferrers, updateReferralStatus, getBookingRequests, updateBookingRequestStatus } from '../services/api';
import { Referral, Referrer, ReferralStatus, BadgeTier, BookingRequest, BookingStatus } from '../types';
import { BADGE_THRESHOLDS } from '../constants';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { UserIcon } from './icons/UserIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { PhoneIcon } from './icons/PhoneIcon';

const getBadgeTier = (count: number): BadgeTier => {
  if (count >= BADGE_THRESHOLDS.Platinum) return BadgeTier.Platinum;
  if (count >= BADGE_THRESHOLDS.Gold) return BadgeTier.Gold;
  if (count >= BADGE_THRESHOLDS.Silver) return BadgeTier.Silver;
  if (count >= BADGE_THRESHOLDS.Bronze) return BadgeTier.Bronze;
  return BadgeTier.None;
};

const StatCard: React.FC<{title:string, value: number, colorClass:string, icon: React.ReactNode, glowClass: string}> = ({title, value, colorClass, icon, glowClass}) => (
    <div className={`group relative bg-white/20 p-4 rounded-xl shadow-lg border border-white/30 text-center transition-all duration-300 transform hover:scale-105 hover:bg-white/40`}>
        <div className={`absolute -inset-0.5 rounded-xl bg-gradient-to-r ${glowClass} opacity-0 group-hover:opacity-75 blur transition duration-500`}></div>
        <div className="relative">
            <div className={`mx-auto h-12 w-12 rounded-full flex items-center justify-center bg-slate-800/10 mb-3 ${colorClass}`}>{icon}</div>
            <p className="text-3xl font-bold text-slate-800">{value}</p>
            <p className="text-slate-500 text-sm mt-1">{title}</p>
        </div>
    </div>
)

const ReferralCard: React.FC<{ referral: Referral; onStatusChange: (id: string, status: ReferralStatus) => void }> = ({ referral, onStatusChange }) => {
  const statusColorMap: Record<ReferralStatus, string> = {
    [ReferralStatus.Neu]: 'border-blue-500',
    [ReferralStatus.Kontaktiert]: 'border-yellow-500',
    [ReferralStatus.TerminVereinbart]: 'border-purple-500',
    [ReferralStatus.Abgeschlossen]: 'border-green-500',
    [ReferralStatus.NichtErreicht]: 'border-red-500',
  };

  return (
    <div className={`bg-white/20 p-4 rounded-lg shadow-md border-l-4 ${statusColorMap[referral.status]} transition-all duration-300 hover:bg-white/40 hover:shadow-xl`}>
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex-grow">
          <p className="font-bold text-lg text-slate-800">{referral.recommendedName}</p>
          <div className="flex items-center text-sm text-slate-500 mt-1">
            <UserIcon className="h-4 w-4 mr-2 text-slate-500" />
            <span>Empfohlen von: <span className="font-semibold text-slate-700">{referral.referrerName}</span></span>
          </div>
          <div className="flex items-center text-sm text-slate-500 mt-1">
            <CalendarIcon className="h-4 w-4 mr-2" />
            <span>Eingang: {new Date(referral.submissionDate).toLocaleDateString('de-DE')}{' '}
            {referral.preferredDate && `| Wunsch: ${new Date(referral.preferredDate).toLocaleDateString('de-DE')}`}</span>
          </div>
        </div>
        <div className="w-full sm:w-auto mt-2 sm:mt-0">
          <select
            value={referral.status}
            onChange={(e) => onStatusChange(referral.id, e.target.value as ReferralStatus)}
            className="p-2 border border-slate-400/60 rounded-lg bg-white/50 text-slate-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
          >
            {Object.values(ReferralStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
};

const BookingRequestCard: React.FC<{ request: BookingRequest; onStatusChange: (id: string, status: BookingStatus) => void }> = ({ request, onStatusChange }) => {
  const statusColorMap: Record<BookingStatus, string> = {
    [BookingStatus.Neu]: 'border-blue-500',
    [BookingStatus.Bestaetigt]: 'border-green-500',
    [BookingStatus.Abgelehnt]: 'border-red-500',
  };

  return (
    <div className={`bg-white/20 p-4 rounded-lg shadow-md border-l-4 ${statusColorMap[request.status]} transition-all duration-300 hover:bg-white/40 hover:shadow-xl`}>
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex-grow">
          <p className="font-bold text-lg text-slate-800">{request.requestedSlot}</p>
          <div className="flex items-center text-sm text-slate-500 mt-1">
            <UserIcon className="h-4 w-4 mr-2 text-slate-500" />
            <span>Anfragesteller: <span className="font-semibold text-slate-700">{request.name} ({request.email})</span></span>
          </div>
          <div className="flex items-center text-sm text-slate-500 mt-1">
            <PhoneIcon className="h-4 w-4 mr-2 text-slate-500" />
            <span>Telefon: <span className="font-semibold text-slate-700">{request.phoneNumber}</span></span>
          </div>
          <div className="flex items-center text-sm text-slate-500 mt-1">
            <CalendarIcon className="h-4 w-4 mr-2" />
            <span>Anfrage vom: {new Date(request.submissionDate).toLocaleDateString('de-DE')}</span>
          </div>
        </div>
        <div className="w-full sm:w-auto mt-2 sm:mt-0">
          <select
            value={request.status}
            onChange={(e) => onStatusChange(request.id, e.target.value as BookingStatus)}
            className="p-2 border border-slate-400/60 rounded-lg bg-white/50 text-slate-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
          >
            {Object.values(BookingStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
};


const ReferrerRanking: React.FC<{ referrers: Referrer[] }> = ({ referrers }) => (
  <Card>
    <h2 className="text-2xl font-bold text-slate-800 mb-6 font-montserrat flex items-center gap-3">
      <span className="text-3xl">🏆</span> Empfehlungs-Ranking
    </h2>
    <div className="space-y-3">
      {referrers.map((referrer, index) => (
        <div key={referrer.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-white/20 to-transparent rounded-lg transition-all duration-300 hover:bg-white/40 hover:shadow-lg transform hover:scale-[1.02]" style={{ animation: `fade-in-up 0.5s ${index * 0.05}s ease-out both` }}>
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold text-slate-500 w-8 text-center">{index + 1}.</span>
            <p className="font-semibold text-slate-800 text-lg">{referrer.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge tier={getBadgeTier(referrer.referralCount)} />
            <span className="font-bold text-xl text-slate-800 w-16 text-right">{referrer.referralCount} <span className="text-sm text-slate-500">Ref(s)</span></span>
          </div>
        </div>
      ))}
    </div>
    <div className="mt-8 text-center">
      <Button variant="accent" onClick={() => alert('Die Funktion "Belohnungen verwalten" ist noch nicht implementiert.')}>Belohnungen verwalten</Button>
    </div>
  </Card>
);


export const AdminDashboard: React.FC = () => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [referrers, setReferrers] = useState<Referrer[]>([]);
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'referrals' | 'bookings' | 'ranking'>('referrals');
  
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({});

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [referralsData, referrersData, bookingsData] = await Promise.all([
          getReferrals(), 
          getReferrers(),
          getBookingRequests()
        ]);
      setReferrals(referralsData);
      setReferrers(referrersData);
      setBookingRequests(bookingsData);
    } catch (err) {
      setError('Fehler beim Laden der Daten.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const tabOrder: Array<'referrals' | 'bookings' | 'ranking'> = ['referrals', 'bookings', 'ranking'];
    const activeTabIndex = tabOrder.indexOf(activeTab);
    const activeTabNode = tabsRef.current[activeTabIndex];
    if (activeTabNode) {
        setIndicatorStyle({
            left: activeTabNode.offsetLeft,
            width: activeTabNode.offsetWidth,
        });
    }
  }, [activeTab, referrals, referrers, bookingRequests]); // Rerun on data load to get correct dimensions

  const handleReferralStatusChange = async (id: string, status: ReferralStatus) => {
    try {
      await updateReferralStatus(id, status);
      setReferrals(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    } catch {
      setError('Status konnte nicht aktualisiert werden.');
    }
  };

  const handleBookingStatusChange = async (id: string, status: BookingStatus) => {
    try {
      await updateBookingRequestStatus(id, status);
      setBookingRequests(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    } catch {
      setError('Status der Terminanfrage konnte nicht aktualisiert werden.');
    }
  };

  const referralStats = useMemo(() => {
    return referrals.reduce((acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {} as Record<ReferralStatus, number>);
  }, [referrals]);
  
  const newBookingRequestsCount = useMemo(() => {
    return bookingRequests.filter(b => b.status === BookingStatus.Neu).length;
  }, [bookingRequests]);

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div></div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <div className="space-y-8 animate-fade-in-up">
      <h1 className="text-4xl font-bold text-slate-900 font-montserrat">Admin Dashboard</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <StatCard title="Gesamt Empf." value={referrals.length} colorClass="text-gray-400" icon={<span className="text-2xl">🗂️</span>} glowClass="from-gray-500 to-gray-600" />
        <StatCard title="Neue Empf." value={referralStats[ReferralStatus.Neu] || 0} colorClass="text-blue-400" icon={<span className="text-2xl">✨</span>} glowClass="from-blue-500 to-cyan-500"/>
        <StatCard title="Neue Anfragen" value={newBookingRequestsCount} colorClass="text-orange-400" icon={<span className="text-2xl">📩</span>} glowClass="from-orange-500 to-red-500"/>
        <StatCard title="Kontaktiert" value={referralStats[ReferralStatus.Kontaktiert] || 0} colorClass="text-yellow-400" icon={<span className="text-2xl">📞</span>} glowClass="from-yellow-500 to-amber-500"/>
        <StatCard title="Termine" value={referralStats[ReferralStatus.TerminVereinbart] || 0} colorClass="text-purple-400" icon={<span className="text-2xl">🗓️</span>} glowClass="from-purple-500 to-violet-500"/>
        <StatCard title="Abgeschlossen" value={referralStats[ReferralStatus.Abgeschlossen] || 0} colorClass="text-green-400" icon={<span className="text-2xl">✔️</span>} glowClass="from-green-500 to-emerald-500"/>
      </div>

      <div>
        <div className="relative border-b border-slate-300/70 mb-6">
          <nav className="flex space-x-4 sm:space-x-8" role="tablist" aria-label="Dashboard Tabs">
            <button
              ref={el => { tabsRef.current[0] = el; }}
              onClick={() => setActiveTab('referrals')}
              className={`relative z-10 whitespace-nowrap pb-4 px-1 font-medium text-base transition-colors ${activeTab === 'referrals' ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
              role="tab"
              aria-selected={activeTab === 'referrals'}
              id="tab-referrals"
              aria-controls="tabpanel-referrals"
            >
              Empfehlungen
            </button>
            <button
              ref={el => { tabsRef.current[1] = el; }}
              onClick={() => setActiveTab('bookings')}
              className={`relative z-10 whitespace-nowrap pb-4 px-1 font-medium text-base transition-colors ${activeTab === 'bookings' ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
              role="tab"
              aria-selected={activeTab === 'bookings'}
              id="tab-bookings"
              aria-controls="tabpanel-bookings"
            >
              Terminanfragen
              {newBookingRequestsCount > 0 && <span className={`ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none rounded-full transition-all bg-orange-500 text-white`}>{newBookingRequestsCount}</span>}
            </button>
            <button
              ref={el => { tabsRef.current[2] = el; }}
              onClick={() => setActiveTab('ranking')}
              className={`relative z-10 whitespace-nowrap pb-4 px-1 font-medium text-base transition-colors ${activeTab === 'ranking' ? 'text-blue-600' : 'border-transparent text-slate-500 hover:text-blue-600'}`}
              role="tab"
              aria-selected={activeTab === 'ranking'}
              id="tab-ranking"
              aria-controls="tabpanel-ranking"
            >
              Ranking
            </button>
          </nav>
          <div
            className="absolute bottom-[-1px] h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500 ease-in-out"
            style={indicatorStyle}
            aria-hidden="true"
          ></div>
        </div>
        
        <div id="tabpanel-referrals" role="tabpanel" aria-labelledby="tab-referrals" hidden={activeTab !== 'referrals'}>
          <Card>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 font-montserrat">Alle Empfehlungen</h2>
            <div className="space-y-4">
              {referrals.length > 0 ?
                referrals.map((ref) => <ReferralCard key={ref.id} referral={ref} onStatusChange={handleReferralStatusChange} />) :
                <p className="text-center text-slate-500 py-8">Keine Empfehlungen vorhanden.</p>
              }
            </div>
          </Card>
        </div>

        <div id="tabpanel-bookings" role="tabpanel" aria-labelledby="tab-bookings" hidden={activeTab !== 'bookings'}>
          <Card>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 font-montserrat">Alle Terminanfragen</h2>
            <div className="space-y-4">
              {bookingRequests.length > 0 ? (
                bookingRequests.map(req => <BookingRequestCard key={req.id} request={req} onStatusChange={handleBookingStatusChange} />)
              ) : (
                <p className="text-center text-slate-500 py-8">Keine Terminanfragen vorhanden.</p>
              )}
            </div>
          </Card>
        </div>

        <div id="tabpanel-ranking" role="tabpanel" aria-labelledby="tab-ranking" hidden={activeTab !== 'ranking'}>
          <ReferrerRanking referrers={referrers} />
        </div>
      </div>
    </div>
  );
};