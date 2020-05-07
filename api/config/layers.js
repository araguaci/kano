const path = require('path')
const glob = require('glob')
const makeDebug = require('debug')
const debug = makeDebug('kano:layers')

// Override defaults if env provided
const kargoDomain = (process.env.SUBDOMAIN ? process.env.SUBDOMAIN : 'test.kalisio.xyz')
const wmtsUrl = (process.env.API_GATEWAY ? 'https://api.' + kargoDomain + '/wmts' : 'https://mapproxy.' + kargoDomain + '/wmts')
const wmsUrl = (process.env.API_GATEWAY ? 'https://api.' + kargoDomain + '/wms' : 'https://mapproxy.' + kargoDomain + '/wms')
const wcsUrl = (process.env.API_GATEWAY ? 'https://api.' + kargoDomain + '/wcs' : 'https://mapserver.' + kargoDomain + '/cgi-bin/ows')
const k2Url = (process.env.API_GATEWAY ? 'https://api.' + kargoDomain + '/k2' : 'https://k2.' + kargoDomain)
const maptilerUrl = (process.env.API_GATEWAY ? 'https://api.' + kargoDomain + '/maptiler' : 'https://api.maptiler.com/')
const s3Url = (process.env.API_GATEWAY ? 'https://api.' + kargoDomain + '/s3' : 'https://s3.eu-central-1.amazonaws.com')
const forecastZIndex = 300

// Request layer definition files
const layerFiles = glob.sync(path.join(__dirname, 'layers/**/*.js'))
debug('Processing the following layer definition files to build catalog from', layerFiles)

// Process them
let layers = []
layerFiles.forEach(layerFile => {
  let layersFromFile
  try {
    layersFromFile = require(layerFile)
  } catch (error) {
    console.error(error)
  }
  // Layers provided through a generation function ?
  if (typeof layersFromFile === 'function') layersFromFile = layersFromFile({ wmtsUrl, wmsUrl, wcsUrl, k2Url, s3Url, maptilerUrl })
  // Layers directly provided as array or object
  else if (!Array.isArray(layersFromFile)) layersFromFile = [layersFromFile]
  layers = layers.concat(layersFromFile)
})
debug(`Found ${layers.length} layer definitions to build catalog from`)

// No layers by default
let filter = []
// Now build filter according any env filter
if (process.env.LAYERS_FILTER) {
  // Check for separator, whitespace or comme is supported
  if (process.env.LAYERS_FILTER.includes(',')) filter = process.env.LAYERS_FILTER.split(',')
  else filter = process.env.LAYERS_FILTER.split(' ')
}
// Now filter layers
// Manage translation keys starting with 'Layers.'
debug('Applying layer filter', filter)
layers = layers.filter(layer => {
  const isFiltered = !filter.includes(layer.name.replace('Layers.', ''))
  if (isFiltered) debug(`Filtering ${layer.name} from catalog`)
  return !isFiltered
})

module.exports = layers
