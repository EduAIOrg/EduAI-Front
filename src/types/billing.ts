export interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string | null;
  features: string[];
  daily_limits: Record<string, number>;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  start_date: string;
  end_date: string;
  plan?: Plan;
}

export interface Payment {
  id: string;
  user_id: string;
  subscription_id: string;
  amount: number;
  currency: string;
  provider: 'stripe' | 'paypal' | 'orange_money' | 'mtn_momo';
  provider_transaction_id: string | null;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at: string;
}

export interface Invoice {
  id: string;
  user_id: string;
  payment_id: string;
  invoice_number: string;
  pdf_url: string | null;
  created_at: string;
}
