import axios from 'axios'
import { useContext } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import GlobalsContext from '../context/GlobalsContext'
import { setItem, setLocalItem } from '../storage/domains'

const persistTranslation = (apiUrl, item) => {
  const method = item.id ? axios.put : axios.post
  const url = item.id ? apiUrl + '/' + item.id : apiUrl

  return method(url, {
    ...item,
    lastChanged: 'local',
  })
}

const useMutateItem = () => {
  const { paths: { api }, addDomain, addFrontendDomain } = useContext(GlobalsContext)
  const queryClient = useQueryClient()

  const { isLoading, mutateAsync } = useMutation({
    mutationFn: (item) => persistTranslation(api, item),
    async onSuccess ({ data }) {
      const queryKeyFilter = ['translations', 'list']

      data?.domain && addDomain(data.domain)
      data?.frontendDomains?.forEach(addFrontendDomain)

      data?.domain && setItem('translations_default_domain', data.domain)
      data?.frontendDomains && setLocalItem(
        'translations_default_frontend_domains',
        data.frontendDomains
      )

      await queryClient.invalidateQueries(queryKeyFilter)
    }
  })

  return {
    save: mutateAsync,
    isLoading,
  }
}

export default useMutateItem
