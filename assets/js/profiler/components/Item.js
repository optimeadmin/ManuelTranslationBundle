import React from 'react'
import { useForm } from 'react-hook-form'
import { useMutateItem } from '../hooks/useMutateItem'

const STATUS_EDITING = 'editing'
const STATUS_PERSISTING = 'persisting'
const STATUS_PERSISTED = 'persisted'

const persistButtonLabel = (status) => {
  switch (status) {
  case STATUS_PERSISTING:
    return 'Persisting...!!!'
  case STATUS_PERSISTED:
    return 'DONE'
  default:
    return 'Create'
  }
}

export default function Item ({ item }) {
  const parameters = Array.from(Object.keys(item.parameters))
  const valuesMap = Object.keys(item.values)

  const { isMutating, isSuccess, error, save } = useMutateItem()
  const { register, handleSubmit } = useForm({ values: item })
  let status = STATUS_EDITING

  if (isSuccess) {
    status = STATUS_PERSISTED
  } else if (isMutating) {
    status = STATUS_PERSISTING
  } else if (error) {
    status = 'error'
  }

  return (
    <form onSubmit={handleSubmit(save)} className={`translation-item-creator ${status}`}>
      {error && <div className={`message ${status}`}>{error}</div>}

      <div className="item-data">
        <div>Code<span>{item.code}</span></div>
        <div>Domain<span>{item.domain}</span></div>
        {parameters.length > 0 && <Parameters parameters={parameters}/>}
      </div>

      <div className="item-values">
        {valuesMap.map(locale => (
          <LocaleValue key={locale} locale={locale} register={register} isMutating={isMutating}/>
        ))}
      </div>
      <div className="item-actions">
        <div className="btn-container">
          <button type='submit' disabled={isMutating}>
            {persistButtonLabel(status)}
          </button>
        </div>
      </div>
    </form>
  )
}

function Parameters ({ parameters }) {
  return (
    <div>
      Parameters
      <span className="item-parameters">
        {parameters.map((p, key) => (<span key={key}>{p}</span>))}
      </span>
    </div>
  )
}

function LocaleValue ({ locale, register, isMutating }) {
  return (
    <div>
      <span>{locale}</span>
      <textarea {...register(`values[${locale}]`)} disabled={isMutating}/>
    </div>
  )
}
