import React, { useId } from 'react'
import FrontendDomainsField from './FrontendDomainsField'
import { Form } from 'react-bootstrap'

const FrontendFields = ({
  frontendDomains,
  onlyFrontend,
  handleEdit: setData = null,
  isEdit = false,
}) => {
  const id = useId()

  const handleFrontendDomainsChange = (frontendDomains) => {
    setData && setData({ frontendDomains })
  }

  const handleOnlyFrontendChange = ({ target }) => {
    setData && setData({ onlyFrontend: target.checked })
  }

  return (
    <div className={`row border-top mt-2 pt-2 align-items-center text-muted ${isEdit ? '' : 'opacity-50'}`}>
      <div className="col-md-7 d-flex gap-1 align-items-center">
        <b>Frontend Domains:</b>{' '}
        {isEdit && (
          <FrontendDomainsField
            values={frontendDomains}
            selectDomains={handleFrontendDomainsChange}
          />
        )}
        {!isEdit && frontendDomains?.join(', ') || 'NONE'}
      </div>
      <div className="col-md-5 d-flex gap-1 align-items-center">
        <label className="fw-bold" htmlFor={`form-${id}-only-frontend`}>FrontEnd Only:</label>{' '}
        {isEdit && (
          <Form.Check
            name={`form-only-frontend-${id}`}
            id={`form-${id}-only-frontend`}
            checked={onlyFrontend}
            onChange={handleOnlyFrontendChange}
          />
        )}
        {!isEdit && (onlyFrontend ? 'Yes' : 'No')}
      </div>
    </div>
  )
}

export default FrontendFields
