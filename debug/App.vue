<template>
  <Row id="app">
    <Col span="6" class="sidebar">
      <h3>Library</h3>
      <Button @click="useGeojson">geojson-buffer</Button>
      <Button @click="useJSTS">JSTS</Button>
      <br />
      <br />
      <h3>Buffer distance</h3>
      <Slider
        v-model="slideVal"
        :tip-format="format"
        :min="-100"
        :max="100"
        :step="1"
        @on-input="setBuffer"
      ></Slider>
      <br />
      <h3>Steps on curved joins</h3>
      <Slider
        v-model="steps"
        :min="1"
        :max="20"
        :step="1"
        @on-input="setBuffer"
      ></Slider>
      <h3>Stats</h3>
      <p>Vertices: {{ vertices }}</p>
    </Col>
    <Col span="18">
      <div id="map"></div>
    </Col>
  </Row>
</template>

<script>
import { gj } from './demoFeatures'
import { bufferGeoJSON } from '../src/main'
import buffer from './buffer'
import explode from 'turf/src/explode'
import circle from 'turf/src/circle'

let map = null
let buffered = null
let helper = null
let library = bufferGeoJSON
export default {
  name: 'app',
  data: function() {
    return {
      library: 'geojson',
      slideVal: 40,
      steps: 2,
      vertices: 0
    }
  },
  mounted() {
    map = L.map('map', {
      minZoom: 1,
      maxZoom: 20,
      center: [0, 0],
      zoom: 2,
      crs: L.CRS.Simple
    })
    const orig = L.geoJSON(gj, {
      style: function(feature) {
        return {
          color: '#333333',
          opacity: 0.4
        }
      }
    }).addTo(map)
    map.fitBounds(orig.getBounds())
    buffered = L.geoJSON([], {
      pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {radius: 0.1, color: 'red'});
      }
    }).addTo(map)
    helper = L.geoJSON([]).addTo(map)
    this.setBuffer()
  },
  methods: {
    format: function(val) {
      return 'Distance: ' + val + ' metres'
    },
    useJSTS() {
      this.library = 'jsts'
      this.setBuffer()
    },
    useGeojson() {
      this.library = 'geojson'
      this.setBuffer()
    },
    setBuffer: function() {
      buffered.clearLayers()
      helper.clearLayers()
      this.vertices = 0

      gj.features.forEach(function(f) {
        try {
          if (this.slideVal < 0 && f.geometry.type === 'Polygon') {
            this.bufferFeature(f)
          } else if (this.slideVal > 0) {
            this.bufferFeature(f)
          }
        } catch (e) {
          console.error(e)
        }
      }, this)
    },
    bufferFeature: function(f) {
      let out
      if (this.library === 'geojson') {
        out = bufferGeoJSON(f, this.slideVal, 'meters', this.steps)
      } else {
        console.log(this.steps)
        out = buffer(f, this.slideVal, {
          units: 'meters',
          steps: this.steps
        })
      }
      buffered.addData(out)
      const exploded = explode(out)
      buffered.addData(exploded)
      this.vertices += exploded.features.length
    }
  }
}
</script>

<style>
html,
body,
#app,
.ivu-col,
#map {
  height: 100%;
  margin: 0px;
}
.sidebar {
  padding: 50px;
}
</style>
