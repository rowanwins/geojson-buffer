<template>
    <Row id="app">
      <Col span="6" class="sidebar">

        <h3>Library</h3>
        <Button @click="useGeojson" :type="library == 'geojson' ? 'success' : undefined">geojson-buffer</Button>
        <Button @click="useJSTS" :type="library == 'jsts' ? 'success' : undefined">JSTS</Button>
        <br/><br/>
        <h3>Buffer distance</h3>
        <Slider v-model="slideVal" :tip-format="format" :min="-50" :max="50" :step="1" @on-change="setBuffer"></Slider>
        <br/><br/>

        <h3>Steps on curved joins</h3>
        <Slider v-model="steps" :min="1" :max="100" :step="1" @on-change="setBuffer"></Slider>
          <br/><br/>

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
import { bufferGeoJSON } from '../../src/main'
import buffer from '@turf/buffer'
let map = null
let buffered = null
let library = bufferGeoJSON
let helper =null

export default {
  name: 'app',
  data: function () {
    return {
      slideVal: 10,
      steps: 32,
      vertices: 0,
      library: 'geojson'
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
      let out
      if (this.library === 'geojson') {
        out = bufferGeoJSON(f, this.slideVal, 'meters', this.steps)
      } else {
        out = buffer(f, this.slideVal, {
          units: 'meters',
          steps: this.steps
        })
      }
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
