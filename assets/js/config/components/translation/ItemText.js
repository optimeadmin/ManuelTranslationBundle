import React, { useContext } from 'react'
import GlobalsContext from '../../context/GlobalsContext'
import { Button, Card } from 'react-bootstrap'
import Icon from '../Icon'
import FrontendFields from './FrontendFields'

const ItemText = ({ item, handleEdit, handleEditToggle }) => {
    const { booleanLabel } = useContext(GlobalsContext)

    return (
        <Card>
            <Card.Header onClick={handleEditToggle} role="button">
                <div className="row align-items-center">
                    <div className="col-md-5">{item.code}</div>
                    <div className="col-md-4 text-muted text-end">
                        {item.onlyFrontend ? (
                            <span><b>Domains:</b> {item.frontendDomains?.join(', ') ?? 'NONE'}</span>
                        ) : (
                            <span><b>Domain:</b> {item.domain}</span>
                        )}
                    </div>
                    <div className="col-md-3 text-muted text-end">
                        <b>Active:</b> {booleanLabel(item.active)}
                    </div>
                </div>
            </Card.Header>
            <Card.Body>
                <div className="row align-items-stretch">
                    <div className="col-md-10">
                        {Object.entries(item.values).map(([locale, value]) => (
                            <div key={locale} className="d-flex">
                                <div className="me-2 mt-1 text-end" style={{ minWidth: 25 }}>{locale}</div>
                                <pre className="flex-fill trans-value">{value}</pre>
                            </div>
                        ))}

                        <FrontendFields
                            frontendDomains={item.frontendDomains}
                            onlyFrontend={item.onlyFrontend}
                        />
                    </div>
                    <div className="d-grid gap-2 col-md-2 align-items-start">
                        <Button variant="outline-secondary" size="sm" onClick={handleEdit}>
                            <Icon icon="pencil-square" />
                            Edit
                        </Button>
                    </div>
                </div>
            </Card.Body>
            <Card.Footer>

            </Card.Footer>
        </Card>
    )
}

export default ItemText