export default function ({ store, app: { $axios }, redirect }) {
  $axios.onRequest(config => {
    if (store.getters.loggedToken !== null) {
      config.headers = {
        Authorization: "Bearer " + store.getters.loggedToken
      };
    }

    return config;
  });

  // $axios.onResponse(response => {
    // if (typeof response.errors !== 'undefined') {
    //   return Message({
    //     showClose: true,
    //     message: response.errors[0].message,
    //     type: 'error',
    //     duration: 2 * 1000
    //   })
    // } else {
    //   return response;
    // }
  // });

  $axios.onError(error => {
    console.log(error);

    if (error instanceof Error) {
      redirect('/5xx');
    }
  });
}
