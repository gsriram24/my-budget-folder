export interface Envelope {
  id: string;
  name: string;
  allocated_amount: number;
  monthlySpend: number;
}
export interface Income {
  id: string;
  name: string;
  amount: number;
  recurring: boolean;
}
