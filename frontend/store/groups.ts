export const state = () => ({
  data: [],
  query: {},
  formSource: {},
  totalItems: 0,
  recordPerPage: 0
});

export const mutations = {
  SET_DATA(state, response) {
    state.data = response.groups || null;
    state.totalItems = response.meta.totalResults || 0;
    state.recordPerPage = response.meta.perPage || 30;
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
          getGroups (
            opts: {
              curPage: ${typeof query.page !== "undefined" ? query.page : 1},
              perPage: ${typeof query.limit !== "undefined" ? query.limit : 30},
              q: "${typeof query.q !== "undefined" ? query.q : ""}",
              sort: "${typeof query.sort !== "undefined" ? query.sort : "-id"}"
            }
          ) {
            groups {
              id,
              name,
              screenName,
              style,
              permissions {
                id,
                name,
                description
              }
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
      ? commit("SET_DATA", response.data.getGroups)
      : response.errors;
  },

  // async add({ commit }, { input }) {
  //   const response = await this.$axios.$post("/", {
  //     query: `
  //       mutation (
  //         $input: JSON!
  //       ) {
  //         addUser (
  //           input: $input
  //         ) {
  //           id,
  //           email,
  //           fullName,
  //           screenName,
  //           avatar,
  //           mobileNumber,
  //           status,
  //           isSuperUser,
  //           isStaff,
  //           isVerified,
  //           verifyType,
  //           isProfileUpdated,
  //           oauthProvider,
  //           groups {
  //             id,
  //             name,
  //             screenName,
  //             style
  //           },
  //           dateCreated,
  //           dateLastChangePassword
  //         }
  //       }
  //     `, variables: { input: input }
  //   });

  //   return typeof response.errors === "undefined"
  //     ? commit("ADD_DATA", response.data.addUser)
  //     : response.errors;
  // },

  // async get({ commit }, { id }) {
  //   const response = await this.$axios.$post("/", {
  //     query: `
  //       {
  //         getUser (
  //           id: ${id}
  //         ) {
  //           id,
  //           email,
  //           fullName,
  //           screenName,
  //           avatar,
  //           mobileNumber,
  //           status,
  //           isSuperUser,
  //           isStaff,
  //           isVerified,
  //           verifyType,
  //           isProfileUpdated,
  //           oauthProvider,
  //           groups {
  //             id,
  //             name,
  //             screenName,
  //             style
  //           }
  //         }
  //       }
  //     `
  //   });

  //   return typeof response.errors === "undefined"
  //     ? response.data.getUser
  //     : response.errors;
  // },

  // async update({ commit }, { id, input }) {
  //   const response = await this.$axios.$post("/", {
  //     query: `
  //       mutation (
  //         $id: Int!,
  //         $input: JSON!
  //       ) {
  //         updateUser (
  //           id: $id,
  //           input: $input
  //         ) {
  //           id,
  //           email,
  //           fullName,
  //           screenName,
  //           avatar,
  //           mobileNumber,
  //           status,
  //           isSuperUser,
  //           isStaff,
  //           isVerified,
  //           verifyType,
  //           isProfileUpdated,
  //           oauthProvider,
  //           groups {
  //             id,
  //             name,
  //             screenName,
  //             style
  //           },
  //           dateCreated,
  //           dateLastChangePassword
  //         }
  //       }
  //     `, variables: { id: id, input: input }
  //   });

  //   return typeof response.errors === "undefined"
  //     ? commit("UPDATE_DATA", response.data.updateUser)
  //     : response.errors;
  // },

  // async bulk({ commit }, { input }) {
  //   const response = await this.$axios.$post("/", {
  //     query: `
  //       mutation (
  //         $input: JSON!
  //       ) {
  //         bulkUsers (
  //           input: $input
  //         )
  //       }
  //     `, variables: { input: input }
  //   });

  //   return typeof response.errors === "undefined"
  //     ? true
  //     : response.errors;
  // },

  // async get_form_source({ commit }) {
  //   const response = await this.$axios.$post("/", {
  //     query: `
  //       {
  //         getFormsource {
  //           groups,
  //           status,
  //           verifyTypes
  //         }
  //       }
  //     `
  //   });

  //   return typeof response.errors === "undefined"
  //     ? commit('SET_FORM_SOURCE', response.data.getFormsource)
  //     : response.errors;
  // },

  // async delete({ commit }, { id }) {
  //   const response = await this.$axios.$post("/", {
  //     query: `
  //       mutation (
  //         $id: Int!
  //       ) {
  //         deleteUser (
  //           id: $id
  //         )
  //       }
  //     `,
  //     variables: {
  //       id: id
  //     }
  //   });

  //   return typeof response.errors === "undefined"
  //     ? commit("DELETE_DATA", id)
  //     : response.errors;
  // },

  async add({ commit }, { input }) {
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
      ? commit("ADD_DATA", response.data.addGroup)
      : response.errors;
  }
};
