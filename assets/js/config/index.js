import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/App'
import { GlobalsProvider } from './context/GlobalsContext'

const container = document.getElementById('translations-configuration')
const paths = JSON.parse(container.dataset.paths || '{}')
const locales = JSON.parse(container.dataset.locales || '[]')
const domains = JSON.parse(container.dataset.domains || '[]')
const frontendDomains = JSON.parse(container.dataset.frontendDomains || '[]')

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    }
  }
})

const root = createRoot(container)

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <GlobalsProvider
        paths={paths}
        domains={domains}
        frontendDomains={frontendDomains}
        locales={locales}>
        <App />
      </GlobalsProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
