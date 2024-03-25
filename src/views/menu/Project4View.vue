<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {openGraphMixin} from "@/assets/ogimage/openGraphMixin";
import CurrentDate from "@/components/util/CurrentDate.vue";
import MyWeather from "@/components/other/MyWeather.vue";
import OpenWeather from "@/components/other/OpenWeather.vue";

@Options({
  mixins: [openGraphMixin],
  data() {
    return {
      OpenWeatherView: false
    }
  },
  mounted() {
    const mainTitle = 'Weather Old';
    const title = 'Weather Old';
    const metaDescription = 'Weather forecast from OpenWeather';
    const description = 'Weather forecast from OpenWeather';
    const imageUrl = 'https://weather-zorger.vercel.app/assets/ogimage/bmp/project4.jpg';
    const url = 'https://weather-zorger.vercel.app/project4';

    this.setOpenGraphTags(metaDescription, title, description, imageUrl, url);
    this.setPageTitle(mainTitle);
  },
  methods: {
    changeOpenWeatherView() {
      this.OpenWeatherView = !this.OpenWeatherView;
    }
  },
  components: {OpenWeather, MyWeather, CurrentDate},
})
export default class Project4 extends Vue {
};
</script>

<template>
  <div class="weather">
    <h1>{{ $t('project4.name') }}</h1>
    <line></line>
    <CurrentDate></CurrentDate>
    <h1 class="bank">
      <a href="https://openweathermap.org" title="In more detail..." target="_blank">
        OpenWeather
      </a> <i @click="changeOpenWeatherView"><span :class="['fa-solid', OpenWeatherView ? 'fa-sun' : 'fa-cloud']"></span></i>
    </h1>
    <div class="container">
      <MyWeather class="myWidget"></MyWeather>
      <OpenWeather v-show="OpenWeatherView" class="widget" :widgetId="15" :cityId="'703448'"/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.weather {
  flex: 1 0 auto;
  background: linear-gradient(to bottom, rgb(229, 255, 229), rgb(250, 247, 234)) no-repeat center;
  h1 {font-size: 2.5rem;margin: 0.7rem auto;color: black;}

  .bank {
    font-size: 2.5rem;
    a {text-decoration: none; color: rebeccapurple;}
    a:hover {color: cornflowerblue;}
  }

  .container {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;

    .myWidget {
      display: inline-flex;
    }

    .widget {
      display: inline-flex;
      margin: 1rem;
    }
  }
}
@media(max-width: 1020px) {
  .weather {
    h1, .bank {font-size: 2.3rem;margin: 0.6rem auto;}
  }
}

@media (max-width: 768px) {
  .weather {
    h1, .bank {font-size: 2rem;margin: 0.5rem auto;}
  }
}
</style>
