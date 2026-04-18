export type AccountType = 'Current' | 'Savings';
export type AccountStatus = 'Active' | 'Frozen' | 'Closed';
export type CustomerStatus = 'Active' | 'Suspended' | 'Blocked';
export type KycDocumentStatus = 'Pending' | 'Approved' | 'Rejected';
export type KycDocumentType = 'NationalId' | 'Passport' | 'UtilityBill' | 'Selfie';
export type RiskLevel = 'Low' | 'Medium' | 'High';
export type LoanStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
export type TransactionStatus = 'Pending' | 'Completed' | 'Failed';
export type TransactionType = 'Deposit' | 'Withdraw' | 'Transfer';
export type NotificationType = 'Deposit' | 'Withdraw' | 'Transfer' | 'Security' | 'Account' | 'Loan';

export type CustomerProfile = {
  id: string;
  fullName: string;
  email: string;
  address: string;
  dateOfBirth: string;
  nationality: string;
  occupation: string;
  status: CustomerStatus;
  riskLevel: RiskLevel;
  blacklisted: boolean;
  profileCompleted: boolean;
};

export type KycDocument = {
  id: string;
  customerId: string;
  documentType: KycDocumentType;
  fileName: string;
  status: KycDocumentStatus;
  notes?: string;
  createdAt: string;
};

export type Account = {
  id: string;
  accountNumber: string;
  accountName: string;
  accountType: AccountType;
  status: AccountStatus;
  balance: number;
  currency: string;
  createdAt: string;
};

export type Transaction = {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: string;
  description: string;
  reference: string;
  accountId: string;
  createdAt: string;
};

export type Loan = {
  id: string;
  amount: number;
  termMonths: number;
  purpose: string;
  status: LoanStatus;
  interestRate: number;
  monthlyPayment: number;
  createdAt: string;
};

export type AppNotification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export type DashboardOverview = {
  totalBalance: number;
  accountCount: number;
  activeLoans: number;
  unreadNotifications: number;
  recentTransactions: Transaction[];
};
