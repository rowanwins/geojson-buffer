<template>
  <Row id="app">
    <Col span="6" class="sidebar">
      <h3>Library</h3>
      <Button
        @click="useLibrary('geojson')"
        :type="library == 'geojson' ? 'success' : undefined"
        >geojson-buffer</Button
      >
      <Button
        @click="useLibrary('jsts')"
        :type="library == 'jsts' ? 'success' : undefined"
        >JSTS</Button
      >
      <br />
      <br />
      <h3>Example</h3>
      <Button
        @click="useExample('gj')"
        :type="example == 'gj' ? 'success' : undefined"
        >Simple</Button
      >
      <Button
        @click="useExample('warsaw')"
        :type="example == 'warsaw' ? 'success' : undefined"
        >Warsaw</Button
      >
      <br />
      <br />
      <h3>Buffer distance (meters)</h3>
      <Slider
        v-model="slideVal"
        :tip-format="format"
        :min="-200"
        :max="1000"
        :step="1"
        @on-input="setBuffer"
      ></Slider>
      <br />
      <h3>Steps for joins</h3>
      <Slider
        v-model="steps"
        :min="1"
        :max="20"
        :step="1"
        @on-change="setBuffer"
      ></Slider>
      <h3>Stats</h3>
      <p>Vertices: {{ vertices }}</p>
      <p>Performance: {{ performance }}ms</p>
    </Col>
    <Col span="18">
      <div id="map"></div>
    </Col>
  </Row>
</template>

<script>
import { gj, warsaw } from './demoFeatures'
import { bufferGeoJSON } from '../src/main'
import buffer from './buffer'
import explode from 'turf/src/explode'
import circle from 'turf/src/circle'

let map = null
let buffered = null
let orig = null
let data = null

export default {
  name: 'app',
  data: function() {
    return {
      example: 'gj',
      library: 'geojson',
      slideVal: 40,
      steps: 2,
      vertices: 0,
      performance: 0
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
    orig = L.geoJSON([], {
      style: function(feature) {
        return {
          color: '#333333',
          opacity: 0.4
        }
      }
    }).addTo(map)
    buffered = L.geoJSON([], {
      pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, { radius: 0.1, color: 'red' })
      }
    }).addTo(map)
    this.useExample('gj')
    this.setBuffer()
  },
  methods: {
    format: function(val) {
      return 'Distance: ' + val + ' metres'
    },
    useExample(example) {
      this.example = example
      data = this.example === 'gj' ? gj : warsaw
      orig.clearLayers()
      orig.addData(data)
      map.fitBounds(orig.getBounds())
      this.setBuffer()
    },
    useLibrary(lib) {
      this.library = lib
      this.setBuffer()
    },
    setBuffer: function() {
      buffered.clearLayers()
      this.vertices = 0

      const start = performance.now()
      let i = 0
      let out = []
      let iterations = 1
      for (let i = 0; i < iterations; i++) {
        out = []
        data.features.forEach(f => {
          try {
            if (this.library === 'geojson') {
              out.push(bufferGeoJSON(f, this.slideVal, 'meters', this.steps))
            } else {
              out.push(
                buffer(f, this.slideVal * 1.084, {
                  units: 'meters',
                  steps: this.steps
                })
              )
            }
          } catch (e) {
            console.error(e)
          }
        })
      }

      this.performance =
        Math.round(((performance.now() - start) * 100) / iterations) / 100
      out.forEach(o => this.bufferFeature(o))
    },
    bufferFeature: function(out) {
      if (out) {
        buffered.addData(out)
        const exploded = explode(out)
        buffered.addData(exploded)
        this.vertices += exploded.features.length
      }
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
