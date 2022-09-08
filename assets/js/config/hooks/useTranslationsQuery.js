import { useCallback, useContext, useMemo } from 'react'
import GlobalsContext, { itemsPerPage } from '../context/GlobalsContext'
import axios from 'axios'
import { v4 as uuid } from 'uuid'
import { useQuery, useQueryClient } from 'react-query'
import { getItem } from '../storage/domains'

const createNewItem = () => ({
  id: null,
  uuid: uuid(),
  code: '',
  domain: getItem('translations_default_domain', 'messages'),
  frontendDomains: getItem('translations_default_frontend_domains', []),
  onlyFrontend: false,
  active: true,
  values: {},
})

const getTranslations = (apiUrl) => {
  return axios.get(apiUrl, {
    params: {
      // search: filters?.search || '',
      // domains: (filters?.domains || []).filter(d => d.length > 0),
      // frontendDomains: (filters?.frontendDomains || []).filter(d => d.length > 0),
      // page,
      // perPage: itemsPerPage,
    }
  }).then(({ data, headers }) => {
    return {
      items: data.map(item => ({ ...item, uuid: item.id })),
      totalCount: headers['x-count'],
    }
  })
}

const getFilterFn = (filters) => {
  const search = (filters?.search ?? '').toLowerCase()
  const domains = (filters?.domains ?? []).filter(d => d.length)
  const frontendDomains = (filters?.frontendDomains ?? []).filter(d => d.length)

  return (item) => {
    if (search.length && !item.code.toLowerCase().match(search)) {
      if (!Object.values(item.values).some(value => value.toLowerCase().match(search))) {
        return false
      }
    }

    if (domains.length && !domains.includes(item.domain)) {
      return false
    }

    if (frontendDomains.length && !frontendDomains.some(d => item.frontendDomains.includes(d))) {
      return false
    }

    return true
  }
}

const useTranslationsQuery = (filters, page) => {
  const { paths: { api: apiUrl } } = useContext(GlobalsContext)
  const queryClient = useQueryClient()

  // const queryKey = ['translations', 'list', apiUrl, page, itemsPerPage, filters]
  const queryKey = ['translations', 'list', apiUrl]

  const translationsQuery = useQuery(
    queryKey,
    () => getTranslations(apiUrl, page, itemsPerPage, filters)
  )

  const { isLoading, isFetching, data: { items = [] } = {} } = translationsQuery

  let translations = useMemo(() => items.filter(getFilterFn(filters)), [filters, items])
  const totalCount = translations.length

  translations = useMemo(() => {
    const sliceStart = (page - 1) * itemsPerPage
    const sliceEnd = sliceStart + itemsPerPage
    return translations.slice(sliceStart, sliceEnd)
  }, [page, itemsPerPage, translations])

  const addEmpty = useCallback(() => {
    queryClient.setQueryData(queryKey, ({ items, totalCount }) => {
      return {
        items: [createNewItem(), ...items],
        totalCount,
      }
    })
  }, [queryClient, queryKey])

  const removeEmpty = useCallback((item) => {
    queryClient.setQueryData(queryKey, ({ items, totalCount }) => {
      return {
        items: items.filter(({ uuid }) => uuid !== item.uuid),
        totalCount,
      }
    })
  }, [queryClient, queryKey])

  return {
    isLoading,
    isFetching,
    translations,
    totalCount,
    addEmpty,
    removeEmpty
  }
}

export default useTranslationsQuery
