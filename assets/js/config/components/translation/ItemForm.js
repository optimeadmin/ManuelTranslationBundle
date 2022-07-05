import React, { useContext, useState } from 'react'
import GlobalsContext from '../../context/GlobalsContext'
import useMutateItem from '../../hooks/useMutateItem'
import useTranslationValidator from '../../hooks/useTranslationValidator'
import { Button, Card, Form } from 'react-bootstrap'
import DomainField from './DomainField'
import Icon from '../Icon'
import FrontendFields from './FrontendFields'

const getFormValues = (defaultLocales, item) => {
    const itemValues = { ...item?.values || {} }
    const values = {}

    defaultLocales.forEach(locale => {
        values[locale] = itemValues[locale] || ''
    })

    return { ...values, ...itemValues }
}

const ItemForm = ({ item, handleClose, handleEditToggle }) => {
    const { booleanLabel, locales: defaultLocales } = useContext(GlobalsContext)

    const { save: saveItem, isLoading } = useMutateItem()

    const [formData, setFormData] = useState(() => ({
        code: item.code,
        domain: item.domain,
        frontendDomains: item.frontendDomains ?? [],
        onlyFrontend: item.onlyFrontend ?? false,
        values: getFormValues(defaultLocales, item),
    }))
    const [showErrors, setShowErrors] = useState(false)
    const { valid, errors } = useTranslationValidator(formData)
    const isNew = !item.id

    const update = (data) => setFormData(oldData => ({ ...oldData, ...data }))

    const handleCodeChange = (e) => {
        if (isNew) {
            update({ code: e.target.value })
        }
    }

    const handleDomainChange = (domain) => {
        if (isNew) {
            update({ domain })
        }
    }

    const handleValueChange = (locale, e) => {
        const newValues = { ...formData.values }
        newValues[locale] = e.target.value
        update({ values: newValues })
    }

    const save = (formData) => {
        saveItem({ ...item, ...formData }).then(() => handleClose())
    }

    const handleDeactivateClick = () => save({ active: false })
    const handleActivateClick = () => save({ active: true })

    const handleSaveClick = () => {
        if (valid) {
            save(formData)
        } else {
            setShowErrors(true)
        }
    }

    return (
        <Card>
            <Card.Header onClick={isNew ? null : handleEditToggle} role="button">
                <div className="row align-items-center">
                    <div className="col-md-5 m-0 d-flex">
                        {isNew
                            ?
                            <Form.Control
                                value={formData.code}
                                onChange={handleCodeChange}
                                size="sm"
                                disabled={!isNew}
                            />
                            : formData.code
                        }
                        {isLoading && <span className="ms-3">Loading...!</span>}
                    </div>
                    <div className="col-md-4 text-muted text-end">
                        <div className="d-flex align-items-center justify-content-end gap-1">
                            <b>Domain: </b>
                            {isNew
                                ? (
                                    <DomainField
                                        value={formData.domain}
                                        disabled={!isNew}
                                        selectDomain={handleDomainChange}
                                    />
                                ) : (
                                    formData.domain
                                )
                            }
                        </div>
                    </div>
                    <div className="col-md-3 text-end">
                        <b>Active:</b> {booleanLabel(item.active)}
                    </div>
                </div>
            </Card.Header>
            <Card.Body>
                <div className="row align-items-start">
                    <div className="col-md-10">
                        {Object.entries(formData.values).map(([locale, value]) => (
                            <div key={locale} className="d-flex mb-2">
                                <div className="me-2 mt-1 text-end" style={{ minWidth: 25 }}>{locale}</div>
                                <Form.Control
                                    as="textarea"
                                    value={value}
                                    onChange={e => handleValueChange(locale, e)}
                                    size="sm"
                                />
                            </div>
                        ))}

                        <FrontendFields
                            frontendDomains={formData.frontendDomains}
                            onlyFrontend={formData.onlyFrontend}
                            isEdit
                            handleEdit={update}
                        />
                    </div>
                    <div className="d-grid gap-2 col-md-2">
                        <Button variant="primary" onClick={handleSaveClick}><Icon icon="save"/>Save</Button>
                        <Button variant="danger" onClick={handleClose}><Icon icon="x"/>Cancel</Button>

                        <hr/>

                        {!isNew && (
                            item.active
                                ? <Button size="sm" variant="warning" onClick={handleDeactivateClick}>
                                    <Icon icon="trash"/>Deactivate
                                </Button>
                                : <Button size="sm" variant="success" onClick={handleActivateClick}>
                                    <Icon icon="check-circle"/>Activate
                                </Button>
                        )}
                    </div>
                </div>
                {showErrors ? <ItemFormErrors errors={errors}/> : null}
            </Card.Body>
        </Card>
    )
}

export default ItemForm

const ItemFormErrors = ({ errors = {} }) => {
    return (
        <div>
            {Object.keys(errors).length > 0
                ? (
                    <ul>
                        {Object.entries(errors).map(([key, messages]) => (
                            <li key={key} className="text-danger">
                                <b className="text-capitalize">{key}:</b> {messages.join(', ')}
                            </li>
                        ))}
                    </ul>
                ) : null
            }
        </div>
    )
}
