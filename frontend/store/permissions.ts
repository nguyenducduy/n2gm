export const state = () => ({
  data: [],
  query: {},
  formSource: {},
  totalItems: 0,
  recordPerPage: 0
});

export const mutations = {
  SET_DATA(state, response) {
    state.data = response.permissions || null;
    state.totalItems = response.meta.totalResults || 0;
    state.recordPerPage = response.meta.perPage || 500;
    state.query.page = response.meta.curPage || 1;
  },
  SET_FORM_SOURCE(state, responseData) {
    state.formSource = responseData || null;
  },
  ADD_DATA(state, response) {
    state.data.unshift(response);
  },
  DELETE_DATA(state, id) {
    const index = state.data.findIndex(item => item.id === id);
    state.data.splice(index, 1);
    state.totalItems = state.totalItems - 1;
  },
  UPDATE_DATA(state, response) {
    const index = state.data.findIndex(item => item.id === response.id);
    state.data.splice(index, 1, response);
  }
};

export const actions = {
  async get_all({ commit }, { query }) {
    const response = await this.$axios.$post("/", {
      query: `
        {
          getPermissions (
            opts: {
              curPage: ${typeof query.page !== "undefined" ? query.page : 1},
              perPage: ${typeof query.limit !== "undefined" ? query.limit : 500},
              q: "${typeof query.q !== "undefined" ? query.q : ""}",
              sort: "${typeof query.sort !== "undefined" ? query.sort : "-id"}"
            }
          ) {
            permissions {
              id,
              name,
              description
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

    return typeof response.errors === "undefined"
      ? commit("SET_DATA", response.data.getPermissions)
      : response.errors;
  },

  async add({ commit }, { input }) {
    const response = await this.$axios.$post("/", {
      query: `
        mutation (
          $input: JSON!
        ) {
          addPermission (
            input: $input
          ) {
            id,
            name,
            description
          }
        }
      `, variables: { input: input }
    });

    return typeof response.errors === "undefined"
      ? commit("ADD_DATA", response.data.addPermission)
      : response.errors;
  },

  async delete({ commit }, { id }) {
    const response = await this.$axios.$post("/", {
      query: `
        mutation (
          $id: Int!
        ) {
          deletePermission (
            id: $id
          )
        }
      `,
      variables: {
        id: id
      }
    });

    return typeof response.errors === "undefined"
      ? commit("DELETE_DATA", id)
      : response.errors;
  }
};
