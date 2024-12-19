<template>
  <select v-model="locale" @change="savelocale(locale)">
    <option
      v-for="sLocale in availableLocales"
      :key="`locale.${sLocale}`"
      :value="sLocale"
      :selected="locale === sLocale"
    >
      {{ t(getLocaleKey(sLocale)) }}
    </option>
  </select>
</template>

<script lang="ts">
import {watch, ref, Ref} from 'vue';
import {useI18n} from "vue-i18n";

export default {
  name: "LanguageSwitcher",
  setup() {
    const { t, locale, availableLocales} = useI18n()

    // Функция, возвращающая строгий ключ для t()
    const getLocaleKey = (sLocale: string): string => {
      return `locale.${sLocale}`;
    };

    if (document.documentElement.lang == '') {
      document.documentElement.lang = 'en'
    }

    // Определяем тип для локалей на основе availableLocales
    const availableLocalesRef = ref(availableLocales as string[]);  // Ожидаемые языки

    const savelocale = (sLocale: string) => {
      localStorage.setItem("user-locale", sLocale);
    }

    // при инициализации компонента попробуем загрузить значение из localStorage
    const savedLocale = localStorage.getItem("user-locale")

    if (savedLocale && availableLocalesRef.value.includes(savedLocale)) {
      (locale as Ref<string>).value = savedLocale;  // Приведение типа
      document.documentElement.lang = savedLocale;
    }

    // Следим за изменением значения locale и обновляем атрибут lang
    watch(locale, (newLocale) => {
      document.documentElement.lang = newLocale;
    });

    return { t, locale, availableLocales: availableLocalesRef, savelocale, getLocaleKey }
  }
}
</script>

<style lang="scss" scoped>
select {
  background: inherit;
  border: none;
  padding: 0;
}

select:focus {
  border: none;
}
</style>