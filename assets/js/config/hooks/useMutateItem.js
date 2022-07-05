import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { useContext } from "react";
import GlobalsContext from "../context/GlobalsContext";
import { setItem, setLocalItem } from "../storage/domains";

const persistTranslation = (apiUrl, item) => {
    const method = item.id ? axios.put : axios.post
    const url = item.id ? apiUrl + "/" + item.id : apiUrl

    return method(url, {
        ...item,
        lastChanged: 'local',
    })
}

const useMutateItem = () => {
    const { paths: { api }, addDomain, addFrontendDomain } = useContext(GlobalsContext)
    const queryClient = useQueryClient()

    const itemMutation = useMutation((item) => persistTranslation(api, item), {
        onSuccess({ data }) {
            const queryKeyFilter = ["translations", "list"]

            data?.domain && addDomain(data.domain)
            data?.frontendDomains?.forEach(addFrontendDomain)

            data?.domain && setItem('translations_default_domain', data.domain)
            data?.frontendDomains && setLocalItem(
                'translations_default_frontend_domains',
                data.frontendDomains
            )

            queryClient.setQueriesData(queryKeyFilter, ({ items, totalCount }) => {
                const newItems = [...items]
                const index = newItems.findIndex(item => item.id === data.id)

                if (-1 !== index) {
                    // actualizamos la data al momento
                    newItems[index] = { ...newItems[index], ...data }
                }

                return { items: newItems, totalCount }
            })
            queryClient.invalidateQueries(queryKeyFilter)
        }
    })

    return {
        save: itemMutation.mutateAsync,
        isLoading: itemMutation.isLoading,
    }
}

export default useMutateItem
