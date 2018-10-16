import Vue, { ComponentOptions } from 'vue'
import { Store } from 'vuex'
import { Route } from 'vue-router'
import { AxiosInstance, AxiosRequestConfig } from 'axios'

// declare module 'vue/types/vue' {
//     interface Vue {
//         $socket: SocketIOClient.Socket;
//         $validator: Validator;
//     }
// }

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    layout?: string | String[]
    middleware?: string | String[]
    watchQuery?: string | String[]
    notifications?: { [key: string]: { [key: string]: any } }
  }
}
