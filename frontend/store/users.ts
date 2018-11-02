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
  },
  ADD_GROUP(state, response) {
    state.formSource.groups.push(response);
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
              groups: "${typeof query.groups !== "undefined" ? query.groups : ""}",
              status: "${typeof query.status !== "undefined" ? query.status : ""}",
              verifyType: "${typeof query.verifyType !== "undefined" ? query.verifyType : ""}",
              isSuperUser: "${typeof query.isSuperUser !== "undefined" ? query.isSuperUser : ""}",
              isStaff: "${typeof query.isStaff !== "undefined" ? query.isStaff : ""}",
              isVerified: "${typeof query.isVerified !== "undefined" ? query.isVerified : ""}",
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

    return typeof response.errors === "undefined"
      ? commit("SET_DATA", response.data)
      : response.errors;
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
          addUser (
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
      ? commit("ADD_DATA", response.data.addUser)
      : response.errors;
  },

  async get({ commit }, { id }) {
    const response = await this.$axios.$post("/", {
      query: `
        {
          getUser (
            id: ${id}
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
            }
          }
        }
      `
    });

    return typeof response.errors === "undefined"
      ? response.data.getUser
      : response.errors;
  },

  async update({ commit }, { id, input }) {
    const response = await this.$axios.$post("/", {
      query: `
        mutation (
          $id: Int!,
          $input: JSON!
        ) {
          updateUser (
            id: $id,
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
      `, variables: { id: id, input: input }
    });

    return typeof response.errors === "undefined"
      ? commit("UPDATE_DATA", response.data.updateUser)
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

    return typeof response.errors === "undefined"
      ? true
      : response.errors;
  },

  async get_form_source({ commit }) {
    const response = await this.$axios.$post("/", {
      query: `
        {
          getFormsource {
            groups,
            status,
            verifyTypes
          }
        }
      `
    });

    return typeof response.errors === "undefined"
      ? commit('SET_FORM_SOURCE', response.data.getFormsource)
      : response.errors;
  },

  async delete({ commit }, { id }) {
    const response = await this.$axios.$post("/", {
      query: `
        mutation (
          $id: Int!
        ) {
          deleteUser (
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
  },

  async add_group({ commit }, { input }) {
    const response = await this.$axios.$post("/", {
      query: `
        mutation (
          $input: JSON!
        ) {
          addGroup (
            input: $input
          ) {
            id,
            name,
            screenName,
            style
          }
        }
      `, variables: { input: input }
    });

    return typeof response.errors === "undefined"
      ? commit("ADD_GROUP", response.data.addGroup)
      : response.errors;
  }
};
