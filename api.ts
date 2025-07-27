
import { db, serverTimestamp } from './firebase';
import {
    collection,
    query,
    orderBy,
    getDocs,
    addDoc,
    doc,
    updateDoc,
    runTransaction,
    where,
    limit,
    Timestamp,
    DocumentSnapshot,
    DocumentData,
} from 'firebase/firestore';
import { 
    Referral, 
    Referrer, 
    ReferralStatus, 
    BookingRequest, 
    BookingStatus 
} from './types';

const toReferral = (docSnap: DocumentSnapshot<DocumentData>): Referral => {
    const data = docSnap.data()!;
    const submissionDate = data.submissionDate && typeof (data.submissionDate as Timestamp).toDate === 'function'
        ? (data.submissionDate as Timestamp).toDate().toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

    return {
        id: docSnap.id,
        recommendedName: data.recommendedName,
        referrerName: data.referrerName,
        submissionDate: submissionDate,
        status: data.status,
        preferredDate: data.preferredDate || undefined,
    };
};

const toReferrer = (docSnap: DocumentSnapshot<DocumentData>): Referrer => {
    const data = docSnap.data()!;
    return {
        id: docSnap.id,
        name: data.name,
        referralCount: data.referralCount,
    };
};

const toBookingRequest = (docSnap: DocumentSnapshot<DocumentData>): BookingRequest => {
    const data = docSnap.data()!;
    const submissionDate = data.submissionDate && typeof (data.submissionDate as Timestamp).toDate === 'function'
        ? (data.submissionDate as Timestamp).toDate().toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

    return {
        id: docSnap.id,
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        requestedSlot: data.requestedSlot,
        submissionDate: submissionDate,
        status: data.status,
    };
};


export const getReferrals = async (): Promise<Referral[]> => {
  const referralsCol = collection(db, 'referrals');
  const q = query(referralsCol, orderBy('submissionDate', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(toReferral);
};

export const getReferrers = async (): Promise<Referrer[]> => {
  const referrersCol = collection(db, 'referrers');
  const q = query(referrersCol, orderBy('referralCount', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(toReferrer);
};

export const submitReferral = async (data: { recommendedName: string; referrerName: string; preferredDate?: string }): Promise<void> => {
  const newReferralData = {
    recommendedName: data.recommendedName,
    referrerName: data.referrerName || 'Anonym',
    ...(data.preferredDate && { preferredDate: data.preferredDate }),
    submissionDate: serverTimestamp(),
    status: ReferralStatus.Neu,
  };

  const referralsColRef = collection(db, 'referrals');

  if (data.referrerName) {
    const referrersColRef = collection(db, 'referrers');
    const referrersQuery = query(referrersColRef, where('name', '==', data.referrerName), limit(1));
    
    await runTransaction(db, async (transaction) => {
        const querySnapshot = await transaction.get(referrersQuery);

        const newReferralRef = doc(referralsColRef);
        transaction.set(newReferralRef, newReferralData);

        if (querySnapshot.empty) {
            // If referrer doesn't exist, create them with a count of 1.
            const newReferrerRef = doc(referrersColRef);
            transaction.set(newReferrerRef, { name: data.referrerName, referralCount: 1 });
        } else {
            // If referrer exists, increment their referral count.
            const referrerDocRef = querySnapshot.docs[0].ref;
            const newCount = (querySnapshot.docs[0].data()?.referralCount || 0) + 1;
            transaction.update(referrerDocRef, { referralCount: newCount });
        }
    });
  } else {
    await addDoc(referralsColRef, newReferralData);
  }
};

export const updateReferralStatus = async (id: string, status: ReferralStatus): Promise<void> => {
  const referralDocRef = doc(db, 'referrals', id);
  await updateDoc(referralDocRef, { status });
};

export const getBookingRequests = async (): Promise<BookingRequest[]> => {
  const bookingRequestsCol = collection(db, 'bookingRequests');
  const q = query(bookingRequestsCol, orderBy('submissionDate', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(toBookingRequest);
};

export const submitBookingRequest = async (data: { name: string; email: string; phoneNumber: string; requestedSlot: string }): Promise<void> => {
  const bookingRequestsCol = collection(db, 'bookingRequests');
  await addDoc(bookingRequestsCol, {
    ...data,
    submissionDate: serverTimestamp(),
    status: BookingStatus.Neu,
  });
};

export const updateBookingRequestStatus = async (id: string, status: BookingStatus): Promise<void> => {
  const bookingDocRef = doc(db, 'bookingRequests', id);
  await updateDoc(bookingDocRef, { status });
};
