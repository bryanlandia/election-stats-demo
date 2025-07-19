import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '@/lib/theme'
import HomePage from '@/app/page'

// Mock the AppRouterCacheProvider since it's not needed for tests
jest.mock('@mui/material-nextjs/v14-appRouter', () => ({
  AppRouterCacheProvider: ({ children }: { children: React.ReactNode }) => children,
}))

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('HomePage', () => {
  it('renders the main heading', () => {
    renderWithTheme(<HomePage />)
    const heading = screen.getByRole('heading', { name: /election stats/i })
    expect(heading).toBeInTheDocument()
  })

  it('renders navigation cards', () => {
    renderWithTheme(<HomePage />)
    expect(screen.getByText(/live results/i)).toBeInTheDocument()
  })

  it('renders action buttons', () => {
    renderWithTheme(<HomePage />)
    expect(screen.getByRole('link', { name: /view results/i })).toBeInTheDocument()
  })
})
