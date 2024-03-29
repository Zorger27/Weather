<script>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import {FontLoader} from "three/examples/jsm/loaders/FontLoader";
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry";
import axios from "axios";

export default {
  name: 'WeatherCreep3d',
  props: {
    cripView3d: {
      type: Boolean,
      required: true
    },
  },
  setup() {
    const marquee = ref(null);
    let scene, camera, renderer, initialWeatherIndicators = [];

    const getWeather = async () => {

      try {
        const openWeatherMapToken = process.env["VUE_APP_OPENWEATHERMAP_TOKEN"];
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=Kyiv&units=metric&lang=ua&appid=${openWeatherMapToken}`
        );
        // this.weather = response.data; // Сохраняем данные о погоде напрямую из ответа

        // Преобразуем ответ от API в массив данных о погоде
        const weatherArray = [
          { key: 'City', value: response.data.name },
          { key: 'Sunrise', value: new Date(response.data.sys.sunrise * 1000).toLocaleTimeString() },
          { key: 'Sunset', value: new Date(response.data.sys.sunset * 1000).toLocaleTimeString() },
          { key: 'Temperature', value: `${response.data.main.temp} °C` },
          { key: 'Feels Like', value: `${response.data.main.feels_like} °C` },
          { key: 'Weather', value: response.data.weather[0].description },
          { key: 'Wind Speed', value: `${response.data.wind.speed} m/s` },
          { key: 'Pressure', value: `${response.data.main.pressure} hPa` },
          { key: 'Humidity', value: `${response.data.main.humidity}%` },
        ];

        // Перебираем полученные данные о погоде и создаем объекты для отображения в 3D
        weatherArray.forEach((weather) => {
          createWeatherObject(weather); // Вызываем функцию createWeatherObject для создания объекта погоды
        });

      } catch (error) {
        console.error(error);
      }
    };

    let nextPositionX = 0; // Стартовая позиция для первого объекта

    const createWeatherObject = (weather) => {
      const weatherInd = `${weather.key} = ${weather.value}`;
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

    const animate = () => {
      requestAnimationFrame(animate);

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
      initialWeatherIndicators
    };
  },
}
</script>

<template>
  <div class="inner" v-show="cripView3d">
    <div class="marquee" ref="marquee"></div>
  </div>
<!--  <div v-else-if="loading" class="error">{{ $t('loading') }}</div>-->
<!--  <div v-else class="error">{{ error }}</div>-->
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
//.error {
//  font-size: 2rem;
//  font-weight: bold;
//  color: darkred;
//  margin: 1rem auto;
//}

//@media(max-width: 1020px) {
//  .error {
//    font-size: 1.6rem;
//    font-weight: bold;
//    color: darkred;
//    margin: 1rem auto;
//  }
//}
//@media (max-width: 768px) {
//  .error {
//    font-size: 1.5rem;
//    font-weight: bold;
//    color: darkred;
//    margin: 1rem auto;
//  }
//}
</style>