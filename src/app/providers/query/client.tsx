import { QueryClient } from '@tanstack/react-query'
import { cache } from 'react'

const client = cache(() => new QueryClient())
export default client