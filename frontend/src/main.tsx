import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || '1066532454641-k30tq6k2f1p8omph9qskpl1q9q0p8vj8.apps.googleusercontent.com'}>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            className: 'custom-toast',
            success: {
              className: 'custom-toast custom-toast-success',
              iconTheme: { primary: '#D4AF37', secondary: '#1C110B' },
            },
            error: {
              className: 'custom-toast custom-toast-error',
              iconTheme: { primary: '#E07A5F', secondary: '#1C110B' },
            },
          }}
        />
        </QueryClientProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
