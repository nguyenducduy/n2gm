import { setToken } from "~/helpers/auth";

export const state = () => ({
  data: [],
  query: {},
  formSource: {},
  totalItems: 0,
  recordPerPage: 0
});

export const mutations = {
  SET_DATA(state, response) {
    state.data = response.getUsers.users || null;
    state.totalItems = response.getUsers.meta.totalResults || 0;
    state.recordPerPage = response.getUsers.meta.perPage || 30;
    state.query.page = response.getUsers.meta.curPage || 1;
  }
};

export const actions = {
  async get_all({ commit }, { query }) {
    const response = await this.$axios.$post("/", {
      query: `
        {
          getUsers (
            opts: {
              curPage: ${typeof query.page !== "undefined" ? query.page : 1},
              perPage: ${typeof query.limit !== "undefined" ? query.limit : 30},
              q: "${typeof query.q !== "undefined" ? query.q : ""}",
              sort: "${typeof query.sort !== "undefined" ? query.sort : "-id"}"
            }
          ) {
            users {
              id,
              email,
              fullName,
              status,
              dateCreated
            },
            meta {
              curPage,
              perPage,
              totalPages,
              totalResults
            }
          }
        }
      `
    });

    return typeof response.errors === "undefined" ? commit("SET_DATA", response.data) : response.errors;
  },

  async login_by_username({ commit }, formData) {
    const response = await this.$axios.$post("/", {
      query: `
        {
          login (
            input: {
              userName: "${formData.email}",
              password: "${formData.password}"
            }
          ) {
            user,
            token
          }
        }
      `
    });

    return typeof response.errors === "undefined"
      ? setToken(response.data.login.token)
      : response.errors;
  },

  async add({ commit }, formData) {
    console.log(formData)
  }
};
