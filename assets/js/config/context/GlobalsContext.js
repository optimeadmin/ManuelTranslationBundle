import React, {createContext} from "react";

const GlobalsContext = createContext({
    paths: {},
    domains: [],
    locales: [],
    booleanLabel: (value) => null,
});

const itemsPerPage = 50;

const calculatePagesCount = (totalCount) => {
    return Math.floor(totalCount / itemsPerPage) + 1;
}

const GlobalsProvider = ({children, paths, domains, locales}) => {

    const booleanLabel = (value) => {
        return value ? 'Yes' : 'No';
    };

    const domainsAsArray = Object.entries(domains).map(([key, value]) => value);

    return (
        <GlobalsContext.Provider value={{
            paths,
            domains: domainsAsArray,
            locales,
            booleanLabel,
        }}>
            {children}
        </GlobalsContext.Provider>
    );
}

export {GlobalsProvider, calculatePagesCount, itemsPerPage};
export default GlobalsContext;