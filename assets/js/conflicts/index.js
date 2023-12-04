import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/App'
import { QueryClient, QueryClientProvider } from 'react-query'

const container = document.getElementById('resolve-conflicts-container')
const items = JSON.parse(container.dataset.items || '[]')
const resolveConflictsPath = container.dataset.endpoint || ''

console.log(items)

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
      <App defaultItems={items} endpoint={resolveConflictsPath} />
    </QueryClientProvider>
  </React.StrictMode>
)
