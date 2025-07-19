import HomePage from '@/app/page';
import { theme } from '@/lib/theme';
import { ThemeProvider } from '@mui/material/styles';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';

// Mock the AppRouterCacheProvider since it's not needed for tests
jest.mock('@mui/material-nextjs/v14-appRouter', () => ({
  AppRouterCacheProvider: ({ children }: { children: React.ReactNode }) =>
    children,
}));

// Mock fetch for API calls
global.fetch = jest.fn();

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('HomePage', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('renders the main heading', () => {
    // Mock the fetch to return empty elections to avoid API call issues
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: [] }),
    } as Response);

    renderWithTheme(<HomePage />);
    const heading = screen.getByRole('heading', { name: /election stats/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders search form with tabs', async () => {
    // Mock all the API calls
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: [] }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: [] }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: [] }),
      } as Response);

    renderWithTheme(<HomePage />);

    // Check for the search form heading
    expect(
      screen.getByRole('heading', { name: /search by/i })
    ).toBeInTheDocument();

    // Check for the tabs
    expect(
      screen.getByRole('tab', { name: /year range/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('tab', { name: /election dates/i })
    ).toBeInTheDocument();
  });

  it('renders year range slider', async () => {
    // Mock all the API calls
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: [] }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: [] }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: [] }),
      } as Response);

    renderWithTheme(<HomePage />);

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.getAllByRole('slider')).toHaveLength(2); // Range slider has 2 inputs
    });
  });

  it('displays election cards when elections are available', async () => {
    // Mock the fetch to return some election data
    const mockElections = [
      {
        id: '1',
        name: 'Federal General Election 2024',
        date: '2024-11-05',
        stage: 'General',
        jurisdictionId: '3',
        status: 'completed',
      },
      {
        id: '2',
        name: 'New Crampshire General Election 2025',
        date: '2025-07-19',
        stage: 'General',
        jurisdictionId: '1',
        status: 'upcoming',
      },
    ];

    // Mock all the API calls
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockElections }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: [] }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: [] }),
      } as Response);

    renderWithTheme(<HomePage />);

    // Wait for elections to load and check if they appear
    await waitFor(() => {
      expect(
        screen.getByText('Federal General Election 2024')
      ).toBeInTheDocument();
      expect(
        screen.getByText('New Crampshire General Election 2025')
      ).toBeInTheDocument();
    });

    // Check that the View Results buttons appear
    await waitFor(() => {
      expect(
        screen.getAllByRole('link', { name: /view results/i })
      ).toHaveLength(2);
    });
  });

  it('displays error message when elections fetch fails', async () => {
    // Mock the fetch to reject (network error)
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    renderWithTheme(<HomePage />);

    // Wait for error message to appear
    await waitFor(() => {
      expect(
        screen.getByText('Failed to fetch election data')
      ).toBeInTheDocument();
    });
  });
});
