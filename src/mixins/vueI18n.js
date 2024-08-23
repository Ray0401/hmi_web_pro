// 统一管理vue-i18n
import { sendMsgToBackend } from '@/utils/utils';
import { i18n } from '../vueI18n/vueI18n';
export const vueI18n = {
  data() {
    return {};
  },
  computed: {
    isLang() {
      return this.$i18n.locale;
    },
    isEN() {
      return this.$i18n.locale == 'en';
    },
    isZH() {
      return this.$i18n.locale == 'zh';
    },
  },
  methods: {
    toLang(lang) {
      if (!i18n[lang]) return lang;
      lang = i18n[lang];
      return this.$t(lang);
    },
    showToast(text, bool) {
      if (bool) {
        this.$store.commit('setMessageList', text);
        sendMsgToBackend(text);
      }
      this.$toast(text);
    },
  },
};
