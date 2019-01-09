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
import { gj } from './demoFeatures'
import { bufferGeoJSON } from '../src/main'

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
    map = L.map('map', {
      minZoom: 1,
      maxZoom: 20,
      center: [0, 0],
      zoom: 2,
      crs: L.CRS.Simple
    })
    const orig = L.geoJSON(gj, {
      style: function (feature) {
        return {
          color: '#333333',
          opacity: 0.4
        };
      }    
    }).addTo(map)
    map.fitBounds(orig.getBounds())
    buffered = L.geoJSON([]).addTo(map)
    this.setBuffer()
  },
  methods: {
    format: function (val) {
      return 'Distance: ' + val + ' metres';
    },
    setBuffer: function () {
      buffered.clearLayers()
      gj.features.forEach(function (f) {
        if (this.slideVal < 0 && f.geometry.type === 'Polygon') {
          this.bufferFeature(f)    
        } else if (this.slideVal > 0) {   
          this.bufferFeature(f)    
        }

      }, this)
    },
    bufferFeature: function (f) {
      const out = bufferGeoJSON(f, this.slideVal, 'meters', this.steps)
      buffered.addData(out)   
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
