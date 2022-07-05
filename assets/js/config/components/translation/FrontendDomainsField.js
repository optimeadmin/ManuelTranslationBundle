import React, { useContext, useId } from 'react'
import { Dropdown, Form } from 'react-bootstrap'
import GlobalsContext from '../../context/GlobalsContext'

const FrontendDomainsField = ({ values, selectDomains }) => {
    const id = useId()
    const { frontendDomains: domains } = useContext(GlobalsContext)

    const handleDomainsChange = (e) => {
        const { checked, value } = e.target
        const newDomains = [...values]

        if (checked) {
            selectDomains([...newDomains, value])
        } else {
            selectDomains(newDomains.filter(d => d !== value))
        }
    }

    const handleNewDomainBlur = (e) => {
        selectDomains([...new Set([...values, e.target.value?.trim()])])
    }

    const isSelected = (domain) => values?.includes(domain) ?? false

    return (
        <div>
            <Dropdown autoClose="outside">
                <Dropdown.Toggle variant="outline-secondary" size="sm">
                    {values?.join(', ') || 'Select'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {domains.map(domain => (
                        <Dropdown.ItemText key={domain}>
                            <Form.Check
                                name={`form-domain-${id}`}
                                id={`form-${id}-domain-${domain}`}
                                value={domain}
                                label={domain}
                                checked={isSelected(domain)}
                                onChange={handleDomainsChange}
                            />
                        </Dropdown.ItemText>
                    ))}
                    <Dropdown.ItemText>
                        <Form.Control
                            size="sm"
                            placeholder="New Domain"
                            onBlur={handleNewDomainBlur}
                        />
                    </Dropdown.ItemText>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    )
}

export default FrontendDomainsField