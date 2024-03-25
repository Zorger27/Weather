<script lang="ts">
import axios from "axios";
import {Options, Vue} from "vue-class-component";
import CurrentDate from "@/components/util/CurrentDate.vue";

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
}
@Options({
  data() {
    return {
      loading: true,
      error: null,
      cityName: this.$t("cities.Kyiv"),
      cities: ["Kyiv", "Odessa", "Kharkiv", "Dubai", "Antalya", "Shanghai", "Benidorm", "Valencia"].map((city, index) => {
        return this.$t(`cities.${city}`, index);
      }),
    };
  },
  components: {CurrentDate},
})
export default class MyWeather extends Vue {
  error: string | null | undefined;
  loading: boolean | undefined;
  weather: WeatherData | null = null;
  cityName!: string;

  getWeather() {
    this.loading = true;
    this.weather = null;
    this.error = null;

    const openWeatherMapToken = process.env.VUE_APP_OPENWEATHERMAP_TOKEN;
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${this.cityName}&units=metric&lang=ua&appid=${openWeatherMapToken}`
      )
      .then(response => {
        this.weather = response.data;
      })
      .catch(error => {
        this.error = `${this.$t('error')}`;
      })
      .finally(() => {
        this.loading = false;
      });
  }
  saveCityToLocalStorage(city: string) {
    localStorage.setItem("weatherCity", city);
  }
  handleCityInputChange(city: string) {
    this.cityName = city;
    this.saveCityToLocalStorage(city);
  }
  updateCityName(city: string) {
    this.cityName = city;
    this.getWeather();
    this.saveCityToLocalStorage(city);
  }

  mounted() {
    const selectedCity = localStorage.getItem("weatherCity");
    if (selectedCity) {
      this.cityName = selectedCity;
    }
    this.getWeather();
  }
}
</script>

<template>
  <div class="inner">
    <div class="city">
      <div class="input-group">
        <label for="city">{{ $t('city') }}</label>
        <input type="text" id="city" v-model="cityName" @input="handleCityInputChange(cityName)" @keydown.enter="getWeather"/>
        <button class="get" @click="getWeather" :title="$t('btn')">{{ $t('get') }}</button>
        <button class="getMobile" @click="getWeather" :title="$t('btn')"><i class="fas fa-arrow-circle-down"></i></button>
        <select class="city-list" v-model="cityName" @change="updateCityName(cityName)">
          <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
        </select>
      </div>
      <h1>{{ $t('h1') }}{{ this.cityName }}</h1>
<!--      <CurrentDate></CurrentDate>-->
      <div v-if="loading">{{ $t('loading') }}</div>
      <div v-if="error">{{ error }}</div>
      <div class="indicators" v-if="weather">
        <p>{{ $t('temp') }}: {{ weather.main.temp }}°C</p>
        <p>{{ $t('feels') }}: {{ weather.main.feels_like }}°C</p>
        <p>{{ $t('speed') }}: {{ weather.wind.speed }} m/s</p>
        <p>{{ $t('direction') }}: {{ weather.wind.deg }}°</p>
        <p>{{ $t('humidity') }}: {{ weather.main.humidity }}%</p>
        <p>{{ $t('pressure') }}: {{ weather.main.pressure }} hPa</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.inner {
  display: inline-flex;
  justify-content: center;
  align-items: center;

  .city {
    display: inline-flex;
    flex-direction: column;
    padding: 0 1rem 1rem 1rem;
    margin: 1rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.7);
    //box-shadow: 3px 3px 4px 0 lightgrey;
    background-image: url("@/assets/background/background02.webp");
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    .input-group {
      .getMobile {
        display: none;
      }
      .get {
        display: inline-flex;
      }
      label, input, button, select {
        margin: 1rem 0.4rem 0 0;
        font-size: 1.5rem;
      }
      label {
        font-weight: bold;
      }
      input[type="text"] {
        flex: 1 0 auto;
        color: black;
        caret-color: red;
        border: 1px solid #ddd;
        border-radius: 5px;
        width: 120px;
        padding: 0.4rem;
      }
      input:active, :focus {
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
      }
    }

    h1 {
      text-decoration: underline;
      color: darkblue;
      margin: 0.5rem;
    }

    .indicators {
      font-weight: bold;
      display: inline-flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 0 1rem 0 1rem;

      p {
        margin: 0.5rem;
      }
    }
  }
}

@media (max-width: 768px) {
  .inner {
    display: flex;
    flex-direction: column;

    .city {
      h1 {
        margin: 0.5rem 0 0.2rem 0;
      }

      .input-group {
        justify-content: center;
        align-items: center;
        .get {
          display: none;
        }
        .getMobile {
          display: inline-flex;
          border-color: #ddd;
          color: lightskyblue;
          padding: 0.27rem;
          font-size: 1.1rem;
        }

        label, input, button, select {
          margin: 1rem 0.2rem 0 0.2rem;
          font-size: 1rem;
        }
        input[type="text"] {
          width: 75px;
          padding: 0.2rem;
        }
        select {
          border-radius: 5px;
          padding: 0.2rem;
        }
      }
      .indicators {
        padding: 0;

        p {
          margin: 0.2rem 0;
        }
      }
    }
  }
}
</style>