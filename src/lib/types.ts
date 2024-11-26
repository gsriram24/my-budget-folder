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
export interface Expense {
  id: string;
  title: string;
  amount: number;
  envelope: string;
  envelopeName: string;
  date: string;
}
