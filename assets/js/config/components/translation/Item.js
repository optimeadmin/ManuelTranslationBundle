import React, {useContext, useState} from "react";
import {Button, ButtonGroup, Card, Dropdown, Form, Placeholder} from "react-bootstrap";
import GlobalsContext from "../../context/GlobalsContext";
import Icon from "../Icon";
import TranslationsContext from "../../context/TranslationsContext";

export default function Item({translation}) {
    const {saveItem} = useContext(TranslationsContext);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleEditClick = () => setEditing(true);
    const handleCloseFormClick = () => setEditing(false);

    const handleSave = (item) => {
        setEditing(false);
        setLoading(true);
        saveItem(item).then(() => setLoading(false));
    }

    if (loading) {
        return <LoadingItem/>;
    }

    return (
        <div className="translation-item mb-2">
            {editing
                ? <ItemForm
                    item={translation}
                    handleSave={handleSave}
                    handleClose={handleCloseFormClick}
                />
                : <ItemText
                    item={translation}
                    handleEdit={handleEditClick}
                />
            }
        </div>
    );
}

const ItemText = ({item, handleEdit}) => {
    const {booleanLabel} = useContext(GlobalsContext);

    return (
        <Card>
            <Card.Header>
                <div className="row align-items-center">
                    <Card.Title className="col-sm-7 m-0">{item.code}</Card.Title>
                    <div className="col-sm-3 text-muted text-end">
                        {item.domain}
                    </div>
                    <div className="col-sm-2 text-end">
                        <b>Active:</b> {booleanLabel(item.active)}
                    </div>
                </div>
            </Card.Header>
            <Card.Body>
                <div className="row align-items-start">
                    <div className="col-sm-10 col-lg-11">
                        {Object.entries(item.values).map(([locale, value]) => (
                            <div key={locale} className="d-flex">
                                <div className="me-2 mt-1 text-end" style={{minWidth: 25}}>{locale}</div>
                                <pre className="flex-fill trans-value">{value}</pre>
                            </div>
                        ))}
                    </div>
                    <div className="d-grid gap-2 col-sm-2 col-lg-1">
                        <Dropdown as={ButtonGroup} size="sm">
                            <Button variant="outline-secondary" onClick={handleEdit}>
                                <Icon icon="pencil-square"/>
                                Edit
                            </Button>
                            <Dropdown.Toggle split variant="outline-secondary"/>

                            <Dropdown.Menu>
                                <Dropdown.Item><Icon icon="trash"/>Deactivate</Dropdown.Item>
                                <Dropdown.Item><Icon icon="check-circle"/>Activate</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

const getFormValues = (defaultLocales, item) => {
    const itemValues = {...item?.values || {}};
    const values = {};

    defaultLocales.forEach(locale => {
        values[locale] = itemValues[locale] || '';
    });

    return {...values, ...itemValues};
}

const ItemForm = ({item, handleClose, handleSave}) => {
    const {booleanLabel, domains, locales: defaultLocales} = useContext(GlobalsContext);
    const [formData, setFormData] = useState(() => ({
        code: item.code,
        domain: item.domain,
        values: getFormValues(defaultLocales, item),
    }));
    const isNew = !item.id;

    const handleCodeChange = (e) => {
        if (isNew) {
            setFormData({...formData, code: e.target.value});
        }
    };

    const handleDomainChange = (e) => {
        if (isNew) {
            setFormData({...formData, domain: e.target.value});
        }
    };

    const handleValueChange = (locale, e) => {
        const newValues = {...formData.values};
        newValues[locale] = e.target.value;
        setFormData({...formData, values: newValues});
    };

    const handleSaveClick = () => {
        handleSave({...item, ...formData});
        handleClose();
    };

    return (
        <Card>
            <Card.Header>
                <div className="row align-items-center">
                    <div className="col-sm-7 m-0">
                        <Form.Control
                            value={formData.code}
                            onChange={handleCodeChange}
                            size="sm"
                            disabled={!isNew}
                        />
                    </div>

                    {/*<span slot="message">*/}
                    {/*    <span className="glyphicon glyphicon-ok label label-success">*/}
                    {/*        Save Successfull!*/}
                    {/*    </span>*/}
                    {/*    <span className="glyphicon glyphicon-remove label label-danger">*/}
                    {/*        Save Error!*/}
                    {/*    </span>*/}
                    {/*</span>*/}

                    <div className="col-sm-3 text-muted text-end">
                        <Form.Select
                            size="sm"
                            disabled={!isNew}
                            value={formData.domain}
                            onChange={handleDomainChange}
                        >
                            {domains.map(domain => (
                                <option key={domain} value={domain}>{domain}</option>
                            ))}
                        </Form.Select>
                    </div>
                    <div className="col-sm-2 text-end">
                        <b>Active:</b> {booleanLabel(item.active)}
                    </div>
                </div>
            </Card.Header>
            <Card.Body>
                <div className="row align-items-start">
                    <div className="col-sm-10">
                        {Object.entries(formData.values).map(([locale, value]) => (
                            <div key={locale} className="d-flex mb-2">
                                <div className="me-2 mt-1 text-end" style={{minWidth: 25}}>{locale}</div>
                                <Form.Control
                                    as="textarea"
                                    value={value}
                                    onChange={e => handleValueChange(locale, e)}
                                    size="sm"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="d-grid gap-2 col-sm-2">
                        <Button variant="primary" onClick={handleSaveClick}><Icon icon="save"/>Save</Button>
                        <Button variant="danger" onClick={handleClose}><Icon icon="x"/>Cancel</Button>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

const LoadingItem = () => {
    return (
        <div className="translation-item mb-2">
            <Card>
                <Card.Header>
                    <div className="row align-items-center">

                        <Card.Title className="col-sm-7 m-0">
                            <Placeholder xs={7}/>
                        </Card.Title>

                        <div className="col-sm-3 text-muted text-end">
                            <Placeholder xs={11}/>
                        </div>
                        <div className="col-sm-2 text-end">
                            <Placeholder xs={11}/>
                        </div>
                    </div>
                </Card.Header>
                <Card.Body>
                    <div className="row align-items-start">
                        <div className="col-sm-10 col-lg-11">
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
                        <div className="d-grid gap-2 col-sm-2 col-lg-1">
                            <Placeholder.Button xs={12}/>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export {LoadingItem};