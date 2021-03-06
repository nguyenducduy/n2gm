import { Vue } from 'nuxt-property-decorator';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

export default ({ app, store }) => {
  app.i18n = new VueI18n({
    locale: store.state.locale,
    fallbackLocale: 'en',
    silentTranslationWarn: true,
    messages: {
      'en': require('~/locales/en-US.json'),
      'vi': require('~/locales/vi-VN.json')
    }
  })
}
