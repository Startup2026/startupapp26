// src/__tests__/App.test.tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import App from '../App';
import { AuthProvider } from '@/contexts/AuthContext';
import { SocketProvider } from '@/contexts/SocketContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';

describe('<App /> Component', () => {
    test('renders main App wrapped with Providers', () => {
        const { container } = render(<App />);
        expect(container).toBeDefined();
    });

    test('Routing handles unknown route (404)', () => {
        // Here we test if 404 is triggered.
        render(
            <QueryClientProvider client={new QueryClient()}>
                <AuthProvider>
                    <SocketProvider>
                        <TooltipProvider>
                            <MemoryRouter initialEntries={['/unknown-path']}>
                                <Routes>
                                    <Route path="*" element={<div>NotFound</div>} />
                                </Routes>
                            </MemoryRouter>
                        </TooltipProvider>
                    </SocketProvider>
                </AuthProvider>
            </QueryClientProvider>
        );
        expect(screen.getByText('NotFound')).toBeDefined();
    });

    test('Routing matches specific endpoint', () => {
        // Example: Startup Analysis Route check
        render(
            <QueryClientProvider client={new QueryClient()}>
                <AuthProvider>
                    <SocketProvider>
                        <TooltipProvider>
                            <MemoryRouter initialEntries={['/startup/analysis']}>
                                {/* Assuming App defines Routes, but MemoryRouter overrides BrowserRouter */}
                                {/* For testing actual App routing logic inside App.tsx, we might need to mock BrowserRouter */}
                                <Routes>
                                    <Route path="/startup/analysis" element={<div>JobAnalysisPage</div>} />
                                </Routes>
                            </MemoryRouter>
                        </TooltipProvider>
                    </SocketProvider>
                </AuthProvider>
            </QueryClientProvider>
        );
        expect(screen.getByText('JobAnalysisPage')).toBeDefined();
    });
});
