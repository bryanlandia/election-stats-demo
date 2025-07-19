import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '@/lib/theme'
import HomePage from '@/app/page'

// Mock the AppRouterCacheProvider since it's not needed for tests
jest.mock('@mui/material-nextjs/v14-appRouter', () => ({
  AppRouterCacheProvider: ({ children }: { children: React.ReactNode }) => children,
}))

// Mock fetch for API calls
global.fetch = jest.fn()

const mockFetch = fetch as jest.MockedFunction<typeof fetch>

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('HomePage', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('renders the main heading', () => {
    // Mock the fetch to return empty elections to avoid API call issues
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: [] }),
    } as Response)

    renderWithTheme(<HomePage />)
    const heading = screen.getByRole('heading', { name: /election stats/i })
    expect(heading).toBeInTheDocument()
  })

  it('renders navigation cards', async () => {
    // Mock the fetch to return empty elections
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: [] }),
    } as Response)

    renderWithTheme(<HomePage />)
    
    // Check for the "All Results" heading specifically
    expect(screen.getByRole('heading', { name: /all results/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /quick access/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /available elections/i })).toBeInTheDocument()
  })

  it('renders action buttons', async () => {
    // Mock the fetch to return empty elections
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: [] }),
    } as Response)

    renderWithTheme(<HomePage />)
    
    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /view all results/i })).toBeInTheDocument()
    })
  })

  it('displays election cards when elections are available', async () => {
    // Mock the fetch to return some election data
    const mockElections = [
      {
        id: '1',
        name: 'Federal General Election 2024',
        date: '2024-11-05',
        stage: 'General',
        jurisdictionId: '3',
        status: 'completed'
      },
      {
        id: '2',
        name: 'New Crampshire General Election 2025',
        date: '2025-07-19',
        stage: 'General',
        jurisdictionId: '1',
        status: 'upcoming'
      }
    ]

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockElections }),
    } as Response)

    renderWithTheme(<HomePage />)
    
    // Wait for elections to load and check if they appear
    await waitFor(() => {
      expect(screen.getByText('Federal General Election 2024')).toBeInTheDocument()
      expect(screen.getByText('New Crampshire General Election 2025')).toBeInTheDocument()
    })

    // Check that the completed election has a "View Results" button
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /view results/i })).toBeInTheDocument()
    })
  })

  it('displays error message when elections fetch fails', async () => {
    // Mock the fetch to return an error
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: false, message: 'Failed to fetch elections' }),
    } as Response)

    renderWithTheme(<HomePage />)
    
    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch elections')).toBeInTheDocument()
    })
  })
})
