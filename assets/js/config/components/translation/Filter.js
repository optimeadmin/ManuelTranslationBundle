import React, { useContext, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import Icon from "../Icon";
import GlobalsContext from "../../context/GlobalsContext";

const emptyFilters = (domains, frontendDomains) => ({
    search: '',
    domains: new Array(domains.length).fill(''),
    frontendDomains: new Array(frontendDomains.length).fill(''),
});

const Filter = React.memo(({ onSubmit }) => {
    const { domains, frontendDomains } = useContext(GlobalsContext);
    const [filters, setFilters] = useState(() => emptyFilters(domains, frontendDomains));

    const handleFormSubmit = (e) => {
        e.preventDefault();
        onSubmit(filters);
    }

    const handleClearClick = (e) => {
        const newFilters = emptyFilters(domains, frontendDomains);
        setFilters(newFilters);
        onSubmit(newFilters);
    }

    const handleSearchChange = (e) => {
        setFilters(f => ({ ...f, search: e.target.value }));
    }

    const handleDomainsChange = (index, e) => {
        setFilters(filters => {
            const domains = filters.domains;
            domains[index] = e.target.checked ? e.target.value : "";

            return { ...filters, domains };
        });
    }

    const handleFrontendDomainsChange = (index, e) => {
        setFilters(filters => {
            const frontendDomains = filters.frontendDomains;
            frontendDomains[index] = e.target.checked ? e.target.value : "";

            return { ...filters, frontendDomains };
        });
    }

    const isDomainSelected = (index) => {
        const value = filters.domains[index] || '';

        return '' !== value;
    }

    const isFrontendDomainSelected = (index) => {
        const value = filters.frontendDomains[index] || '';

        return '' !== value;
    }

    return (
        <Card>
            <Card.Body>
                <form onSubmit={handleFormSubmit}>
                    <div className="d-flex flex-lg-row flex-column">
                        <div className="flex-fill px-3">
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column md={12} lg={3} xxl={2}>Search</Form.Label>
                                <Col>
                                    <Form.Control value={filters.search} onChange={handleSearchChange} type="search" />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column md={12} className="py-0" lg={3} xxl={2}>Domains</Form.Label>
                                <Col>
                                    {domains.map((domain, index) => (
                                        <Form.Check
                                            key={domain}
                                            id={"filter-domain-" + index}
                                            inline
                                            name="domains"
                                            label={domain}
                                            value={domain}
                                            checked={isDomainSelected(index)}
                                            onChange={e => handleDomainsChange(index, e)}
                                        />
                                    ))}
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column md={12} className="py-0" lg={3} xxl={2}>Frontend Domains</Form.Label>
                                <Col>
                                    {frontendDomains.map((domain, index) => (
                                        <Form.Check
                                            key={domain}
                                            id={"filter-frontend-domain-" + index}
                                            inline
                                            name="domains"
                                            label={domain}
                                            value={domain}
                                            checked={isFrontendDomainSelected(index)}
                                            onChange={e => handleFrontendDomainsChange(index, e)}
                                        />
                                    ))}
                                </Col>
                            </Form.Group>
                        </div>
                        <div className="ms-auto">
                            <div className="d-flex gap-2">
                                <Button type="submit" variant="primary">
                                    <Icon icon="funnel" />
                                    Apply
                                </Button>
                                <Button type="button" variant="outline-secondary" onClick={handleClearClick}>
                                    <Icon icon="x" />
                                    Clear
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </Card.Body>
        </Card>
    );
});

export default Filter;
