import { ref } from 'vue';
import 'leaflet/dist/leaflet.css';
import * as leaflet from 'leaflet';
import districtsJson from '../../assets/districts.json';

/**
 * Функция композиции карты.
 *
 * @returns {object} - Возвращает набор методов и параметров карты
 */
export default function useMap() {
  // Ссылка на карту
  const mapData = ref({});

  /**
   * Метод создания карты.
   *
   * @param {object|string} ref - Ссылка на элемент или id элемента, в который добавляем карту
   */
  function createMap(ref) {
    if (!ref) return;

    const mapboxAccessToken =
      'pk.eyJ1IjoicG9zZWxhIiwiYSI6ImNrd282bHh0aTJjczgyd21kYW1uemg2eDgifQ.6Tiz4FW5BBjAdzj_bpvsQA';
    const map = leaflet.map(ref).setView([55.7522200, 37.6155600], 10);

    mapData.value = map;

    leaflet.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`, {
      id: 'mapbox/light-v9',
      tileSize: 512,
      zoomOffset: -1,
    }).addTo(map);

    leaflet.geoJson(districtsJson).addTo(map);
  }


  return {
    mapData,
    createMap,
  }
}