module.exports = function ({ wmtsUrl, wmsUrl, wcsUrl, k2Url, s3Url }) {
  return [
    {
      name: 'Layers.METAR',
      description: 'Layers.METAR_DESCRIPTION',
      i18n: {
        fr: {
          Layers: {
            METAR: 'METAR',
            METAR_DESCRIPTION: 'Observations METAR'
          },
          Variables: {
            TEMPERATURE: 'Température',
            DEWPOINT: 'Point de rosée',
            WIND_SPEED: 'Vitesse',
            WIND_DIRECTION: 'Direction',
            WIND_GUST: 'Rafales',
            VISIBILITY: 'Visiblité'
          }
        },
        en: {
          Layers: {
            METAR: 'METAR',
            METAR_DESCRIPTION: 'METAR Observations'
          },
          Variables: {
            TEMPERATURE: 'Temperature',
            DEWPOINT: 'Dew point',
            WIND_SPEED: 'Speed',
            WIND_DIRECTION: 'Direction',
            WIND_GUST: 'Gust',
            VISIBILITY: 'Visibility'
          }
        }
      },
      tags: [
        'weather', 'measure'
      ],
      attribution: '',
      type: 'OverlayLayer',
      service: 'metar-taf-observations',
      dbName: (process.env.DATA_DB_URL ? 'data' : undefined),
      probeService: 'metar-taf-stations',
      featureId: 'icao',
      featureIdType: 'string',
      featureLabel: 'name',
      from: 'P-7D',
      to: 'PT',
      every: 'PT30M',
      queryFrom: 'PT-5H',
      variables: [
        {
          name: 'temperature',
          label: 'Variables.TEMPERATURE',
          units: [
            'degC', 'degF', 'K'
          ],
          range: [-50, 50],
          chartjs: {
            backgroundColor: '#510861',
            borderColor: '#510861',
            fill: false
          }
        },
        {
          name: 'dewpoint',
          label: 'Variables.DEWPOINT',
          units: [
            'degC', 'degF', 'K'
          ],
          range: [-50, 50],
          chartjs: {
            backgroundColor: '#D566ed',
            borderColor: '#D566ed',
            fill: false
          }
        },
        {
          name: 'windSpeed',
          label: 'Variables.WIND_SPEED',
          units: [
            'kt', 'm/s', 'km/h'
          ],
          range: [0, 70],
          step: 1,
          chartjs: {
            backgroundColor: '#E38020',
            borderColor: '#E38020',
            fill: false,
            yAxis: {
              ticks: {
                min: 0
              }
            }
          }
        },
        {
          name: 'windGust',
          label: 'Variables.WIND_GUST',
          units: [
            'kt', 'm/s', 'km/h'
          ],
          range: [0, 100],
          step: 1,
          chartjs: {
            backgroundColor: '#Dd350b',
            borderColor: '#Dd350b',
            fill: false,
            yAxis: {
              ticks: {
                min: 0
              }
            }
          }
        },
        {
          name: 'windDirection',
          label: 'Variables.WIND_DIRECTION',
          units: [
            'deg'
          ],
          range: [0, 360],
          step: 1,
          chartjs: {
            backgroundColor: '#3F7FBF',
            borderColor: '#3F7FBF',
            fill: false
          }
        },
        {
          name: 'visibility',
          label: 'Variables.VISIBILITY',
          units: [
            'mi', 'km', 'm'
          ],
          range: [0, 10000],
          step: 1,
          chartjs: {
            backgroundColor: '#4a9029',
            borderColor: '#4a9029',
            fill: false
          }
        }
      ],
      leaflet: {
        type: 'geoJson',
        realtime: true,
        tiled: true,
        minZoom: 6,
        minFeatureZoom: 9,
        cluster: { disableClusteringAtZoom: 18 },
        'marker-color': `<% if (_.has(properties, 'rawOb')) { %>#666666<% }
                          else if (feature.measureRequestIssued) { %>black<% }
                          else { %>white<% } %>`,
        'stroke-color': `<% if (_.has(properties, 'rawOb')) { %>transparent<% }
                          else if (feature.measureRequestIssued) { %>white<% }
                          else { %>black<% } %>`,
        'icon-color': `<% if (_.get(properties, 'cloudCover') === 'FEW') { %>#f5e790<% }
                          else if (_.get(properties, 'cloudCover') === 'SCT') { %>#f5edbc<% }
                          else if (_.get(properties, 'cloudCover') === 'BKN') { %>#cfcab0<% }
                          else if (_.get(properties, 'cloudCover') === 'OVC') { %>#d6d5cb<% }
                          else if (_.has(properties, 'cloudCover')) { %>#f5e05b<% }
                          else if (feature.measureRequestIssued) { %>white<% }
                          else { %>black<% } %>`,
        'icon-classes': `<% if (_.get(properties, 'cloudCover') === 'FEW') { %>fa fa-cloud-sun<% }
                            else if (_.get(properties, 'cloudCover') === 'SCT') { %>fa fa-cloud-sun<% }
                            else if (_.get(properties, 'cloudCover') === 'BKN') { %>fa fa-cloud<% }
                            else if (_.get(properties, 'cloudCover') === 'OVC') { %>fa fa-cloud<% }
                            else if (_.has(properties, 'cloudCover')) { %>fa fa-sun<% }
                            else { %>fa fa-cloud-sun-rain<% } %>`,
        template: ['marker-color', 'stroke-color', 'icon-color', 'icon-classes'],
        popup: {
          pick: [
            'name'
          ]
        },
        tooltip: {
          template: `<% if (_.has(properties, 'temperature')) { %>Température = <%= Units.format(properties.temperature, 'degC') %></br><% }
                    if (_.has(properties, 'dewpoint')) { %>Point de rosée = <%= Units.format(properties.dewpoint, 'degC') %></br><% }
                    if (_.has(properties, 'windDirection')) { %>Direction du vent = <%= Units.format(properties.windDirection, 'deg') %></br><% }
                    if (_.has(properties, 'windSpeed')) { %>Vitesse du vent = <%= Units.format(properties.windSpeed, 'kt') %></br><% }
                    if (_.has(properties, 'windGust')) { %>Vitesse de rafale = <%= Units.format(properties.windGust, 'kt') %></br><% }
                    if (_.has(properties, 'visibility')) { %>Visibility = <%= Units.format(properties.visibility, 'mi') %></br><% }
                    if (_.has(feature, 'time.temperature')) { %><%= Time.format(feature.time.temperature, 'time.long') + ' - ' + Time.format(feature.time.temperature, 'date.short') %></br><% } %>`
        }
      },
      cesium: {
        type: 'geoJson',
        realtime: true,
        cluster: { pixelRange: 50 },
        'marker-symbol': 'air',
        'marker-color': '#0B7599',
        popup: {
          pick: [
            'name'
          ]
        },
        tooltip: {
          template: '<% if (_.has(properties, \'temperature\')) { %>Température = <%= Units.format(properties.temperature, \'degC\') %>\n<% }' +
                    'if (_.has(properties, \'dewpoint\')) { %>Point de rosée = <%= Units.format(properties.dewpoint, \'degC\') %>\n<% }' +
                    'if (_.has(properties, \'windDirection\')) { %>Direction du vent = <%= Units.format(properties.windDirection, \'degC\') %>\n<% }' +
                    'if (_.has(properties, \'windSpeed\')) { %>Vitesse du vent = <%= Units.format(properties.windSpeed, \'kt\') %>\n<% }' +
                    'if (_.has(properties, \'windGust\')) { %>Vitesse de rafale = <%= Units.format(properties.windGust, \'kt\') %>\n<% }' +
                    'if (_.has(properties, \'visibility\')) { %>Visibilité = <%= Units.format(properties.visibility, \'mi\') %>\n<% }' +
                    'if (_.has(feature, \'time.temperature\')) { %><%= Time.format(feature.time.temperature, \'time.long\') + \' - \' + Time.format(feature.time.temperature, \'date.short\') %>\n<% } %>'
        }
      }
    }
  ]
}
