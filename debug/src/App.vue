<template>
    <Row id="app">
      <Col span="6" class="sidebar">
        <Slider v-model="slideVal" :tip-format="format" :min="-50" :max="50" :step="1" @on-change="setBuffer"></Slider>
        <h3>Buffer distance</h3>

        <br><br><br>
        <Slider v-model="steps" :min="1" :max="100" :step="1" @on-change="setBuffer"></Slider>
        <h3>Steps on curved joins</h3>

        {{jtsperformance}}
        {{myperf}}
      </Col>
      <Col span="18">
        <div id="map"></div>
      </Col>
  </Row>
</template>

<script>
// import { poly } from './warsaw'
import { poly } from './poly2'
// import { poly } from './poly'

import { bufferGeoJSON } from '../../src/main'
const jsts = require('jsts')
const helpers = require('@turf/helpers')

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

let buffered = null
let bufferedJsts = null
export default {
    name: 'app',
    data: function () {
        return {
            slideVal: 1,
            steps: 32,
            jtsperformance: 0,
            myperf: 0
        }
    },
    mounted () {
        const orig = L.geoJSON(poly)
        const b = orig.getBounds()
        let map = window.map = L.map('map', {
            crs: L.CRS.Simple
        }).fitBounds(b)

        orig.addTo(map)

        bufferedJsts = L.geoJSON([], {
            color: 'red',
            fillOpacity: 0,
            weight: 6
        }).addTo(map)

        buffered = L.geoJSON([], {
            weight: 3
        }).addTo(map)

        this.setBuffer()
    },
    methods: {
        format: function (val) {
            return 'Distance: ' + val + ' metres'
        },
        setBuffer: function () {
            bufferedJsts.clearLayers()
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
            const deg = helpers.convertLength(this.slideVal, 'kilometers', 'degrees')
            console.time('jsts')
            let geom = new jsts.io.GeoJSONReader().read(f)
            let spBuffer = geom.geometry.buffer(deg, 32)
            const jtsOut = new jsts.io.GeoJSONWriter().write(spBuffer)
            console.timeEnd('jsts')
            bufferedJsts.addData(jtsOut)

            console.time('mine')
            let out = bufferGeoJSON(f, this.slideVal, 'kilometers', this.steps)
            console.timeEnd('mine')
            buffered.addData({
                type: 'MultiPolygon',
                coordinates: [out]
            })
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
