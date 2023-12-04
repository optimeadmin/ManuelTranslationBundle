import axios from 'axios'
import { useContext } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import GlobalsContext from '../context/GlobalsContext'

export function useMutateItem () {
  const { paths: { create } } = useContext(GlobalsContext)
  const queryClient = useQueryClient()

  const { isPending, isSuccess, mutateAsync, error: axiosError } = useMutation({
    async mutationFn (item) {
      const { code, domain, values } = item

      const { data } = await axios.post(create, { code, domain, values })

      return data
    },
    async onSuccess () {
      setTimeout(() => {
        queryClient.invalidateQueries(['profiler', 'missing-items'])
      }, 1000)
    },
  })
  let error

  if (axiosError) {
    const { status, data } = axiosError.response

    if (status === 400) {
      if (typeof data === 'object') {
        const [field, message] = Object.entries(data).at(0)
        error = `${field}: ${message}`
      } else {
        error = String(data)
      }
    } else {
      error = 'Server Error'
    }
  }

  return { save: mutateAsync, isPending, isSuccess, error }
}
