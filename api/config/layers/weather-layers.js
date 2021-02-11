const forecastZIndex = 300

module.exports = function ({ wmtsUrl, tmsUrl, wmsUrl, wcsUrl, k2Url, s3Url }) {
  return [{
    name: 'Layers.WIND_TILED',
    description: 'Layers.WIND_DESCRIPTION',
    i18n: {
      fr: {
        Layers: {
          WIND_TILED: 'Vent',
          WIND_DESCRIPTION: 'Vitesse et direction'
        },
        Variables: {
          WIND_SPEED: 'Vitesse',
          WIND_DIRECTION: 'Direction'
        },
        Levels: {
          PRESSURE: 'Pression'
        }
      },
      en: {
        Layers: {
          WIND_TILED: 'Wind',
          WIND_DESCRIPTION: 'Speed and direction'
        },
        Variables: {
          WIND_SPEED: 'Speed',
          WIND_DIRECTION: 'Direction'
        },
        Levels: {
          PRESSURE: 'Pressure'
        }
      }
    },
    tags: [
      'weather'
    ],
    iconUrl: 'https://s3.eu-central-1.amazonaws.com/kalisioscope/assets/wind.jpg',
    attribution: 'Forecast data from <a href="http://www.meteofrance.com">Météo-France</a>',
    type: 'OverlayLayer',
    variables: [
      {
        name: 'windSpeed',
        label: 'Variables.WIND_SPEED',
        units: [
          'm/s', 'km/h', 'kt'
        ],
        range: [0, 70],
        step: 1,
        chartjs: {
          backgroundColor: 'rgba(255, 159, 64, 128)',
          borderColor: 'rgb(255, 159, 64)',
          fill: false
        },
        chromajs: {
          scale: 'RdYlBu',
          domain: [20, 3]
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
          backgroundColor: 'rgba(191, 191, 63, 128)',
          borderColor: 'rgb(191, 191, 63)',
          fill: false
        }
      }
    ],
    /* When available at different levels
    levels: {
      name: 'pressure',
      label: 'Levels.PRESSURE',
      units: [
        'mb'
      ],
      values: [ 1000, 700, 450, 300, 200 ]
    }, */
    meteoElements: [ 'u-wind', 'v-wind' ],
    meteo_model: {
      default: {
        dynprops: {
          // weacast props
          element: { strTemplate: '<%- windComponent %>' },
          forecastTime: { strTemplate: '<% const time = forecastTime.format() %><%- time %>' },
          model: { strTemplate: '<%- model.name %>' },
          // geotiff props
          url: { strTemplate: "<% const folder = runTime.format('YYYY/MM/DD/HH'); const file = forecastTime.format('YYYY-MM-DD-HH') %>https://kargo.s3.eu-central-1.amazonaws.com/archive/<%- model.name %>/<%- folder %>/<%- windComponent %>/10/<%- file %>.cog" }
        }
      },
      sources: [
        { model: 'gfs-world',         from: 'P-1Y',  to: 'PT-61M',     geotiff: {} },
        { model: 'gfs-world',         from: 'PT-1H', to: 'PT+864000S', weacast: {} },
        { model: 'arpege-world',      from: 'P-1Y',  to: 'PT-61M',     geotiff: {} },
        { model: 'arpege-world',      from: 'PT-1H', to: 'PT+367200S', weacast: {} },
        { model: 'arpege-europe',     from: 'P-1Y',  to: 'PT-61M',     geotiff: {} },
        { model: 'arpege-europe',     from: 'PT-1H', to: 'PT+367200S', weacast: {} },
        { model: 'arome-france',      from: 'P-1Y',  to: 'PT-61M',     geotiff: {} },
        { model: 'arome-france',      from: 'PT-1H', to: 'PT+151200S', weacast: {} },
        { model: 'arome-france-high', from: 'PT-1H', to: 'PT+151200S', weacast: {} }
      ]
    },
    leaflet: {
      type: 'tiledWindLayer',
      lineWidth: 4,
      frameRate: 20,
      particleMultiplier: 0.001,
      displayValues: false,
      'icon-classes': 'fas fa-wind',
      zIndex: forecastZIndex,
      minZoom: {
        'gfs-world': 3,
        'arpege-world': 3,
        'arpege-europe': 5,
        'arome-france': 7,
        'arome-france-high': 9
      }
    }
  },
  {
    name: 'Layers.GUST_TILED',
    description: 'Layers.GUST_DESCRIPTION',
    i18n: {
      fr: {
        Layers: {
          GUST_TILED: 'Rafales',
          GUST_DESCRIPTION: 'Vitesse maximale du vent'
        },
        Variables: {
          GUST: 'Rafales'
        }
      },
      en: {
        Layers: {
          GUST_TILED: 'Gust',
          GUST_DESCRIPTION: 'Maximum wind speed'
        },
        Variables: {
          GUST: 'Gust'
        }
      }
    },
    tags: [
      'weather'
    ],
    iconUrl: 'https://s3.eu-central-1.amazonaws.com/kalisioscope/assets/gust.jpg',
    attribution: 'Forecast data from <a href="http://www.meteofrance.com">Météo-France</a>',
    type: 'OverlayLayer',
    variables: [
      {
        name: 'gust',
        label: 'Variables.GUST',
        units: [
          'm/s', 'km/h', 'kt'
        ],
        range: [0, 70],
        step: 1,
        chartjs: {
          backgroundColor: 'rgba(255, 99, 132, 128)',
          borderColor: 'rgb(255, 99, 132)',
          fill: false
        },
        chromajs: {
          scale: 'OrRd',
          domain: [0, 50]
        }
      }
    ],
    meteoElements: [ 'gust' ],
    meteo_model: {
      default: {
        dynprops: {
          // weacast props
          element: { strTemplate: '<%- meteoElements[0] %>' },
          forecastTime: { strTemplate: '<% const time = forecastTime.format() %><%- time %>' },
          model: { strTemplate: '<%- model.name %>' },
          // geotiff props
          url: { strTemplate: "<% const folder = runTime.format('YYYY/MM/DD/HH'); const file = forecastTime.format('YYYY-MM-DD-HH') %>https://kargo.s3.eu-central-1.amazonaws.com/archive/<%- model.name %>/<%- folder %>/<%- meteoElements[0] %>/surface/<%- file %>.cog" }
        }
      },
      sources: [
        { model: 'gfs-world',         from: 'P-1Y',  to: 'PT-61M',     geotiff: {} },
        { model: 'gfs-world',         from: 'PT-1H', to: 'PT+864000S', weacast: {} },
        { model: 'arpege-world',      from: 'P-1Y',  to: 'PT-61M',     geotiff: {} },
        { model: 'arpege-world',      from: 'PT-1H', to: 'PT+367200S', weacast: {} },
        { model: 'arpege-europe',     from: 'P-1Y',  to: 'PT-61M',     geotiff: {} },
        { model: 'arpege-europe',     from: 'PT-1H', to: 'PT+367200S', weacast: {} },
        { model: 'arome-france',      from: 'P-1Y',  to: 'PT-61M',     geotiff: {} },
        { model: 'arome-france',      from: 'PT-1H', to: 'PT+151200S', weacast: {} },
        { model: 'arome-france-high', from: 'PT-1H', to: 'PT+151200S', weacast: {} }
      ]
    },
    leaflet: {
      type: 'tiledMeshLayer',
      resolutionScale: [2.0, 2.0],
      opacity: 0.6,
      'icon-classes': 'fas fa-wind',
      zIndex: forecastZIndex,
      minZoom: {
        'gfs-world': 3,
        'arpege-world': 3,
        'arpege-europe': 5,
        'arome-france': 7,
        'arome-france-high': 9
      }
    }
  },
  {
    name: 'Layers.PRECIPITATIONS_TILED',
    description: 'Layers.PRECIPITATIONS_DESCRIPTION',
    i18n: {
      fr: {
        Layers: {
          PRECIPITATIONS_TILED: 'Précipitations',
          PRECIPITATIONS_DESCRIPTION: 'Accumulation pour 3h'
        },
        Variables: {
          PRECIPITATIONS: 'Précipitations'
        }
      },
      en: {
        Layers: {
          PRECIPITATIONS_TILED: 'Precipitations',
          PRECIPITATIONS_DESCRIPTION: 'Accumulation per 3h'
        },
        Variables: {
          PRECIPITATIONS: 'Precipitations'
        }
      }
    },
    tags: [
      'weather'
    ],
    iconUrl: 'https://s3.eu-central-1.amazonaws.com/kalisioscope/assets/precipitations.png',
    attribution: 'Forecast data from <a href="http://www.meteofrance.com">Météo-France</a>',
    type: 'OverlayLayer',
    variables: [
      {
        name: 'precipitations',
        label: 'Variables.PRECIPITATIONS',
        units: [
          'mm'
        ],
        range: [0, 300],
        step: 2,
        chartjs: {
          backgroundColor: 'rgba(54, 162, 235, 128)',
          borderColor: 'rgb(54, 162, 235)',
          fill: false
        },
        chromajs: {
          scale: 'BuPu',
          classes: [ 0, 1, 2, 4, 10, 25, 50, 100, 300 ]
        }
      }
    ],
    meteoElements: [ 'precipitations' ],
    meteo_model: {
      default: {
        dynprops: {
          // weacast props
          element: { strTemplate: '<%- meteoElements[0] %>' },
          forecastTime: { strTemplate: '<% const time = forecastTime.format() %><%- time %>' },
          model: { strTemplate: '<%- model.name %>' },
          // geotiff props
          url: { strTemplate: "<% const folder = runTime.format('YYYY/MM/DD/HH'); const file = forecastTime.format('YYYY-MM-DD-HH') %>https://kargo.s3.eu-central-1.amazonaws.com/archive/<%- model.name %>/<%- folder %>/<%- meteoElements[0] %>/surface/<%- file %>.cog" }
        }
      },
      sources: [
        { model: 'gfs-world',         from: 'P-1Y',  to: 'PT-61M',     geotiff: {} },
        { model: 'gfs-world',         from: 'PT-1H', to: 'PT+864000S', weacast: {} },
        { model: 'arpege-world',      from: 'P-1Y',  to: 'PT-61M',     geotiff: {} },
        { model: 'arpege-world',      from: 'PT-1H', to: 'PT+367200S', weacast: {} },
        { model: 'arpege-europe',     from: 'P-1Y',  to: 'PT-61M',     geotiff: {} },
        { model: 'arpege-europe',     from: 'PT-1H', to: 'PT+367200S', weacast: {} },
        { model: 'arome-france',      from: 'P-1Y',  to: 'PT-61M',     geotiff: {} },
        { model: 'arome-france',      from: 'PT-1H', to: 'PT+151200S', weacast: {} },
        { model: 'arome-france-high', from: 'PT-1H', to: 'PT+151200S', weacast: {} }
      ]
    },
    leaflet: {
      type: 'tiledMeshLayer',
      resolutionScale: [2.0, 2.0],
      opacity: 0.6,
      'icon-classes': 'fas fa-cloud-rain',
      zIndex: forecastZIndex,
      minZoom: {
        'gfs-world': 3,
        'arpege-world': 3,
        'arpege-europe': 5,
        'arome-france': 7,
        'arome-france-high': 9
      }
    }
  },
  {
    name: 'Layers.TEMPERATURE_TILED',
    description: 'Layers.TEMPERATURE_DESCRIPTION',
    i18n: {
      fr: {
        Layers: {
          TEMPERATURE_TILED: 'Température',
          TEMPERATURE_DESCRIPTION: 'Température moyenne'
        },
        Variables: {
          TEMPERATURE: 'Température'
        }
      },
      en: {
        Layers: {
          TEMPERATURE_TILED: 'Temperature',
          TEMPERATURE_DESCRIPTION: 'Mean temperature'
        },
        Variables: {
          TEMPERATURE: 'Temperature'
        }
      }
    },
    tags: [
      'weather'
    ],
    iconUrl: 'https://s3.eu-central-1.amazonaws.com/kalisioscope/assets/temperature.png',
    attribution: 'Forecast data from <a href="http://www.meteofrance.com">Météo-France</a>',
    type: 'OverlayLayer',
    variables: [
      {
        name: 'temperature',
        label: 'Variables.TEMPERATURE',
        units: [
          'degC', 'degF', 'K'
        ],
        range: [-20, 50],
        step: 1,
        chartjs: {
          backgroundColor: 'rgba(255, 215, 0, 128)',
          borderColor: 'rgb(255, 215, 0)',
          fill: false
        },
        chromajs: {
          scale: 'RdBu',
          invertScale: true,
          domain: [-20, 50]
        }
      }
    ],
    /* When available at different levels
    levels: {
      name: 'pressure',
      label: 'Levels.PRESSURE',
      units: [
        'mb'
      ],
      values: [ 1000, 700, 450, 300, 200 ]
    }, */
    meteoElements: [ 'temperature' ],
    meteo_model: {
      default: {
        dynprops: {
          // weacast props
          element: { strTemplate: '<%- meteoElements[0] %>' },
          forecastTime: { strTemplate: '<% const time = forecastTime.format() %><%- time %>' },
          model: { strTemplate: '<%- model.name %>' },
          // geotiff props
          url: { strTemplate: "<% const folder = runTime.format('YYYY/MM/DD/HH'); const file = forecastTime.format('YYYY-MM-DD-HH') %>https://kargo.s3.eu-central-1.amazonaws.com/archive/<%- model.name %>/<%- folder %>/<%- meteoElements[0] %>/2/<%- file %>.cog" }
        }
      },
      sources: [
        { model: 'gfs-world',         from: 'P-1Y',  to: 'PT-61M',     geotiff: {} },
        { model: 'gfs-world',         from: 'PT-1H', to: 'PT+864000S', weacast: {} },
        { model: 'arpege-world',      from: 'P-1Y',  to: 'PT-61M',     geotiff: {} },
        { model: 'arpege-world',      from: 'PT-1H', to: 'PT+367200S', weacast: {} },
        { model: 'arpege-europe',     from: 'P-1Y',  to: 'PT-61M',     geotiff: {} },
        { model: 'arpege-europe',     from: 'PT-1H', to: 'PT+367200S', weacast: {} },
        { model: 'arome-france',      from: 'P-1Y',  to: 'PT-61M',     geotiff: {} },
        { model: 'arome-france',      from: 'PT-1H', to: 'PT+151200S', weacast: {} },
        { model: 'arome-france-high', from: 'PT-1H', to: 'PT+151200S', weacast: {} }
      ]
    },
    leaflet: {
      type: 'tiledMeshLayer',
      resolutionScale: [2.0, 2.0],
      opacity: 0.6,
      'icon-classes': 'fas fa-temperature-high',
      zIndex: forecastZIndex,
      minZoom: {
        'gfs-world': 3,
        'arpege-world': 3,
        'arpege-europe': 5,
        'arome-france': 7,
        'arome-france-high': 9
      }
    }
  }]
}
