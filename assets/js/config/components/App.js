import React from 'react'
import { useAddEmptyListener, useConfig, useGetTranslations } from '../hooks/useTranslations'
import Filter from './translation/Filter'
import Item from './translation/Item'
import List, { LoadingList } from './translation/List'
import Paginator from './translation/Paginator'

export default function App () {
  const { filters, page, applyFilters, setPage } = useConfig()
  const { isFetching, isLoading, totalCount, translations } = useGetTranslations(filters, page)
  useAddEmptyListener()

  return (
    <div>
      <Filter onSubmit={applyFilters}/>
      {isLoading && <LoadingList/>}
      {!isLoading && (
        <List pagination={<Paginator
          currentPage={page}
          totalCount={totalCount}
          onChange={setPage}
          loading={isFetching}/>
        }>
          {translations.map(translation => (
            <Item key={translation.uuid} translation={translation}/>
          ))}
        </List>
      )}
    </div>
  )
}
