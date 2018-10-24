import { setToken } from "~/helpers/auth";

export const state = () => ({
  data: [],
  query: {},
  formSource: {},
  totalItems: 0,
  recordPerPage: 0,
  tableLoading: false
});

export const mutations = {
  SET_DATA(state, response) {
    state.data = response.getUsers.users || null;
    state.totalItems = response.getUsers.meta.totalResults || 0;
    state.recordPerPage = response.getUsers.meta.perPage || 30;
    state.query.page = response.getUsers.meta.curPage || 1;
  },
  SET_FORM_SOURCE(state, responseData) {
    state.formSource = responseData || null;
  },
  ADD_DATA(state, response) {
    state.data.unshift(response);
  },
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
              groups: "${typeof query.groups !== "undefined" ? query.groups : ""}",
              sort: "${typeof query.sort !== "undefined" ? query.sort : "-id"}"
            }
          ) {
            users {
              id,
              email,
              fullName,
              screenName,
              avatar,
              mobileNumber,
              status,
              isSuperUser,
              isStaff,
              isVerified,
              verifyType,
              isProfileUpdated,
              oauthProvider,
              groups {
                id,
                name,
                screenName,
                style
              },
              dateCreated,
              dateLastChangePassword
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

  async add({ commit }, { input }) {
    const response = await this.$axios.$post("/", {
      query: `
        mutation (
          $input: JSON!
        ) {
          createUser (
            input: $input
          ) {
            id,
            email,
            fullName,
            screenName,
            avatar,
            mobileNumber,
            status,
            isSuperUser,
            isStaff,
            isVerified,
            verifyType,
            isProfileUpdated,
            oauthProvider,
            groups {
              id,
              name,
              screenName,
              style
            },
            dateCreated,
            dateLastChangePassword
          }
        }
      `, variables: { input: input }
    });

    return typeof response.errors === "undefined"
      ? commit("ADD_DATA", response.data.createUser)
      : response.errors;
  },

  async bulk({ commit }, { input }) {
    const response = await this.$axios.$post("/", {
      query: `
        mutation (
          $input: JSON!
        ) {
          bulkUsers (
            input: $input
          )
        }
      `, variables: { input: input }
    });
    console.log(response);
    // return typeof response.errors === "undefined"
    //   ? setToken(response.data.login.token)
    //   : response.errors;
  },

  async get_form_source({ commit }) {
    const response = await this.$axios.$post("/", {
      query: `
        {
          getFormsource {
            groups,
            status
          }
        }
      `
    });

    return typeof response.errors === "undefined"
      ? commit('SET_FORM_SOURCE', response.data.getFormsource)
      : response.errors;
  }
};
