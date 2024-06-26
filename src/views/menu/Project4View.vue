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
      OpenWeatherView: false,
      cityName: '' as string,
      cities: [] as string[],
      tableView: false,
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

    const savedCity = localStorage.getItem('weatherCity');
    if (savedCity) {
      this.cityName = savedCity;
      this.callUpdateCityName(savedCity);
    } else {
      this.cityName = this.$t("cities.Kyiv");
      this.callUpdateCityName(this.cityName);
    }
  },
  methods: {
    changeOpenWeatherView() {
      this.OpenWeatherView = !this.OpenWeatherView;
    },
    changeView() {
      this.tableView = !this.tableView;
    },
    clearCity() {
      this.cityName = "";
      // Устанавливаем фокус на поле ввода
      this.$refs.cityInput.focus();
    },
    callGetWeather() {
      if (this.$refs.myWeatherComponent) {
        this.$refs.myWeatherComponent.getWeather();
      }
    },
    callHandleCityInputChange(cityName: string) {
      if (this.$refs.myWeatherComponent) {
        this.$refs.myWeatherComponent.handleCityInputChange(cityName);
      }
    },
    callUpdateCityName(cityName: string) {
      this.cityName = cityName;
      if (this.$refs.myWeatherComponent) {
        this.$refs.myWeatherComponent.updateCityName(cityName);
      }
    },
  },
  components: {OpenWeather, MyWeather, CurrentDate},
})
export default class Project4 extends Vue {};
</script>

<template>
  <div class="weather">
    <h1>{{ $t('project4.name') }}</h1>
    <line></line>
    <CurrentDate></CurrentDate>
    <div class="inner">
      <div class="input-group">
        <label for="city">{{ $t('city') }}</label>
        <input type="text" id="city" v-model="cityName" @input="callHandleCityInputChange(cityName)" @keydown.enter="callGetWeather"
               ref="cityInput"> <i title="Clear" @click="clearCity" class="fas fa-trash-alt"></i>
        <button class="get" @click="callGetWeather" :title="$t('btn')">{{ $t('get') }}</button>
        <button class="getMobile" @click="callGetWeather" :title="$t('btn')"><i class="fas fa-arrow-circle-down"></i></button>
        <select class="city-list" v-model="cityName" @change="callUpdateCityName(cityName)">
          <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
        </select>
      </div>
      <h2 class="title">{{ $t('title1') }}<i :title="[OpenWeatherView ? 'Close OpenWeather module' : 'Start OpenWeather module']" @click="changeOpenWeatherView"><span
        :class="['fa-solid', OpenWeatherView ? 'fa-sun' : 'fa-cloud']"></span></i> <i :title="[tableView ? 'Start viewing in List view' : 'Start viewing in Table view']"
        @click="changeView"><span :class="['fa', tableView ? 'fa-list' : 'fa-th']"></span></i>
      </h2>
    </div>
    <div class="container">
      <MyWeather ref="myWeatherComponent" class="myWidget" :cityName="cityName" @update:cities="cities = $event" :table-view="tableView"></MyWeather>
      <OpenWeather v-if="OpenWeatherView" class="widget" :widgetId="15" :cityId="'703448'"/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.weather {
  flex: 1 0 auto;
  background: linear-gradient(to bottom, rgb(229, 255, 229), rgb(250, 247, 234)) no-repeat center;

  .inner {
    //display: flex;
    //justify-content: center;
    //align-items: center;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    grid-column-gap: 0.5rem;
    grid-row-gap: 0;
    grid-auto-flow: column;
    grid-template-areas:
        "input-group"
        "title";

    .title {
      grid-area: title;
      display: grid;
      grid-auto-flow: column;
      justify-content: center;
      align-items: center;
      font-size: 2.3rem;
      margin: 0 0 0.5rem 0;
      color: black;
      .fa-solid.fa-sun, .fa-solid.fa-cloud {
        margin: 0 0.5rem;
      }
      //.fa-solid.fa-sun:hover {color: gold;}
      //.fa-solid.fa-cloud:hover {color: blue;}
    }
    .input-group {
      grid-area: input-group;
      font-size: 2.3rem;
      margin: 0.7rem 0;
      display: grid;
      grid-auto-flow: column;
      justify-content: center;
      align-items: center;
      .getMobile {
        display: none;
      }
      .get {
        display: inline-flex;
      }
      label, input, button, select {
        margin: 0 0.4rem 0 0;
        font-size: 1.5rem;
      }
      label {
        font-weight: bold;
        font-size: 2rem;
        color: black;
      }
      input[type="text"] {
        flex: 1 0 auto;
        color: black;
        caret-color: red;
        border: 1px solid #ddd;
        border-radius: 5px;
        width: 120px;
        padding: 0.4rem;
        margin: 0;
      }
      input:active, input:focus {
        outline: 1px solid transparent;
        box-shadow: 3px 3px 4px 0 lightgrey;
      }
      button {
        padding: 0.43rem;
        background-color: #f9f9f9;
        border: 1px solid #ddd;
        border-radius: 5px;
        text-align: center;
        cursor: pointer;
        transition: border-color .2s ease-in-out, background-color .2s, box-shadow .2s;
      }
      button:hover {
        background-color: #f1f1f1;
        box-shadow: 3px 3px 4px 0 lightgrey;
        border-color: #ddd;
      }
      select {
        border-radius: 5px;
        padding: 0.4rem;
        border: 1px solid #ddd;
        margin: 0;
      }
      .fas.fa-trash-alt {
        font-size: 1.7rem;
        padding: 0;
        margin: 0 0.6rem;
      }
      .fas.fa-trash-alt:hover {
        color: red;
      }
    }
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
    .inner {
      .title {
        font-size: 2.1rem;
      }
      .input-group {
        label, input, button, select {
          margin: 0.3rem 0.2rem 0;
          font-size: 1.2rem;
        }
        label {
          font-size: 1.7rem;
        }
        button {
          margin: 0 0.2rem 0 0;
        }
        select {
          margin: 0;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .weather {
    .inner{
      grid-column-gap: 0;
      grid-row-gap: 0;

      .title {
        justify-content: center;
        align-items: center;
        font-size: 2rem;
        margin: 0.3rem 0 0.5rem;
        .fa-solid.fa-sun, .fa-solid.fa-cloud {
          margin: 0 0.5rem;
        }
      }

      .input-group {
        margin: 0.8rem 0 0;
        .get {
          display: none;
        }
        .getMobile {
          display: inline-flex;
          border-color: #ddd;
          color: lightskyblue;
          padding: 0.27rem;
          font-size: 1.2rem;
          margin: 0 0.5rem 0 0;
        }

        label, input, button, select {
          margin: 0.3rem 0.2rem 0;
          font-size: 1.1rem;
        }
        label {
          font-size: 1.5rem;
          margin: 0 0.2rem 0 0;
        }
        input[type="text"] {
          width: 75px;
          padding: 0.2rem;
          margin: 0;
        }
        select {
          border-radius: 5px;
          padding: 0.2rem;
          margin: 0;
        }
        .fas.fa-trash-alt {
          font-size: 1.4rem;
          padding: 0 0.5rem;
          margin: 0;
        }
      }
    }
  }
}
</style>
