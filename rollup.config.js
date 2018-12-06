import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import butternut from 'rollup-plugin-butternut'

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/geojson-buffer.js',
    format: 'umd',
    name: 'geojsonBuffer',
    sourceMap: true
  },
  plugins: [
    resolve({
      module: true,
      jsnext: true,
      main: true
    }),
    commonjs(),
    babel({
      babelrc: false,
      presets: [['@babel/env', { modules: false }]]
    }),
    butternut()
  ]
}
