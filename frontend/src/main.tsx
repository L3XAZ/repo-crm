import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import { AuthProvider } from './providers/AuthProvider';
import { QueryProvider } from './providers/QueryProvider';
import { ThemeProvider } from './providers/ThemeProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryProvider>
            <AuthProvider>
                <ThemeProvider>
                    <App />
                </ThemeProvider>
            </AuthProvider>
        </QueryProvider>
    </React.StrictMode>
);
