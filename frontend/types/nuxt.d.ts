import Vue, { ComponentOptions } from 'vue'
import { Store } from 'vuex'
import { Route } from 'vue-router'
import { AxiosInstance, AxiosRequestConfig } from 'axios'

declare module 'nuxt' {
  interface NuxtAxiosInstance {
    $post(url: string, data?: any, config?: AxiosRequestConfig): Promise<any>
  }

  interface NuxtApp {
    $axios: AxiosInstance & NuxtAxiosInstance
  }

  interface NuxtContext<S = any> {
    app: NuxtApp
    isDev: boolean
    isHMR: boolean
    route: Route
    store: Store<any>
    env: any
    query: any
    nuxtState: any
    req: Request
    res: Response
    redirect: (path: String) => void
    error: (params: { statusCode?: String; messages?: String }) => void
    beforeNuxtRender: ({ Components, nuxtState }) => void
  }
}
