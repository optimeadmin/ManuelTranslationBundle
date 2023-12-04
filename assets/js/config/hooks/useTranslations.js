import axios from 'axios'
import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { v4 as uuid } from 'uuid'
import GlobalsContext, { itemsPerPage } from '../context/GlobalsContext'
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

const getTranslations = async (apiUrl) => {
  const { data, headers } = await axios.get(apiUrl)

  return {
    items: data.map(item => ({ ...item, uuid: item.id })),
    totalCount: headers['x-count'],
  }
}

const getFilterFn = (filters) => {
  const search = (filters?.search ?? '').toLowerCase()
  const domains = (filters?.domains ?? []).filter(d => d.length)
  const frontendDomains = (filters?.frontendDomains ?? []).filter(d => d.length)

  return (item) => {
    if (item.id === null) return true

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

function useGetQueryKey () {
  const { paths: { api: apiUrl } } = useContext(GlobalsContext)

  return ['translations', 'list', apiUrl]
}

export function useConfig () {
  const [filters, setFilters] = useState({
    search: '',
    domains: [],
  })
  const [page, setPage] = useState(1)

  function applyFilters (filters) {
    setFilters(f => ({ ...f, ...filters }))
  }

  return {
    filters,
    page,
    applyFilters,
    setPage,
  }
}

export function useGetTranslations (filters, page) {
  const { paths: { api: apiUrl } } = useContext(GlobalsContext)
  const queryKey = useGetQueryKey()

  const { isLoading, isFetching, data: { items = [] } = {} } = useQuery({
    queryKey,
    queryFn: () => getTranslations(apiUrl),
  })

  let translations = items.filter(getFilterFn(filters))
  const totalCount = translations.length

  const sliceStart = (page - 1) * itemsPerPage
  const sliceEnd = sliceStart + itemsPerPage
  translations = translations.slice(sliceStart, sliceEnd)

  return {
    isLoading,
    isFetching,
    translations,
    totalCount,
  }
}

export function useAddEmptyListener () {
  const queryClient = useQueryClient()
  const queryKey = useGetQueryKey()
  const addEmptyRef = useRef()

  function addEmpty () {
    queryClient.setQueryData(queryKey, ({ items, totalCount }) => {
      return {
        items: [createNewItem(), ...items],
        totalCount,
      }
    })
  }

  useLayoutEffect(() => {
    addEmptyRef.current = addEmpty
  })

  useEffect(() => {
    const addBtn = document.getElementById('add-translation')

    const handleAddClick = (e) => {
      e?.preventDefault()
      addEmptyRef.current()
    }

    addBtn.addEventListener('click', handleAddClick)

    return () => addBtn.removeEventListener('click', handleAddClick)
  }, [addEmptyRef])
}

export function useRemoveEmpty () {
  const queryClient = useQueryClient()
  const queryKey = useGetQueryKey()

  function removeEmpty (item) {
    queryClient.setQueryData(queryKey, ({ items, totalCount }) => {
      return {
        items: items.filter(({ uuid }) => uuid !== item.uuid),
        totalCount,
      }
    })
  }

  return removeEmpty
}
