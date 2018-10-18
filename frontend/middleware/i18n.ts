import { getLocaleFromCookie, getLocaleFromLocalStorage } from '~/helpers/locale';

export default function ({ app, store, req }) {
  // If nuxt generate, pass this middleware
  if (process.browser === false && !req) return;

  // Get locale from cookie
  let locale = process.browser === false
    ? getLocaleFromCookie(req)
    : getLocaleFromLocalStorage();

  if (typeof locale === 'undefined') {
    locale = 'en';
  }

  // Set locale
  store.commit('SET_LANG', locale);
  app.i18n.locale = store.state.locale;
}
