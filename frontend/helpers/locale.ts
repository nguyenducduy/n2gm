import Cookie from 'js-cookie';

export const setLocale = locale => {
  if (process.browser === false) return;

  window.localStorage.setItem('locale', locale);
  Cookie.set('locale', locale, { expires: 365 });
}

export const getLocaleFromLocalStorage = () => {
  if (process.browser === false) return;

  const locale = window.localStorage.locale;
  return locale ? locale : undefined;
}

export const getLocaleFromCookie = req => {
  if (!req.headers.cookie) return;

  const localeCookie = req.headers.cookie
    .split(';')
    .find(c => c.trim().startsWith('locale='));

  if (!localeCookie) return;

  const locale = localeCookie.split('=')[1];
  return locale;
}
