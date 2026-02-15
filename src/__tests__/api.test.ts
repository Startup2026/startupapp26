// src/__tests__/api.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiFetch, getAuthToken, setAuthToken, clearAuthToken, API_BASE_URL } from '../lib/api';

describe('Frontend API Client', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        global.fetch = vi.fn();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should correctly store/retrieve/clear auth token', () => {
        setAuthToken('test-token-value');
        expect(getAuthToken()).toBe('test-token-value');
        clearAuthToken();
        expect(getAuthToken()).toBeNull();
    });

    it('should attach Authorization header when token is present', async () => {
        setAuthToken('test-token');
        (global.fetch as any).mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => ({ success: true })
        });

        await apiFetch('/test-endpoint');

        expect(global.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/test-endpoint`, expect.objectContaining({
            headers: expect.objectContaining({
                'Authorization': 'Bearer test-token'
            })
        }));
    });

    it('should include credentials: "include" for cookies', async () => {
        await apiFetch('/public-endpoint');
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/public-endpoint'), expect.objectContaining({
            credentials: 'include' 
        }));
    });

    it('handles successful API response', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => ({ data: 'success' })
        });

        const res = await apiFetch('/success');
        expect(res).toEqual({ data: 'success', status: 200, success: true });
    });

    it('handles API errors (401)', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: false,
            status: 401,
            json: async () => ({ error: 'Unauthorized' })
        });

        const res = await apiFetch('/protected');
        expect(res).toEqual({ 
            success: false, 
            error: 'Unauthorized', 
            status: 401 
        });
    });

    it('should not warn on public routes even if token is missing', async () => {
        const consoleSpy = vi.spyOn(console, 'warn');
        await apiFetch('/auth/login');
        expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining('No auth_token found'));
    });
});
