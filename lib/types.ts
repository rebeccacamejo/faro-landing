export interface WaitlistConfirmationData {
  referral_code: string;
  position: number;
  total_signups: number;
  referral_count: number;
  pilot_slots_remaining: number;
}

export interface WaitlistStatusData extends WaitlistConfirmationData {
  email: string;
  business: string | null;
}
