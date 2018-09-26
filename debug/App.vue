<template>
  <div id="app">
    <div id="map"></div>

  </div>
</template>

<script>

import { polygon } from '../test/harness/polygon'
import { polygonCollection } from '../test/harness/polygonCollection'
import { australia } from '../test/harness/australia'
import { Graph } from '../src/main'

export default {
  name: 'app',
  mounted () {
    var map = window.map = L.map('map', {
      minZoom: 1,
      maxZoom: 20,
      center: [0, 0],
      zoom: 2,
      crs: L.CRS.Simple
    })
    var selectionLayer = L.layerGroup([]).addTo(map)


    var polyLayer = L.geoJson(australia).addTo(map)
    map.fitBounds(polyLayer.getBounds(), {
      padding: [20, 20]
    })
  }
}
</script>

<style>
    html, body, #app, #map {
      width: 100%;
      height: 100%;
      margin: 0px;
    }

  .leaflet-div-icon {
    background: white;
    border: 2px solid;
    border-radius:  60%;
  }

  .leaflet-marker-icon .number{
    position: relative;
    top: 4px;
    font-size: 12px;
    width: 2 6px;
    height: 2 6px;
    text-align: center;
  }
</style>
