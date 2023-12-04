import { useContext, useState } from 'react'
import axios from 'axios'
import GlobalsContext from '../context/GlobalsContext'
import { v4 as uuid } from 'uuid'
import { useQuery } from 'react-query'

const equalItems = (a, b) => (a.code === b.code && a.domain === b.domain)

function useItemsQuery (defaultItems) {
  const { paths: { getMissing }, locales } = useContext(GlobalsContext)

  const { data, isLoading } = useQuery({
    queryKey: ['conflict', 'items', getMissing, locales, defaultItems],
    async queryFn ({}) {
      const search = defaultItems.map(item => ({ code: item.code, domain: item.domain }))

      const { data } = await axios.post(getMissing, search)

      const existsInMissing = (item) => {
        return data?.some(missingItem => equalItems(missingItem, item))
      }

      return defaultItems.filter(existsInMissing).map(item => {
        return {
          ...item,
          id: uuid(),
          values: locales.reduce((localesObj, locale) => ({
            ...localesObj,
            [locale]: item.code,
          }), {}),
        }
      })
    }
  })

  return {
    data,
    isLoading,
  }
}

export default function useItems (defaultItems) {
  const { paths: { getMissing, create: createPath }, locales } = useContext(GlobalsContext)
  const [items, setItems] = useState(null)
  const { data, isLoading } = useItemsQuery(defaultItems)

  function updateItem (id, newItemData) {
    const newItems = [...items]
    const indexToUpdate = newItems.findIndex(item => item.id === id)

    if (indexToUpdate < 0) {
      return
    }

    const item = newItems[indexToUpdate]

    newItems[indexToUpdate] = { ...item, ...newItemData }
    setItems(newItems)
  }

  // async function persistItem (id) {
  //   const itemToPersist = items.find(item => item.id === id)
  //
  //   if (!itemToPersist) {
  //     return
  //   }
  //
  //   await mutate(itemToPersist)
  // }

  return {
    items: items ?? data,
    isLoading,
    updateItem,
    // persistItem,
  }
}
