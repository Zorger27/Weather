<script setup>
import { defineComponent, computed, ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import axios from 'axios';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

// Использование ref для реактивных данных
const store = useStore(); // Хранилище Vuex
const weather = ref(null);
const loading = ref(true);
const error = ref(null);
const cityName = ref('');
const marquee = ref(null);
const initialWeather = [];
let scene, camera, renderer;

// Определение компонента и его имени
const WeatherCreep3d = defineComponent({
  name: 'WeatherCreep3dV3.vue',
  props: {
    cripView3d: {
      type: Boolean,
      required: true
    }
  },
  setup(props) {
    const { t } = useI18n();
    // Вычисляемое свойство для городов
    const cities = computed(() => {
      return ["Kyiv", "Odessa", "Kharkiv", "Dubai", "Antalya", "Shanghai", "Benidorm", "Valencia"].map((city, index) => {
        return t(`cities.${city}`, index);
      });
    });
    // Вычисляемое свойство для имени страны
    const countryName = computed(() => {
      if (!weather.value || !weather.value.sys) return '';
      const countryCode = weather.value.sys.country;
      const language = this.$i18n.locale; // Получение текущего языка интерфейса
      return store.getters.getCountryName(countryCode, language);
    });

    const formatTime = (timestamp) => {
      const date = new Date(timestamp * 1000); // Преобразование в миллисекунды
      return date.toLocaleTimeString(); // Возвращает строку времени в формате по умолчанию
    };
    const saveCityToLocalStorage = (city) => {
      localStorage.setItem("weatherCity", city);
    };
    const handleCityInputChange = (city) => {
      cityName.value = city;
      saveCityToLocalStorage(city);
    };
    const updateCityName = (city) => {
      cityName.value = city;
      getWeather();
      saveCityToLocalStorage(city);
    };
    const getWeather = async () => {
      loading.value = true;
      weather.value = null;
      error.value = null;

      try {
        const openWeatherMapToken = process.env["VUE_APP_OPENWEATHERMAP_TOKEN"];
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityName.value}&units=metric&lang=ua&appid=${openWeatherMapToken}`
        );
        weather.value = response.data; // Сохраняем данные о погоде напрямую из ответа

        // Создаем объекты для отображения в 3D
        createWeatherObject(); // Вызываем функцию createWeatherObject для создания объекта погоды

      } catch (error) {
        console.error("Error fetching weather data:", error);
        loading.value = false;
        error.value = `${t('error')}: ${t('unknown-city')}`;
      } finally {
        loading.value = false;
      }
    };

    let nextPositionX = 0; // Стартовая позиция для первого объекта

    const createWeatherObject = () => {
      if (!weather.value) return;

      const weatherInfo = [
        { key: t('h2'), value: cityName.value },
        { key: t('country'), value: countryName.value },
        { key: t('sunrise'), value: formatTime(weather.value.sys.sunrise) },
        { key: t('sunset'), value: formatTime(weather.value.sys.sunset) },
        { key: t('temp'), value: `${weather.value.main.temp}°C` },
        { key: t('feels'), value: `${weather.value.main.feels_like}°C` },
        { key: t('temp-min'), value: `${weather.value.main.temp_min}°C` },
        { key: t('temp-max'), value: `${weather.value.main.temp_max}°C` },
        { key: t('speed'), value: `${weather.value.wind.speed} m/s` },
        { key: t('direction'), value: `${weather.value.wind.deg}°` },
        { key: t('humidity'), value: `${weather.value.main.humidity}%` },
        { key: t('pressure'), value: `${weather.value.main.pressure} hPa` }
      ];

      // Создаем строку
      const marqueeContent = weatherInfo.map(info => {return `${info.key}: ${info.value}`;}).join('');

      const loader = new FontLoader();

      loader.load('https://threejs.org/examples/fonts/droid/droid_serif_regular.typeface.json', (font) => {
        const geometry = new TextGeometry(marqueeContent, {
          font: font,
          size: 0.2,
          height: 0.02,
        });

        geometry.computeBoundingBox();
        const textWidth = geometry.boundingBox.max.x - geometry.boundingBox.min.x;

        const textureLoader = new THREE.TextureLoader();
        textureLoader.load('/assets/background/background04.webp', function (texture) {
          const material = new THREE.MeshBasicMaterial({ map: texture });
          const weatherObject = new THREE.Mesh(geometry, material);

          const RotationAngleY = 27; // Угол в градусах
          const RotationAngleX = -5; // Угол в градусах
          weatherObject.rotation.y = THREE.MathUtils.degToRad(RotationAngleY)
          weatherObject.rotation.x = THREE.MathUtils.degToRad(RotationAngleX)


          // Выставляем позицию с учетом предыдущего текста и добавляем "пробелы" между ними
          weatherObject.position.x = nextPositionX;
          // Обновляем nextPositionX для следующего объекта, добавляем ширину текущего текста и примерное расстояние для двух "пробелов"
          // Подберите значение 0.2 (или другое) в зависимости от желаемого расстояния между словами
          nextPositionX += textWidth + 0.2;

          initialWeather.push(weatherObject);
          scene.add(weatherObject);
        });
      });
    };

    const init = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 1.3;
      renderer = new THREE.WebGLRenderer({alpha: true});
      // renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      scene.add(camera);

      marquee.value.appendChild(renderer.domElement); // Здесь всё верно!!!

      getWeather();
      animate();
    };

    const animate = () => {
      requestAnimationFrame(animate);

      const speed = 0.01; // Скорость движения

      // Используем `initialCryptos` для итерации
      initialWeather.forEach((indicator, index) => {
        // Двигаем объекты влево
        indicator.position.x -= speed;

        // Вычисляем правую границу видимости для объекта
        if (indicator.geometry && indicator.geometry.boundingBox) {
          const objectRightEdge = indicator.position.x + (indicator.geometry.boundingBox.max.x - indicator.geometry.boundingBox.min.x);

          // Перемещаем объект обратно в начало, когда он полностью выходит за левую границу видимости
          if (objectRightEdge < -window.innerWidth / window.innerHeight * 2.5) {
            const lastIndicator = initialWeather[initialWeather.length - 1];
            const spaceBetween = 0.2; // Желаемое расстояние между объектами
            indicator.position.x = lastIndicator.position.x + lastIndicator.geometry.boundingBox.max.x - lastIndicator.geometry.boundingBox.min.x + spaceBetween;

            // Переупорядочиваем массив, чтобы сохранить последовательность
            initialWeather.splice(index, 1);
            initialWeather.push(indicator);
          }
        }
      });

      renderer.render(scene, camera);
    };

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', () => {
      onWindowResize();
    });

    onMounted(() => {
      init();
      onWindowResize();
      this.$emit('update:cities', cities.value);
    });

    onUnmounted(() => {
      renderer.dispose();
    });
    return { weather, loading, error, cityName, marquee };
  }
});
</script>

<template>
  <div class="inner" v-if="cripView3d">
    <div class="marquee" ref="marquee"></div>
  </div>
  <div v-else-if="loading" class="error">{{ $t('loading') }}</div>
  <div v-else class="error">{{ error }}</div>
</template>

<style lang="scss" scoped>
.inner {
  overflow: hidden;
  position: relative;
  .marquee {
    overflow: hidden;
    background: none;
  }
}
.error {
  font-size: 2rem;
  font-weight: bold;
  color: darkred;
  margin: 1rem auto;
}

@media(max-width: 1020px) {
  .error {
    font-size: 1.6rem;
    font-weight: bold;
    color: darkred;
    margin: 1rem auto;
  }
}
@media (max-width: 768px) {
  .error {
    font-size: 1.5rem;
    font-weight: bold;
    color: darkred;
    margin: 1rem auto;
  }
}
</style>