import { renderHook, act } from '@testing-library/react';
import { useCreateRole } from '@/app/user/projects/hooks/useCreateRole';
import React from 'react';

global.fetch = jest.fn();

const mockUserAuth = {
  accessToken: 'test-token',
};

jest.mock('@/features/context/userContext', () => ({
  useUser: () => ({
    userAuth: mockUserAuth,
  }),
  UserProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('useCreateRole', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with default states', () => {
    const { result } = renderHook(() => useCreateRole());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.createRole).toBe('function');
  });

  it('creates a role successfully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, name: 'Developer' }),
    });

    const { result } = renderHook(() => useCreateRole());

    let success;
    await act(async () => {
      success = await result.current.createRole({
        name: 'Developer',
        description: 'Frontend developer',
        project_id: 1,
      });
    });

    expect(success).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();

    expect(global.fetch).toHaveBeenCalledWith('/api/project-roles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token',
      },
      body: JSON.stringify({
        name: 'Developer',
        description: 'Frontend developer',
        feedback: '',
        project_id: 1,
      }),
    });
  });

  it('handles API error responses', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: async () => ({ message: 'Invalid input' }),
    });

    const { result } = renderHook(() => useCreateRole());

    let success;
    await act(async () => {
      success = await result.current.createRole({
        name: 'Developer',
        description: 'Frontend developer',
        project_id: 1,
      });
    });

    expect(success).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Invalid input');
  });

  it('handles fetch exceptions', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useCreateRole());

    let success;
    await act(async () => {
      success = await result.current.createRole({
        name: 'Developer',
        description: 'Frontend developer',
        project_id: 1,
      });
    });

    expect(success).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Network error');
  });
});
