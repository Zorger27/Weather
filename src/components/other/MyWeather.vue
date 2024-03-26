<script lang="ts">
import axios from "axios";
import {Options, Vue} from "vue-class-component";
import CurrentDate from "@/components/util/CurrentDate.vue";

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
  data() {
    return {
      loading: true as boolean | undefined,
      error: null as string | null | undefined,
      weather: null as WeatherData | null,
      cityName: '' as string,
      countryMapping: {
        "UA": "Украина",
        "US": "Соединенные Штаты",
        "GB": "Великобритания",
        "CA": "Канада",
        "DE": "Германия",
        "FR": "Франция",
        "IT": "Италия",
        "ES": "Испания",
        "RU": "Россия",
        "CN": "Китай",
        "JP": "Япония",
        "AU": "Австралия",
        "BR": "Бразилия",
        "IN": "Индия",
        "MX": "Мексика",
        "KR": "Южная Корея",
        "NL": "Нидерланды",
        "SE": "Швеция",
        "CH": "Швейцария",
        "SA": "Саудовская Аравия",
        "TR": "Турция",
        "AE": "Объединенные Арабские Эмираты"
      }
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
        this.error = `${this.$t('error')}: ${error}`;
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
  },
  props: {
    cityName: {
      type: String,
      required: true
    },
  },
  components: {CurrentDate},
})
export default class MyWeather extends Vue {}
</script>

<template>
  <div class="inner">
    <div class="city">
      <h1>{{ $t('h1') }}{{ this.cityName }}</h1>
      <div v-if="loading">{{ $t('loading') }}</div>
      <div v-if="error">{{ error }}</div>
      <div class="indicators" v-if="weather">
        <p>country: {{ countryMapping[weather.sys.country] }}</p>
        <p>sunrise: {{ formatTime(weather.sys.sunrise) }}</p>
        <p>sunset: {{ formatTime(weather.sys.sunset) }}</p>
        <p>{{ $t('temp') }}: {{ weather.main.temp }}°C</p>
        <p>{{ $t('feels') }}: {{ weather.main.feels_like }}°C</p>
        <p>temp_min: {{ weather.main.temp_min }}°C</p>
        <p>temp_max: {{ weather.main.temp_max }}°C</p>
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