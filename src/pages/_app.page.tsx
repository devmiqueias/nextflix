import { type FC, useState } from 'react'
import { type AppProps } from 'next/app'
import { appWithTranslation } from 'next-i18next'
import nextI18NextConfig from '../../next-i18next.config.js'
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
  type DehydratedState
} from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import NextNProgress from 'nextjs-progressbar'
import { DefaultSeo } from 'next-seo'
import SEO from '../../next-seo.config'
import { Roboto } from '@next/font/google'
import { Layout } from '../components/Layout'
import { GlobalStyle } from '../styles'

const roboto = Roboto({
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin']
})

function MyApp({
  Component,
  pageProps
}: AppProps<{ dehydratedState: DehydratedState }>) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false
          }
        }
      })
  )
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <div className={roboto.className}>
          <NextNProgress
            color="#ea0b2f"
            startPosition={0.3}
            stopDelayMs={200}
            height={3}
            showOnShallow
          />
          <DefaultSeo {...SEO} />
          <Layout>
            <Component {...pageProps} />
          </Layout>
          <GlobalStyle />
        </div>
      </Hydrate>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default appWithTranslation(MyApp as FC, nextI18NextConfig)
