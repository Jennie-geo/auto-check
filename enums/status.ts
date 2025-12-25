export const LoanStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

export type LoanStatus = (typeof LoanStatus)[keyof typeof LoanStatus];
