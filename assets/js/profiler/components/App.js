import React, { useContext } from 'react'
import Item from './Item'
import GlobalsContext from '../context/GlobalsContext'
import useItems from '../hooks/useItems'

const App = ({ items: defaultItems }) => {
  const { items, updateItem, isLoading } = useItems(defaultItems)
  const { paths } = useContext(GlobalsContext)

  const handleChange = (id, itemData) => {
    updateItem(id, itemData)
  }

  return (
    <div className="missing-translations-creator">
      <header className="flex items-center">
        <h2>Create Missing Translations</h2>
        <a href={paths.list}>Translations List</a>
      </header>

      {isLoading && <div><h3>Loading....!</h3></div>}
      {!isLoading && (
        <div>
          {items.map(item => (
            <Item
              key={item.id}
              item={item}
              onChange={handleChange}
              // onSubmit={persistItem}
            />
          ))}

          {items.length === 0 && (
            <div className="no-items-container">
              <h4>No Missing Items</h4>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App
