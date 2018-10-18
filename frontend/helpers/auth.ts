import jwtDecode from "jwt-decode";
import Cookie from "js-cookie";

export const setToken = token => {
  if (process.browser === false) return;

  window.localStorage.setItem("token", token);
  window.localStorage.setItem("user", JSON.stringify(jwtDecode(token)));
  Cookie.set("jwt", token, { expires: 365 });
};

export const unsetToken = () => {
  if (process.browser === false) return;

  window.localStorage.removeItem("token");
  window.localStorage.removeItem("user");
  Cookie.remove("jwt");
};

export const getUserFromLocalStorage = () => {
  if (process.browser === false) return;

  const json = window.localStorage.user;
  return json ? JSON.parse(json) : undefined;
};

export const getTokenFromLocalStorage = () => {
  if (process.browser === false) return;

  const jwt = window.localStorage.token;
  return jwt ? jwt : undefined;
};

export const getUserFromCookie = req => {
  if (!req.headers.cookie) return

  const jwtCookie = req.headers.cookie
    .split(';')
    .find(c => c.trim().startsWith('jwt='))

  if (!jwtCookie) return

  const jwt = jwtCookie.split('=')[1]
  return jwtDecode(jwt)
}

export const getTokenFromCookie = req => {
  if (!req.headers.cookie) return

  const jwtCookie = req.headers.cookie
    .split(';')
    .find(c => c.trim().startsWith('jwt='))

  if (!jwtCookie) return

  const jwt = jwtCookie.split('=')[1]
  return jwt
}
