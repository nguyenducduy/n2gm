import {
  getUserFromCookie,
  getTokenFromCookie,
  getUserFromLocalStorage,
  getTokenFromLocalStorage
} from "~/helpers/auth";

export default function ({ store, req }) {
  if (process.browser === false && !req) return;

  const loggedUser = process.browser === false
    ? getUserFromCookie(req)
    : getUserFromLocalStorage();
  const loggedToken = process.browser === false
    ? getTokenFromCookie(req)
    : getTokenFromLocalStorage();

  store.commit("SET_USER", {
    user: loggedUser,
    token: loggedToken
  });
}
