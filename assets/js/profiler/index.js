import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/App'
import { GlobalsProvider } from './context/GlobalsContext'
import { QueryClient, QueryClientProvider } from 'react-query'

(() => {
  if (!missingTranslations) {
    return
  }
  console.log('Aja')

  const tabContents = document.querySelectorAll('.sf-tabs .tab-content')

  if (tabContents.length === 0) {
    return
  }

  const tabContent = [...tabContents].pop()

  if (!tabContent) {
    return
  }

  const reactContainer = document.createElement('div')
  tabContent.appendChild(reactContainer)

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      }
    }
  })

  const reactRoot = createRoot(reactContainer)
  reactRoot.render(
    <React.StrictMode>
      <GlobalsProvider locales={translationsLocales} paths={translationsPath}>
        <QueryClientProvider client={queryClient}>
          <App items={missingTranslations}/>
        </QueryClientProvider>
      </GlobalsProvider>
    </React.StrictMode>
  )
})()
