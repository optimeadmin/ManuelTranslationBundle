import React, { useState } from 'react'
import { Card, Placeholder } from 'react-bootstrap'
import ItemForm from './ItemForm'
import ItemText from './ItemText'

const Item = ({ translation, removeEmptyItem }) => {
  const [editing, setEditing] = useState(false)
  const showForm = editing || !translation.id

  const handleEditClick = () => setEditing(true)
  const handleCloseFormClick = () => {
    if (!translation.id) {
      removeEmptyItem(translation)
    }
    setEditing(false)
  }

  const handleEditToggle = () => {
    setEditing(editing => !editing)
  }

  return (
    <div className={`translation-item mb-2 ${translation.active ? '' : 'inactive'}`}>
      {showForm
        ? <ItemForm
          item={translation}
          handleClose={handleCloseFormClick}
          handleEditToggle={handleEditToggle}
        />
        : <ItemText
          item={translation}
          handleEdit={handleEditClick}
          handleEditToggle={handleEditToggle}
        />
      }
    </div>
  )
}

const LoadingItem = () => {
  return (
    <div className="translation-item mb-2">
      <Card>
        <Card.Header>
          <div className="row align-items-center">

            <Card.Title className="col-md-7 m-0">
              <Placeholder xs={7}/>
            </Card.Title>

            <div className="col-md-3 text-muted text-end">
              <Placeholder xs={11}/>
            </div>
            <div className="col-md-2 text-end">
              <Placeholder xs={11}/>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="row align-items-start">
            <div className="col-md-10 col-lg-11">
              <div className="d-flex gap-2 mb-3">
                <Placeholder className="pb-4" xs={1}/>
                <Placeholder className="pb-4" xs={11}/>
              </div>
              <div className="d-flex gap-2 mb-3">
                <Placeholder className="pb-4" xs={1}/>
                <Placeholder className="pb-4" xs={11}/>
              </div>
              <div className="d-flex gap-2 mb-0">
                <Placeholder className="pb-4" xs={1}/>
                <Placeholder className="pb-4" xs={11}/>
              </div>
            </div>
            <div className="d-grid gap-2 col-md-2 col-lg-1">
              <Placeholder.Button xs={12}/>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

export { LoadingItem }
export default React.memo(Item)
