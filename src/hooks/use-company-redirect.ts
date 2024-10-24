import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

export async function getCompanyInfo() {
  const res = await fetch('/api/company/info', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Failed to fetch company info')
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return res.json()
}

export function useCompanyRedirect() {
  const router = useRouter()

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { data: companyInfo, isLoading } = useQuery({
    queryKey: ['companyInfo'],
    queryFn: getCompanyInfo,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  useEffect(() => {
    if (isLoading) return

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const path = window.location.pathname
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const hasCompany = companyInfo?.company?.invite_code

    if (hasCompany && path === '/company/create') {
      router.replace('/company')
    } else if (!hasCompany &&
      path.startsWith('/company') &&
      !path.includes('/create')) {
      router.replace('/company/create')
    }
  }, [companyInfo, isLoading, router])

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  return { companyInfo, isLoading }
}