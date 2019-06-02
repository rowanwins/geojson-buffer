<template>
    <Row id="app">
      <Col span="6" class="sidebar">
        <Slider v-model="slideVal" :tip-format="format" :min="-50" :max="50" :step="1" @on-change="setBuffer"></Slider>
        <h3>Buffer distance</h3>

        <br><br><br>
        <Slider v-model="steps" :min="1" :max="100" :step="1" @on-change="setBuffer"></Slider>
        <h3>Steps on curved joins</h3>
      </Col>
      <Col span="18">
        <div id="map"></div>
      </Col>
  </Row>
</template>

<script>
// const poly = require('../../test/inputs/warsaw.json') 
import { poly } from './poly2'
import { bufferGeoJSON } from '../../src/main'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import marker2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// Hack to get the markers into Vue correctly
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
})

let map = null
let buffered = null
export default {
  name: 'app',
  data: function () {
    return {
      slideVal: 10,
      steps: 32
    }
  },
  mounted () {
    // console.log(poly)
    const orig = L.geoJSON(poly)
    let map = window.map = L.map('app', {
      crs: L.CRS.Simple
    }).fitBounds(orig.getBounds())  

    // orig.addTo(map)

    buffered = L.geoJSON([]).addTo(map)
    this.setBuffer()
  },
  methods: {
    format: function (val) {
      return 'Distance: ' + val + ' metres';
    },
    setBuffer: function () {
      buffered.clearLayers()
      this.bufferFeature(poly)
      // gj.features.forEach(function (f) {
      //   if (this.slideVal < 0 && f.geometry.type === 'Polygon') {
      //     this.bufferFeature(f)    
      //   } else if (this.slideVal > 0) {   
      //     this.bufferFeature(f)    
      //   }

      // }, this)
    },
    bufferFeature: function (f) {
      let out = bufferGeoJSON(f, this.slideVal, 'kilometers', this.steps)
      // console.log(JSON.stringify({
      //   type: 'MultiPolygon',
      //   coordinates: out
      // }))
      // buffered.addData({
      //   type: 'MultiPolygon',
      //   coordinates: out
      // })  
      // buffered.addData({
      //   type: 'Polygon',
      //   coordinates: [out.map(function (e) {
      //     return [e.x, e.y]
      //   })]
      // })   
    }
  }
}
</script>

<style>
    html, body, #app, .ivu-col, #map {
      height: 100%;
      margin: 0px;
    }
    .sidebar{
      padding: 50px;
    }

</style>
