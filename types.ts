
export enum ReferralStatus {
  Neu = "Neu",
  Kontaktiert = "Kontaktiert",
  TerminVereinbart = "Termin vereinbart",
  Abgeschlossen = "Abgeschlossen",
  NichtErreicht = "Nicht erreicht",
}

export interface Referral {
  id: string;
  recommendedName: string;
  referrerName: string;
  preferredDate?: string;
  submissionDate: string;
  status: ReferralStatus;
}

export interface Referrer {
  id: string;
  name: string;
  referralCount: number;
}

export enum BadgeTier {
  None = "None",
  Bronze = "Bronze",
  Silver = "Silver",
  Gold = "Gold",
  Platinum = "Platinum",
}

export enum BookingStatus {
  Neu = "Neu",
  Bestaetigt = "Bestätigt",
  Abgelehnt = "Abgelehnt",
}

export interface BookingRequest {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  requestedSlot: string;
  submissionDate: string;
  status: BookingStatus;
}