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
    let scene, camera, renderer, initialCryptos = [];
    let cryptosName = [
      { id: 'bitcoin', name: 'Bitcoin' },
      { id: 'ethereum', name: 'Ethereum' },
      { id: 'litecoin', name: 'Litecoin' },
      { id: 'tether', name: 'Tether' },
      { id: 'avalanche-2', name: 'Avalanche' },
      { id: 'filecoin', name: 'Filecoin' },
      { id: 'bitcoin-cash', name: 'Bitcoin Cash' },
      { id: 'binancecoin', name: 'BNB' },
      { id: 'dogecoin', name: 'Dogecoin' },
      { id: 'ripple', name: 'XRP' },
      { id: 'cardano', name: 'Cardano' },
      { id: 'polkadot', name: 'Polkadot' },
      { id: 'chainlink', name: 'Chainlink' },
      { id: 'stellar', name: 'Stellar' },
    ];

    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,litecoin,tether,avalanche-2,filecoin,bitcoin-cash,binancecoin,dogecoin,ripple,cardano,polkadot,chainlink,stellar&vs_currencies=usd');

        // Преобразуем ответ от API в массив данных о криптовалютах
        const selectedCryptos = Object.keys(response.data).map((id) => ({
          // Для каждой криптовалюты формируем объект с полями id, name и price
          id, // Идентификатор криптовалюты (например, "bitcoin")
          name: cryptosName.find((c) => c.id === id)?.name || '', // Имя криптовалюты
          price: response.data[id].usd, // Цена криптовалюты в долларах США
        }));

        // Перебираем полученные данные о криптовалютах и создаем объекты для отображения в 3D
        selectedCryptos.forEach((crypto) => {
          createCryptosObject(crypto); // Вызываем функцию createCryptosObject для создания объекта криптовалюты
        });

      } catch (error) {
        console.error(error);
      }
    };

    let nextPositionX = 0; // Стартовая позиция для первого объекта

    const createCryptosObject = (crypto) => {
      const cryptosName = `${crypto.name} = ${crypto.price} usd`;
      const loader = new FontLoader();

      loader.load('https://threejs.org/examples/fonts/droid/droid_serif_regular.typeface.json', (font) => {
        const geometry = new TextGeometry(cryptosName, {
          font: font,
          size: 0.2,
          height: 0.02,
        });

        geometry.computeBoundingBox();
        const textWidth = geometry.boundingBox.max.x - geometry.boundingBox.min.x;

        const textureLoader = new THREE.TextureLoader();
        textureLoader.load('/assets/background/background04.webp', function (texture) {
          const material = new THREE.MeshBasicMaterial({ map: texture });
          const cryptosObject = new THREE.Mesh(geometry, material);

          const RotationAngleY = 27; // Угол в градусах
          const RotationAngleX = -5; // Угол в градусах
          cryptosObject.rotation.y = THREE.MathUtils.degToRad(RotationAngleY)
          cryptosObject.rotation.x = THREE.MathUtils.degToRad(RotationAngleX)


          // Выставляем позицию с учетом предыдущего текста и добавляем "пробелы" между ними
          cryptosObject.position.x = nextPositionX;
          // Обновляем nextPositionX для следующего объекта, добавляем ширину текущего текста и примерное расстояние для двух "пробелов"
          // Подберите значение 0.2 (или другое) в зависимости от желаемого расстояния между словами
          nextPositionX += textWidth + 0.2;

          initialCryptos.push(cryptosObject);
          scene.add(cryptosObject);
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

      fetchExchangeRates();
      animate();
    };

    const animate = () => {
      requestAnimationFrame(animate);

      const speed = 0.01; // Скорость движения

      // Используем `initialCryptos` для итерации
      initialCryptos.forEach((crypta, index) => {
        // Двигаем объекты влево
        crypta.position.x -= speed;

        // Вычисляем правую границу видимости для объекта
        if (crypta.geometry && crypta.geometry.boundingBox) {
          const objectRightEdge = crypta.position.x + (crypta.geometry.boundingBox.max.x - crypta.geometry.boundingBox.min.x);

          // Перемещаем объект обратно в начало, когда он полностью выходит за левую границу видимости
          if (objectRightEdge < -window.innerWidth / window.innerHeight * 2.5) {
            const lastCrypta = initialCryptos[initialCryptos.length - 1];
            const spaceBetween = 0.2; // Желаемое расстояние между объектами
            crypta.position.x = lastCrypta.position.x + lastCrypta.geometry.boundingBox.max.x - lastCrypta.geometry.boundingBox.min.x + spaceBetween;

            // Переупорядочиваем массив, чтобы сохранить последовательность
            initialCryptos.splice(index, 1);
            initialCryptos.push(crypta);
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

    const updateCameraPosition = () => {
      if (window.innerWidth <= 768) {
        camera.position.z = 1.3;
      } else {
        camera.position.z = 1.3;
      }
    };

    window.addEventListener('resize', () => {
      onWindowResize();
      updateCameraPosition();
    });

    onMounted(() => {
      init();
      onWindowResize();
      updateCameraPosition();
    });

    onUnmounted(() => {
      renderer.dispose();
    });

    return {
      marquee,
      initialCryptos
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