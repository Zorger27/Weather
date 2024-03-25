<template>
  <div>
    <div :id="'openweathermap-widget-' + widgetId"></div>
  </div>
</template>

<script>
const openWeatherMapToken = process.env.VUE_APP_OPENWEATHERMAP_TOKEN;
export default {
  name: 'OpenWeather',
  props: {
    widgetId: {
      type: Number,
      default: 15 // Идентификатор виджета по умолчанию
    },
    cityId: {
      type: String,
      default: '703448' // Идентификатор города по умолчанию (Киев)
    },
    appId: {
      type: String,
      default: openWeatherMapToken // Ключ API по умолчанию
    },
    units: {
      type: String,
      default: 'metric' // Единицы измерения по умолчанию (градусы Цельсия)
    }
  },
  mounted() {
    this.initWidget();
  },
  methods: {
    initWidget() {
      window.myWidgetParam ? window.myWidgetParam : window.myWidgetParam = [];
      window.myWidgetParam.push({
        id: this.widgetId,
        cityid: this.cityId,
        appid: this.appId,
        units: this.units,
        containerid: 'openweathermap-widget-' + this.widgetId
      });
      (function() {
        let script = document.createElement('script');
        script.async = true;
        script.charset = "utf-8";
        script.src = "//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator.js";
        let s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(script, s);
      })();
    }
  }
}
</script>

<style scoped>

</style>