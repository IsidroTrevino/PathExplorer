import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { UserProvider, useUser } from '@/features/context/userContext';
import Cookies from 'js-cookie';

jest.mock('js-cookie', () => ({
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
}));

global.fetch = jest.fn();

const TestComponent = ({ testId = 'test-component' }: { testId?: string }) => {
  const userContext = useUser();
  return (
    <div data-testid={testId}>
      <div data-testid="auth-status">{userContext.isAuthenticated ? 'authenticated' : 'not-authenticated'}</div>
      <div data-testid="loading-status">{userContext.isLoading ? 'loading' : 'not-loading'}</div>
      <div data-testid="initializing-status">{userContext.isInitializing ? 'initializing' : 'initialized'}</div>
      <div data-testid="error-status">{userContext.error || 'no-error'}</div>
      <div data-testid="user-id">{userContext.userDetails?.id || 'no-id'}</div>
      <div data-testid="user-name">{userContext.userDetails?.name || 'no-name'}</div>
      <div data-testid="user-role">{userContext.userDetails?.role || 'no-role'}</div>
      <button
        data-testid="login-button"
        onClick={() => userContext.setUserAuth({
          userId: 123,
          accessToken: 'test-token',
          tokenType: 'Bearer',
        })}
      >
                Login
      </button>
      <button
        data-testid="fetch-details-button"
        onClick={() => userContext.fetchUserDetails('test-token')}
      >
                Fetch Details
      </button>
      <button
        data-testid="logout-button"
        onClick={userContext.logout}
      >
                Logout
      </button>
    </div>
  );
};

describe('UserContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (Cookies.get as jest.Mock).mockReturnValue(null);
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 123,
        name: 'John',
        employee_id: 456,
        email: 'john@example.com',
        last_name_1: 'Doe',
        last_name_2: 'Smith',
        phone_number: '1234567890',
        location: 'Remote',
        capability: 'Engineering',
        position: 'Developer',
        seniority: 3,
        role: 'admin',
      }),
    });
  });

  it('provides the initial context state correctly', async () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('initializing-status')).toHaveTextContent('initialized');
    });

    expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
    expect(screen.getByTestId('loading-status')).toHaveTextContent('not-loading');
    expect(screen.getByTestId('error-status')).toHaveTextContent('no-error');
  });

  it('loads stored auth data from cookies on initialization', async () => {
    const storedAuth = {
      userId: 123,
      accessToken: 'saved-token',
      tokenType: 'Bearer',
    };

    (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify(storedAuth));

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/my-info', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer saved-token',
      },
    });
  });

  it('handles invalid stored auth data gracefully', async () => {
    (Cookies.get as jest.Mock).mockReturnValue('invalid-json');

    console.error = jest.fn();

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('initializing-status')).toHaveTextContent('initialized');
    });

    expect(console.error).toHaveBeenCalled();
    expect(Cookies.remove).toHaveBeenCalledWith('userAuthToken');
    expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
  });

  it('updates auth state when setUserAuth is called', async () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('initializing-status')).toHaveTextContent('initialized');
    });

    expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');

    await act(async () => {
      screen.getByTestId('login-button').click();
    });

    expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');

    expect(Cookies.set).toHaveBeenCalledWith(
      'userAuthToken',
      JSON.stringify({
        userId: 123,
        accessToken: 'test-token',
        tokenType: 'Bearer',
      }),
      { expires: 1 },
    );
  });

  it('fetches user details successfully', async () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('initializing-status')).toHaveTextContent('initialized');
    });

    await act(async () => {
      screen.getByTestId('fetch-details-button').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('user-id')).toHaveTextContent('123');
      expect(screen.getByTestId('user-name')).toHaveTextContent('John');
      expect(screen.getByTestId('user-role')).toHaveTextContent('admin');
    });

    expect(Cookies.set).toHaveBeenCalledWith('userRole', 'admin', { expires: 1 });
  });

  it('handles fetch user details errors', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
    });

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('initializing-status')).toHaveTextContent('initialized');
    });

    await act(async () => {
      screen.getByTestId('fetch-details-button').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('error-status')).toHaveTextContent('Failed to fetch user details');
    });
  });

  it('handles fetch network errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('initializing-status')).toHaveTextContent('initialized');
    });

    await act(async () => {
      screen.getByTestId('fetch-details-button').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('error-status')).toHaveTextContent('Network error');
    });
  });

  it('handles logout correctly', async () => {
    (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify({
      userId: 123,
      accessToken: 'token',
      tokenType: 'Bearer',
    }));

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
    });

    await act(async () => {
      screen.getByTestId('logout-button').click();
    });

    expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
    expect(Cookies.remove).toHaveBeenCalledWith('userAuthToken');
  });

  it('throws error when useUser is used outside UserProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useUser must be used within a UserProvider');

    consoleError.mockRestore();
  });

  it('processes user details correctly', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 123,
      }),
    });

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('initializing-status')).toHaveTextContent('initialized');
    });

    await act(async () => {
      screen.getByTestId('fetch-details-button').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('user-id')).toHaveTextContent('123');
      expect(screen.getByTestId('user-name')).toHaveTextContent('no-name');
      expect(screen.getByTestId('user-role')).toHaveTextContent('no-role');
    });
  });
});
