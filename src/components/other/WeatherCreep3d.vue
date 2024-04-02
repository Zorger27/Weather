<script>
import {ref, onMounted, onUnmounted, watch, computed} from 'vue';
import * as THREE from 'three';
import {FontLoader} from "three/examples/jsm/loaders/FontLoader";
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry";
import axios from "axios";
import {useI18n} from "vue-i18n";
import { useStore } from 'vuex';

export default {
  name: 'WeatherCreep3d',
  props: {
    cripView3d: {
      type: Boolean,
      required: true
    },
    cityName: {
      type: String,
    },
  },
  emits: ['update:cityName', 'update:cities'],
  setup(props, { emit }) {
    const { t, locale } = useI18n();
    const store = useStore(); // Хранилище Vuex
    const marquee = ref(null);
    const weather = ref(null);
    const loading = ref(true);
    const error = ref(null);
    const countryCode = ref(''); // Объявляем здесь, чтобы было доступно везде в setup()
    const countryName = ref(''); // Переменная для хранения имени страны
    let scene, camera, renderer, initialWeatherIndicators = [];

    // Вычисляемое свойство для городов
    const cities = computed(() => {
      return ["Kyiv", "Odessa", "Kharkiv", "Dubai", "Antalya", "Shanghai", "Benidorm", "Valencia"].map(city => {
        return t(`cities.${city}`);
      });
    });

    // Следим за изменениями locale, чтобы обновлять countryName
    watch(locale, (newLocale) => {
      // Теперь проверка на countryCode.value актуальна, так как countryCode объявлено вне getWeather
      if (countryCode.value) {
        countryName.value = store.getters.getCountryName(countryCode.value, newLocale);
      }
    });
    watch(() => props.cityName, (newCityName) => {
      // Здесь можно обработать изменение города.
      // Например, обновить локальные данные, повторно запросить данные о погоде и т.д.
      handleCityInputChange(newCityName);
      updateCityName(newCityName);
      getWeather();
    });

    const saveCityToLocalStorage = (city) => {
      localStorage.setItem("weatherCity", city);
    };
    const handleCityInputChange = async (city) => {
      // Очищаем предыдущие данные о погоде
      clearWeatherData();
      // Запускаем анимацию немедленно после очистки данных
      animate();
      // Эмитируем событие вместе с новым значением города
      emit('update:cityName', city);
      await getWeather();
      saveCityToLocalStorage(city);
    };

    const updateCityName = async (city) => {
      // Очищаем предыдущие данные о погоде
      clearWeatherData();
      // Запускаем анимацию немедленно после очистки данных
      animate();
      // Эмитируем изменение имени города, вместо прямого изменения пропса
      // props.cityName = city;
      emit('update:cityName', city);
      emit('update:cities', cities.value); // Обновление списка городов, если это необходимо
      await getWeather();
      saveCityToLocalStorage(city);
    };

    const clearWeatherData = () => {
      // Очищаем предыдущие данные о погоде
      initialWeatherIndicators.forEach(indicator => {
        scene.remove(indicator); // Удаляем объекты из сцены
      });
      initialWeatherIndicators = []; // Очищаем массив объектов
      renderer.renderLists.dispose(); // Очищаем кэш рендерера

      // Остановить анимацию после очистки данных о погоде, используя сохраненный ID
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null; // Сброс ID анимации, чтобы избежать его повторной отмены
      }
    };

    const getWeather = async () => {
      loading.value = true;
      weather.value = null;
      error.value = null;
      try {
        const openWeatherMapToken = process.env["VUE_APP_OPENWEATHERMAP_TOKEN"];
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${props.cityName}&units=metric&lang=ua&appid=${openWeatherMapToken}`
        );

        // Обновляем countryCode
        countryCode.value = response.data.sys.country;
        // Обновляем countryName в зависимости от полученного countryCode и текущего языка интерфейса
        countryName.value = store.getters.getCountryName(countryCode.value, locale.value);

        // Преобразуем ответ от API в массив данных о погоде
        const weatherArray = [
          { key: t('h2'), value: props.cityName },
          { key: t('country'), value: countryName.value },
          { key: t('sunrise'), value: new Date(response.data.sys.sunrise * 1000).toLocaleTimeString() },
          { key: t('sunset'), value: new Date(response.data.sys.sunset * 1000).toLocaleTimeString() },
          { key: t('description'), value: response.data.weather[0].description },
          { key: t('temp'), value: `${response.data.main.temp} °C` },
          { key: t('feels'), value: `${response.data.main.feels_like} °C` },
          { key: t('temp-min'), value: `${response.data.main.temp_min} °C` },
          { key: t('temp-max'), value: `${response.data.main.temp_max} °C` },
          { key: t('speed'), value: `${response.data.wind.speed} m/s` },
          { key: t('direction'), value: `${response.data.wind.deg}°` },
          { key: t('humidity'), value: `${response.data.main.humidity}%` },
          { key: t('pressure'), value: `${response.data.main.pressure} hPa` },
        ];

        // Перебираем полученные данные о погоде и создаем объекты для отображения в 3D
        weatherArray.forEach((weather) => {
          createWeatherObject(weather); // Вызываем функцию createWeatherObject для создания объекта погоды
        });
        // Загрузка данных о погоде успешно завершена
        loading.value = false;
      } catch (error) {
        // Обработка ошибки при загрузке данных о погоде
        console.error("Error fetching weather data:", error);
        loading.value = false;
        error.value = `${t('error')}: ${t('unknown-city')}`;
      } finally {
        loading.value = false;
      }
    };
    // // Вызываем getWeather при инициализации
    // getWeather();

    let nextPositionX = 0; // Стартовая позиция для первого объекта

    const createWeatherObject = (weather) => {
      const weatherInd = `${weather.key}: ${weather.value}`;
      const loader = new FontLoader();

      loader.load('https://threejs.org/examples/fonts/droid/droid_serif_regular.typeface.json', (font) => {
        const geometry = new TextGeometry(weatherInd, {
          font: font,
          size: 0.2,
          height: 0.02,
        });

        geometry.computeBoundingBox();
        const textWidth = geometry.boundingBox.max.x - geometry.boundingBox.min.x;

        const textureLoader = new THREE.TextureLoader();
        textureLoader.load('/assets/img/textures/texture03.webp', function (texture) {
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

          initialWeatherIndicators.push(weatherObject);
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

      marquee.value.appendChild(renderer.domElement);

      getWeather();
      animate();
    };

    let animationId = null; // Глобальная переменная для хранения ID анимации

    const animate = () => {
      // requestAnimationFrame(animate);

      // Отменяем предыдущую запланированную анимацию (если она есть)
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
      }
      const speed = 0.01; // Скорость движения

      // Используем `initialWeatherIndicators` для итерации
      initialWeatherIndicators.forEach((indicator, index) => {
        // Двигаем объекты влево
        indicator.position.x -= speed;

        // Вычисляем правую границу видимости для объекта
        if (indicator.geometry && indicator.geometry.boundingBox) {
          const objectRightEdge = indicator.position.x + (indicator.geometry.boundingBox.max.x - indicator.geometry.boundingBox.min.x);

          // Перемещаем объект обратно в начало, когда он полностью выходит за левую границу видимости
          if (objectRightEdge < -window.innerWidth / window.innerHeight * 2.5) {
            const lastIndicator = initialWeatherIndicators[initialWeatherIndicators.length - 1];
            const spaceBetween = 0.2; // Желаемое расстояние между объектами
            indicator.position.x = lastIndicator.position.x + lastIndicator.geometry.boundingBox.max.x - lastIndicator.geometry.boundingBox.min.x + spaceBetween;

            // Переупорядочиваем массив, чтобы сохранить последовательность
            initialWeatherIndicators.splice(index, 1);
            initialWeatherIndicators.push(indicator);
          }
        }
      });

      renderer.render(scene, camera);

      // Запланировать следующий кадр анимации
      animationId = requestAnimationFrame(animate);
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
    });

    onUnmounted(() => {
      renderer.dispose();
    });

    return {
      marquee,
      weather,
      loading,
      error,
      countryName,
      cities,
      getWeather, // Экспорт функции, если вызывать её из шаблона
      handleCityInputChange,
      updateCityName,
      initialWeatherIndicators,
    };
  },
}
</script>

<template>
  <div class="inner" v-show="cripView3d">
    <div class="marquee" ref="marquee"></div>
    <div v-if="loading" class="error">{{ $t('loading') }}</div>
    <div v-else class="error">{{ error }}</div>
  </div>
</template>

<style lang="scss" scoped>
.inner {
  overflow: hidden;
  position: relative;

  .marquee {
    overflow: hidden;
    background: none;
  }
  .error {
    font-size: 2rem;
    font-weight: bold;
    color: darkred;
    margin: 1rem auto;
  }
}

@media(max-width: 1020px) {
  .inner {
    .error {
      font-size: 1.6rem;
      font-weight: bold;
      color: darkred;
      margin: 1rem auto;
    }
  }
}
@media (max-width: 768px) {
  .inner {
    .error {
      font-size: 1.5rem;
      font-weight: bold;
      color: darkred;
      margin: 1rem auto;
    }
  }
}
</style>