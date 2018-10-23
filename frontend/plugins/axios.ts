export default function ({ store, app: { $axios }, redirect }) {
  $axios.onRequest(config => {
    if (store.getters.loggedToken !== null) {
      config.headers = {
        Authorization: "Bearer " + store.getters.loggedToken
      };
    }

    return config;
  });

  $axios.onResponse(response => {
    if (typeof response.data.errors !== 'undefined') {
      return redirect('/5xx');
    } else {
      return response;
    }
  });

  $axios.onError(error => {
    console.log(error);

    if (error instanceof Error) {
      redirect('/5xx');
    }
  });
}
