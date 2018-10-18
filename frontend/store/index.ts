export const state = () => ({
  authUser: null,
  authToken: "",
  locales: ["en", "vi"],
  locale: "en",
  secureGroup: []
});

export const mutations = {
  SET_USER(state, authData) {
    state.authUser = authData.user || null;
    state.authToken = authData.token;
  },
  SET_LANG(state, locale) {
    if (state.locales.indexOf(locale) !== -1) {
      state.locale = locale;
    }
  },
  SET_SECURE_GROUP(state, group) {
    state.secureGroup = group;
  }
};

export const actions = {};

export const getters = {
  isAuthenticated(state) {
    return !!state.authUser || false;
  },
  loggedUser(state) {
    return state.authUser || null;
  },
  loggedToken(state) {
    return state.authToken || null;
  }
};
