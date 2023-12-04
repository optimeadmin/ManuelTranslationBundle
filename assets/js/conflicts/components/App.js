import React, { useState } from 'react'
import ConflictItem from './ConflictItem'
import { Button } from 'react-bootstrap'
import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const buildSelected = (item, type) => {
  return {
    ...item[type] || {},
    id: item.database.id || null,
    applyFor: type,
    hash: item.hash,
  }
}

export default function App ({ defaultItems, endpoint }) {
  const { items } = useGetItems(defaultItems)
  const { isMutating, save } = useSave(endpoint, items)

  const [selectedItems, setSelectedItems] = useState([])

  function changeSelectAll (type) {
    setSelectedItems(['file', 'database'].includes(type) ? items.map(item => buildSelected(item, type)) : [])
  }

  const handleSelectAllFileClick = () => changeSelectAll('file')
  const handleSelectAllDatabaseClick = () => changeSelectAll('database')
  const handleClearAllClick = () => changeSelectAll('none')

  async function handleApplyClick () {
    await save(selectedItems)

    setSelectedItems([])
  }

  const handleItemSelectionChange = (item, selectionType) => {
    if (!['file', 'database', 'none'].includes(selectionType)) {
      return
    }

    setSelectedItems(oldSelected => {
      const currentItemId = item.database.id
      const newItems = oldSelected.filter(item => item.id !== currentItemId)

      if (selectionType === 'none') {
        return newItems
      }

      newItems.push(buildSelected(item, selectionType))

      return newItems
    })
  }

  const itemSelectionType = (item) => {
    const itemId = item.database.id

    return selectedItems.find(({ id }) => id === itemId)?.applyFor || 'none'
  }

  const selectedItemsCount = selectedItems.length

  if (!items || items.length === 0) {
    return null
  }

  return (
    <div>
      <h2>Conflict Items</h2>

      <div className="mb-2 d-flex align-items-center">
        <Button
          size="lg"
          className="px-4"
          onClick={handleApplyClick}
          disabled={selectedItemsCount === 0 || isMutating}
        >Apply {isMutating && <Spinner />}</Button>
        <div className="ms-auto d-flex gap-2">
          <Button
            onClick={handleSelectAllFileClick}
            variant="outline-secondary"
          >Select All File</Button>
          <Button
            onClick={handleSelectAllDatabaseClick}
            variant="outline-secondary"
          >Select All Database</Button>
          <Button
            onClick={handleClearAllClick}
            variant="outline-secondary"
          >Clear All</Button>
        </div>
      </div>

      {items.map(item => (
        <ConflictItem
          key={item.hash}
          item={item}
          currentSelectType={itemSelectionType(item)}
          onSelectionChange={
            (selectionType) => handleItemSelectionChange(item, selectionType)
          }
        />
      ))}
    </div>
  )
}

const Spinner = () => (
  <div className="spinner-border spinner-border-sm">
    <span className="visually-hidden">Loading...</span>
  </div>
)

function useGetItems (defaultItems) {
  const { data } = useQuery({
    queryKey: ['conflict', 'items'],
    queryFn: () => defaultItems,
    staleTime: Infinity,
    placeholderData: defaultItems,
  })

  return {
    items: data,
  }
}

function useSave (endpoint, items) {
  const queryClient = useQueryClient()

  const { mutateAsync, isLoading: isMutating } = useMutation({
    async mutationFn (selectedItems) {
      const finished = items.length === selectedItems.length
      const itemsToSend = selectedItems.map(item => ({
        ...item,
        applyFor: item.applyFor === 'database' ? 'local' : item.applyFor,
      }))

      await axios.post(endpoint, {
        items: itemsToSend,
        finished,
      })

      return selectedItems
    },
    onSuccess (selectedItems) {
      queryClient.setQueryData(['conflict', 'items'], items => items.filter(({ database }) => (
        !selectedItems.some(({ id }) => id === database.id)
      )))
    }
  })

  return {
    save: mutateAsync,
    isMutating,
  }
}
