<script lang="ts">
import axios from "axios";
import {Options, Vue} from "vue-class-component";
import CurrentDate from "@/components/util/CurrentDate.vue";
import countryMappingMixin from "@/assets/file/countryMappingMixin";

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  },
}
@Options({
  mixins: [countryMappingMixin],
  data() {
    return {
      loading: true as boolean | undefined,
      error: null as string | null | undefined,
      weather: null as WeatherData | null,
      cityName: '' as string,
    };
  },
  computed: {
    cities() {
      return ["Kyiv", "Odessa", "Kharkiv", "Dubai", "Antalya", "Shanghai", "Benidorm", "Valencia"].map((city, index) => {
        return this.$t(`cities.${city}`, index);
      });
    }
  },
  mounted() {
    if (this.cityName) {
      this.getWeather();
    }
    this.$emit('update:cities', this.cities);
  },
  methods: {
    async getWeather() {
      this.loading = true;
      this.weather = null;
      this.error = null;

      try {
        const openWeatherMapToken = process.env["VUE_APP_OPENWEATHERMAP_TOKEN"];
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${this.cityName}&units=metric&lang=ua&appid=${openWeatherMapToken}`
        );
        this.weather = response.data;
      } catch (error) {
        console.error("Error fetching weather data:", error);
        // this.error = `${this.$t('error')}: Unknown City!`;
        this.error = `${this.$t('error')}: ${this.$t('unknown-city')}`;
      } finally {
        this.loading = false;
      }
    },
    saveCityToLocalStorage(city: string) {
      localStorage.setItem("weatherCity", city);
    },
    handleCityInputChange(city: string) {
      this.cityName = city;
      this.saveCityToLocalStorage(city);
    },
    updateCityName(city: string) {
      this.cityName = city;
      this.getWeather();
      this.saveCityToLocalStorage(city);
    },
    formatTime(timestamp: number) {
      const date = new Date(timestamp * 1000); // Преобразование в миллисекунды
      return date.toLocaleTimeString(); // Возвращает строку времени в формате по умолчанию
    },
    getCountryName(countryCode: string) {
      const language = this.$i18n.locale;
      if (this.countryMapping[countryCode] && this.countryMapping[countryCode][language]) {
        return this.countryMapping[countryCode][language];
      } else {
        // return "Unknown country";
        return this.$t('unknown-country');
      }
    },
  },
  props: {
    cityName: {
      type: String,
      required: true
    },
    tableView: {
      type: Boolean,
      required: true
    },
  },
  components: {CurrentDate},
})
export default class MyWeather extends Vue {}
</script>

<template>
  <div v-if="tableView && weather && weather.sys" class="table">
    <table>
      <thead>
      <tr>
        <th class="title" colspan="3">{{ $t('h1') }} {{ cityName }}</th>
      </tr>
      <tr>
        <th>№</th>
        <th>{{ $t('indicator') }}</th>
        <th>{{ $t('value') }}</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td class="nomer">1</td>
        <td class="name">{{ $t('country') }}</td>
        <td class="price">{{ getCountryName(weather.sys.country) }}</td>
      </tr>
      <tr>
        <td class="nomer">2</td>
        <td class="name">{{ $t('sunrise') }}</td>
        <td class="price">{{ formatTime(weather.sys.sunrise) }}</td>
      </tr>
      <tr>
        <td class="nomer">3</td>
        <td class="name">{{ $t('sunset') }}</td>
        <td class="price">{{ formatTime(weather.sys.sunset) }}</td>
      </tr>
      <tr>
        <td class="nomer">4</td>
        <td class="name">{{ $t('temp') }}</td>
        <td class="price">{{ weather.main.temp }}°C</td>
      </tr>
      <tr>
        <td class="nomer">5</td>
        <td class="name">{{ $t('feels') }}</td>
        <td class="price">{{ weather.main.feels_like }}°</td>
      </tr>
      <tr>
        <td class="nomer">6</td>
        <td class="name">{{ $t('temp-min') }}</td>
        <td class="price">{{ weather.main.temp_min }}°C</td>
      </tr>
      <tr>
        <td class="nomer">7</td>
        <td class="name">{{ $t('temp-max') }}</td>
        <td class="price">{{ weather.main.temp_max }}°C</td>
      </tr>
      <tr>
        <td class="nomer">8</td>
        <td class="name">{{ $t('speed') }}</td>
        <td class="price">{{ weather.wind.speed }} m/s</td>
      </tr>
      <tr>
        <td class="nomer">9</td>
        <td class="name">{{ $t('direction') }}</td>
        <td class="price">{{ weather.wind.deg }}°</td>
      </tr>
      <tr>
        <td class="nomer">10</td>
        <td class="name">{{ $t('humidity') }}</td>
        <td class="price">{{ weather.main.humidity }}%</td>
      </tr>
      <tr>
        <td class="nomer">11</td>
        <td class="name">{{ $t('pressure') }}</td>
        <td class="price">{{ weather.main.pressure }} hPa</td>
      </tr>
      </tbody>
    </table>
  </div>
  <div v-else-if="!tableView && weather" class="inner">
    <div class="city">
      <h1>{{ $t('h1') }}{{ this.cityName }}</h1>
      <div class="indicators" v-if="weather">
        <p class="country">{{ $t('country') }}: {{ getCountryName(weather.sys.country) }}</p>
        <p>{{ $t('sunrise') }}: {{ formatTime(weather.sys.sunrise) }}</p>
        <p>{{ $t('sunset') }}: {{ formatTime(weather.sys.sunset) }}</p>
        <line></line>
        <p>{{ $t('temp') }}: {{ weather.main.temp }}°C</p>
        <p>{{ $t('feels') }}: {{ weather.main.feels_like }}°C</p>
        <p>{{ $t('temp-min') }}: {{ weather.main.temp_min }}°C</p>
        <p>{{ $t('temp-max') }}: {{ weather.main.temp_max }}°C</p>
        <p>{{ $t('speed') }}: {{ weather.wind.speed }} m/s</p>
        <p>{{ $t('direction') }}: {{ weather.wind.deg }}°</p>
        <p>{{ $t('humidity') }}: {{ weather.main.humidity }}%</p>
        <p>{{ $t('pressure') }}: {{ weather.main.pressure }} hPa</p>
      </div>
    </div>
  </div>
  <div v-if="loading" class="error">{{ $t('loading') }}</div>
  <div v-if="error" class="error">{{ error }}</div>
</template>

<style lang="scss" scoped>
.table {
  .nomer {color: black;}
  .name {color: darkblue;}
  .price {color: darkmagenta;}
  .title {font-size: 2.3rem; color: darkblue;}
  background-image: url("@/assets/background/background05.webp");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}
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
    background-image: url("@/assets/background/background05.webp");
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;

    h1 {
      text-decoration: underline;
      font-size: 2.2rem;
      color: darkblue;
      margin: 0.5rem;
    }

    .indicators {
      color: black;
      font-size: 1.9rem;
      //font-weight: bold;
      display: inline-flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 0 1rem;

      p {margin: 0.3rem 0.5rem;}
      line {width: 100%;}
      .country {
        font-style: italic;
        color: #780485;
      }
    }
  }
}
.error {
  font-size: 2.2rem;
  font-weight: bold;
  color: darkred;
  margin: 1rem auto;
}

@media (max-width: 768px) {
  .table {
    margin-bottom: 0.7rem;
    .title {font-size: 1.8rem;}
  }

  .inner {
    display: flex;
    flex-direction: column;

    .city {
      padding: 0 0.5rem;
      margin: 0.7rem 0;
      h1 {
        font-size: 1.7rem;
        margin: 0.5rem 0 0.2rem 0;
      }

      .indicators {
        font-size: 1.4rem;
        font-weight: normal;
        padding: 0;
        p {margin: 0.2rem 0;}
        .country {
          font-size: 1.3rem;
          font-style: italic;
          color: #780485;
        }
      }
    }
  }
  .error {
    font-size: 1.7rem;
    font-weight: bold;
    color: darkred;
    margin: 1rem auto;
  }
}
</style>