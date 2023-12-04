import React from 'react'
import { LoadingItem } from './Item'
import { LoadingPaginator } from './Paginator'

export default function List ({ pagination, children }) {
  return (
    <div>
      {pagination}

      {children}

      {pagination}
    </div>
  )
}

const LoadingList = () => {
  return (
    <div>
      <LoadingPaginator />

      <LoadingItem />
      <LoadingItem />
      <LoadingItem />

      <LoadingPaginator />
    </div>
  )
}

export { LoadingList }
