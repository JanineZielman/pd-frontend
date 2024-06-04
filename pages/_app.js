import App from "next/app"
import Head from "next/head"
import "../assets/css/global.scss"
import "../assets/css/breakpoints.scss"
import { createContext } from "react"
import { fetchAPI } from "../lib/api"
import { getStrapiMedia } from "../lib/media"

// Store Strapi Global object in context
export const GlobalContext = createContext({})

const MyApp = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
      </Head>
      <GlobalContext.Provider value={pageProps}>
        <Component {...pageProps} />
      </GlobalContext.Provider>
    </>
  )
}

export default MyApp

