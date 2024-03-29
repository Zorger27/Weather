<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {openGraphMixin} from "@/assets/ogimage/openGraphMixin";
import CurrentDate from "@/components/util/CurrentDate.vue";
import WeatherCreep3d from "@/components/other/WeatherCreep3d.vue";

@Options({
  mixins: [openGraphMixin],
  data() {
    return {
      cityName: '' as string,
      cities: [] as string[],
      cripView3d: true,
    }
  },
  mounted() {
    const mainTitle = 'Weather 3D';
    const title = 'Weather 3D';
    const metaDescription = 'Weather forecast from OpenWeather';
    const description = 'Weather forecast from OpenWeather';
    const imageUrl = 'https://weather-zorger.vercel.app/assets/ogimage/bmp/project2.jpg';
    const url = 'https://weather-zorger.vercel.app/project2';

    this.setOpenGraphTags(metaDescription, title, description, imageUrl, url);
    this.setPageTitle(mainTitle);
  },
  methods: {
    changeCrip3d() {
      this.cripView3d = !this.cripView3d;
    },
  },
  components: {WeatherCreep3d, CurrentDate},
})
export default class Project2 extends Vue {
};
</script>

<template>
  <div class="weather">
    <h1>{{ $t('project2.name') }}</h1>
    <line></line>
    <CurrentDate></CurrentDate>
    <h2 class="title">{{ $t('title1') }}<i @click="changeCrip3d"> <span :class="['fa-solid', cripView3d ? 'fa-cloud-sun-rain' : 'fa-snowflake']"></span></i></h2>
    <div class="creep3d">
      <WeatherCreep3d :crip-view3d="cripView3d"></WeatherCreep3d>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.weather {
  flex: 1 0 auto;
  //background: linear-gradient(to bottom, rgb(243, 255, 240), rgb(229, 251, 255)) no-repeat center;
  background-image: url("@/assets/background/background03.webp");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;


  .title {
      justify-content: center;
      align-items: center;
      font-size: 2.3rem;
      margin: 0;
      color: black;
      .fa-solid.fa-cloud-sun-rain, .fa-solid.fa-snowflake {
        margin: 0 0.5rem;
      }
      .fa-solid.fa-cloud-sun-rain:hover {
        color: gold;
      }
      .fa-solid.fa-snowflake:hover {
        color: blue;
      }
    }

    .creep3d {
      max-height: 20vh;
      max-width: 100%;
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
    }
}

@media(max-width: 1020px) {
  .weather {
    .title {
      font-size: 2.1rem;
    }
  }
}

@media (max-width: 768px) {
  .weather {
    .title {
      justify-content: center;
      align-items: center;
      font-size: 2rem;
      margin: 0.5rem 0 0;
      .fa-solid.fa-cloud-sun-rain, .fa-solid.fa-snowflake {
        margin: 0 0.5rem;
      }
    }

    .creep3d {
      max-height: 20vh;
    }
  }
}
</style>
