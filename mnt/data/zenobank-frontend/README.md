# ZenoBank Frontend

Production-grade React + TypeScript + Vite frontend for the ZenoBank microservices banking backend.

## Stack
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- TanStack Query
- Zustand
- React Hook Form
- Zod
- Framer Motion
- Lucide React
- Radix UI
- Recharts
- Sonner

## Run
```bash
npm install
cp .env.example .env
npm run dev
```

## API
Uses API Gateway only:
- Primary: `https://localhost:7000`
- Fallback: `http://localhost:5000`

## Included
- Separate register, login, verify-email flow
- Customer onboarding and KYC upload
- Multi-account management
- Deposit / withdraw / transfer pages
- Loans and notifications
- Admin dashboard + KYC/accounts/customers/transactions/loans management
- Token refresh flow
- Role-based guards
- Global animated neural background system
