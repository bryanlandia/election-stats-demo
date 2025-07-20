import HomePage from '@/app/page';
import { theme } from '@/lib/theme';
import { ThemeProvider } from '@mui/material/styles';
import '@testing-library/jest-dom';
import { act, render, screen, waitFor } from '@testing-library/react';

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

  it('renders the main heading', async () => {
    // Mock all 9 API calls to avoid API call issues (now includes parties and tickets)
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
      } as Response)
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
      } as Response)
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

    await act(async () => {
      renderWithTheme(<HomePage />);
    });

    const heading = screen.getByRole('heading', { name: /election stats/i });
    expect(heading).toBeInTheDocument();

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });

  it('renders search form with mode toggle', async () => {
    // Mock all 7 API calls
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
      } as Response)
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
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: [] }),
      } as Response);

    await act(async () => {
      renderWithTheme(<HomePage />);
    });

    // Check for the search form heading
    expect(
      screen.getByRole('heading', { name: /search by/i })
    ).toBeInTheDocument();

    // Check for the mode toggle tabs (only year range and election dates)
    expect(
      screen.getByRole('tab', { name: /year range/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('tab', { name: /election dates/i })
    ).toBeInTheDocument();

    // Check that contest and ballot question filters are visible (enabled by default)
    expect(screen.getByText(/search for contests/i)).toBeInTheDocument();
    expect(
      screen.getByText(/search for ballot questions/i)
    ).toBeInTheDocument();

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });

  it('renders year range slider', async () => {
    // Mock all 7 API calls
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
      } as Response)
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
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: [] }),
      } as Response);

    await act(async () => {
      renderWithTheme(<HomePage />);
    });

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.getAllByRole('slider')).toHaveLength(2); // Range slider has 2 inputs
    });
  });

  it('displays contest cards when contests are available', async () => {
    // Mock the fetch to return some contest data
    const mockElections = [
      {
        id: '1',
        name: 'Federal General Election 2024 - God-Emperor',
        date: '2024-11-05',
        stage: 'General Election',
        jurisdictionId: '3',
        officeId: '1',
        status: 'completed',
      },
    ];

    const mockContests = [
      {
        id: '1',
        electionId: '1',
        jurisdictionId: '3',
        name: 'God-Emperor of the United States',
        isPartisan: true,
        isTicketBased: false,
        candidates: [
          {
            id: '1',
            name: 'Martha Stewart',
            partyId: '1',
            position: 'God-Emperor',
          },
          {
            id: '3',
            name: 'Joaquin Phoenix',
            partyId: '2',
            position: 'God-Emperor',
          },
        ],
      },
    ];

    const mockOffices = [
      {
        id: '1',
        name: 'God-Emperor of the United States',
        description: 'The highest executive office',
        jurisdictionId: '3',
        isElected: true,
        termLength: 4,
        maxTerms: 2,
      },
    ];

    const mockJurisdictions = [
      {
        id: '3',
        name: 'United States Federal Government',
        registeredVoters: 240000000,
        partisanContestTypes: ['God-Emperor'],
        nonPartisanContestTypes: [],
      },
    ];

    // Mock all 9 API calls that the component makes initially, plus results calls
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockElections }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockContests }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: [] }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockOffices }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockJurisdictions }),
      } as Response)
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
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: [] }),
      } as Response)
      // Mock results calls for each election
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            contestResults: [],
            ballotQuestionResults: [],
            totalVotes: 1000,
            reportingPercentage: 100,
          },
        }),
      } as Response);

    await act(async () => {
      renderWithTheme(<HomePage />);
    });

    // Wait for results to load and check if the results section appears
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /results \(\d+\)/i })
      ).toBeInTheDocument();
    });

    // Check that a contest card appears
    await waitFor(() => {
      expect(screen.getByText('Partisan')).toBeInTheDocument();
    });

    // Check that the contest card shows election information and results
    await waitFor(() => {
      expect(
        screen.getByText('God-Emperor of the United States')
      ).toBeInTheDocument();
    });
  });

  it('displays error message when elections fetch fails', async () => {
    // Mock the fetch to reject (network error)
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    await act(async () => {
      renderWithTheme(<HomePage />);
    });

    // Wait for error message to appear
    await waitFor(() => {
      expect(
        screen.getByText('Failed to fetch election data')
      ).toBeInTheDocument();
    });
  });
});
