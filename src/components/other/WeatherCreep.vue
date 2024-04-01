<script lang="ts">
import {Options, Vue} from "vue-class-component";
import axios from "axios";
import {mapGetters} from "vuex";

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    pressure: number;
  };
  weather: [
    {
      id: number,
      main: string,
      description: string,
      icon: string
    }
  ];
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
      contentWidth: 0,
      marqueeWidth: 0,
      animationOffset: 0,
      isAnimating: false,
      animationFrameId: 0, // Идентификатор для requestAnimationFrame
    };
  },
  computed: {
    cities() {
      return ["Kyiv", "Odessa", "Kharkiv", "Dubai", "Antalya", "Shanghai", "Benidorm", "Valencia"].map((city, index) => {
        return this.$t(`cities.${city}`, index);
      });
    },
    ...mapGetters({
      vuexGetCountryName: 'getCountryName' // 'getCountryName' это имя геттера в Vuex хранилище
    }),
    countryName() {
      const countryCode = this.weather.sys.country;
      const language = this.$i18n.locale; // Получение текущего языка интерфейса
      return this.vuexGetCountryName(countryCode, language);
    }
  },
  mounted() {
    if (this.cityName) {
      // Вызываем getWeather только если cityName не пустое
      this.getWeather().then(() => {
        this.$nextTick(() => {
          const content = this.$refs.marquee.querySelector('.content');
          if (content) {
            // Дублируем содержимое
            const contentHTML = content.innerHTML;
            content.innerHTML += contentHTML;
            // Пересчитываем ширину после дублирования
            this.calculateWidths();
          }
        });
      });
    }
    this.$emit('update:cities', this.cities);
    // Следим за событием прокрутки, чтобы приостанавливать и возобновлять анимацию
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.calculateWidths);
  },
  watch: {
    speed(newSpeed: number) {
      // Обрабатываем изменение скорости
      this.updateAnimationSpeed(newSpeed);
    }
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
        this.weather = response.data; // Сохраняем данные о погоде напрямую из ответа

        // Обновляем DOM только после получения и обработки данных
        await this.$nextTick(this.calculateWidths);
        this.updateWeatherMarqueeContent(); // Метод для обновления содержимого бегущей строки
        this.setupAnimationListener();
      } catch (error) {
        console.error("Error fetching weather data:", error);
        this.loading = false;
        this.error = `${this.$t('error')}: ${this.$t('unknown-city')}`;
      } finally {
        this.loading = false;
      }
    },
    updateWeatherMarqueeContent() {
      if (!this.weather) return;

      const weatherInfo = [
        { key: this.$t('h2'), value: this.cityName, style: 'font-weight: bold; color: red; text-shadow: 1px 1px 2px gray;' },
        { key: this.$t('country'), value: this.countryName, style: 'font-weight: bold; color: blue; text-shadow: 1px 1px 2px gray;' },
        { key: this.$t('sunrise'), value: this.formatTime(this.weather.sys.sunrise), style: '' },
        { key: this.$t('sunset'), value: this.formatTime(this.weather.sys.sunset), style: '' },
        { key: this.$t('description'), value: `${this.weather.weather[0].description}`, style: '' },
        { key: this.$t('temp'), value: `${this.weather.main.temp}°C`, style: '' },
        { key: this.$t('feels'), value: `${this.weather.main.feels_like}°C`, style: '' },
        { key: this.$t('temp-min'), value: `${this.weather.main.temp_min}°C`, style: '' },
        { key: this.$t('temp-max'), value: `${this.weather.main.temp_max}°C`, style: '' },
        { key: this.$t('speed'), value: `${this.weather.wind.speed} m/s`, style: '' },
        { key: this.$t('direction'), value: `${this.weather.wind.deg}°`, style: '' },
        { key: this.$t('humidity'), value: `${this.weather.main.humidity}%`, style: '' },
        { key: this.$t('pressure'), value: `${this.weather.main.pressure} hPa`, style: '' }
      ];

      // Создаем HTML строку, добавляя стили и отступы к каждому элементу
      const marqueeContent = weatherInfo.map(info => {
        return `<span style="${info.style} margin-right: 2rem;"><span>${info.key}</span><span style="color: goldenrod;font-weight: bold;
margin-right:0.5rem">:</span><span style="color: darkmagenta; font-weight: bold; text-shadow: 1px 1px 2px green;">${info.value}</span></span>`;
      }).join('');

      // Умножаем содержимое, чтобы заполнить бегущую строку
      const repeatedContent = new Array(8).fill(marqueeContent).join('');

      // Находим элемент .content и обновляем его HTML
      const contentElement = this.$refs.marquee.querySelector('.content');
      if (contentElement) {
        contentElement.innerHTML = repeatedContent;
        this.calculateWidths();
      }
    },
    calculateWidths() {
      const marquee = this.$refs.marquee as HTMLElement | null;
      const content = marquee?.querySelector(".content") as HTMLElement | null;
      if (marquee && content) {
        this.marqueeWidth = marquee.offsetWidth;
        this.contentWidth = content.offsetWidth;
        // Устанавливаем начальное смещение таким образом, чтобы вторая копия была частично видима в конце первой копии
        this.animationOffset = this.contentWidth;
      }
    },
    setupAnimationListener() {
      window.addEventListener("resize", this.calculateWidths);
      this.animateMarquee();
    },
    animateMarquee() {
      if (this.isAnimating) return; // Проверка, выполняется ли уже анимация
      const step = () => {
        // Проверяем, проскроллена ли полностью первая копия содержимого
        if (this.animationOffset >= this.contentWidth) {
          // Если да, сбрасываем смещение на начало
          this.animationOffset = 0;
          // this.animationOffset -= this.contentWidth
        } else {
          // Иначе продолжаем анимацию
          this.animationOffset += this.speed;
        }
        const content = this.$refs.marquee?.querySelector(".content");
        if (content) {
          content.style.transform = `translateX(${-this.animationOffset}px)`;
        }
        if (this.isAnimating) {
          this.animationFrameId = requestAnimationFrame(step);
        }
      };
      this.isAnimating = true;
      requestAnimationFrame(step);
    },
    pauseAnimation() {
      // Приостановка анимации
      this.isAnimating = false;
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }
    },
    handleScroll() {
      const marqueeRect = this.$refs.marquee.getBoundingClientRect();
      if (marqueeRect.top < window.innerHeight && marqueeRect.bottom > 0) {
        if (!this.isAnimating) {
          this.animateMarquee();
        }
      } else {
        if (this.isAnimating) {
          this.pauseAnimation();
        }
      }
    },
    updateAnimationSpeed(newSpeed: number) {
      if (this.speed !== newSpeed) {
        this.speed = newSpeed; // Обновляем скорость в состоянии компонента
        // Перезапускаем анимацию с новой скоростью
        this.pauseAnimation();
        this.animateMarquee();
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
    cripView: {
      type: Boolean,
      required: true
    },
    speed: {
      type: Number,
      default: 1,
    },
  },
  components: {},
})
export default class WeatherCreep extends Vue {}
</script>

<template>
  <div class="inner" v-show="cripView && weather">
    <div ref="marquee" class="marquee">
      <div class="content">
        <!-- Вывод данных о погоде в бегущей строке -->
      </div>
    </div>
    <div v-if="loading" class="error">{{ $t('loading') }}</div>
    <div v-else class="error">{{ error }}</div>
  </div>
</template>

<style lang="scss" scoped>
.inner {
  margin-bottom: 1rem;
  overflow: hidden;
  position: relative;
  .marquee {
    overflow: hidden;
    position: relative;
    .content {
      white-space: nowrap;
      display: inline-block;
      font-size: 2rem;
      font-style: italic;
      padding: 0.5rem;
      margin: 0.5rem 1rem;
    }
  }
}
.error {
  font-size: 2rem;
  font-weight: bold;
  color: darkred;
  margin: 1rem auto;
}

@media(max-width: 1020px) {
  .inner {
    .marquee {
      .content {
        font-size: 1.6rem;
        padding: 0.4rem;
      }
    }
  }
  .error {
    font-size: 1.6rem;
    font-weight: bold;
    color: darkred;
    margin: 1rem auto;
  }
}
@media (max-width: 768px) {
  .inner {
    margin-bottom: 0.5rem;
    .marquee {
      .content {
        font-size: 1.5rem;
        padding: 0.3rem;
      }
    }
  }
  .error {
    font-size: 1.5rem;
    font-weight: bold;
    color: darkred;
    margin: 1rem auto;
  }
}
</style>