const serverPort = process.env.PORT || 8081
// Required to know webpack port so that in dev we can build correct URLs
const clientPort = process.env.CLIENT_PORT || 8080
const API_PREFIX = '/api'
let domain
// If we build a specific staging instance
if (process.env.NODE_APP_INSTANCE === 'dev') {
  domain = 'https://kano.dev.kalisio.xyz'
} else if (process.env.NODE_APP_INSTANCE === 'test') {
  domain = 'https://kano.test.kalisio.xyz'
} else if (process.env.NODE_APP_INSTANCE === 'prod') {
  domain = 'https://kano.prod.kalisio.com'
} else {
  // Otherwise we are on a developer machine
  if (process.env.NODE_ENV === 'development') {
    domain = 'http://localhost:' + clientPort // Kano app client/server port = 8080/8081
  } else {
    domain = 'http://localhost:' + serverPort // Kano app client/server port = 8081
  }
}
// Override defaults if env provided
if (process.env.SUBDOMAIN) {
  domain = 'https://kano.' + process.env.SUBDOMAIN
}
// On a developer machine will do domain = gateway = localhost
const gateway = domain.replace('kano', 'api')

// Default map catalog catagories
const mapCatalog = {
  categories: [
    {
      name: 'BaseLayers',
      label: 'KCatalogPanel.BASE_LAYERS',
      icon: 'las la-layer-group',
      options: { exclusive: true, filter: { type: 'BaseLayer' } }
    },
    {
      name: 'BusinessLayers',
      label: 'KCatalogPanel.BUSINESS_LAYERS',
      icon: 'las la-briefcase',
      options: { exclusive: false, filter: { type: 'OverlayLayer', tags: { $in: ['business'] } } }
    },
    {
      name: 'CapturedLayers',
      label: 'KCatalogPanel.CAPTURED_LAYERS',
      icon: 'las la-street-view',
      options: { exclusive: false, filter: { type: 'OverlayLayer', tags: { $in: ['captured'] } } }
    },
    {
      name: 'OverlayLayers',
      label: 'KCatalogPanel.OVERLAY_LAYERS',
      icon: 'las la-map-marker',
      options: { exclusive: false, filter: { type: 'OverlayLayer', tags: { $exists: false } } }
    },
    {
      name: 'MeasureLayers',
      label: 'KCatalogPanel.MEASURE_LAYERS',
      icon: 'las la-map-pin',
      options: { exclusive: false, filter: { type: 'OverlayLayer', tags: { $in: ['measure'] } } }
    },
    {
      name: 'MeteoLayers',
      label: 'KCatalogPanel.METEO_LAYERS',
      icon: 'las la-cloud-sun-rain',
      component: 'catalog/KWeatherLayersSelector',
      options: { exclusive: true, filter: { type: 'OverlayLayer', tags: { $in: ['weather'] } } }
    }
  ]
}

// Map engine configuration
const mapEngine = {
  viewer: {
    minZoom: 3,
    maxZoom: 21,
    center: [47, 3],
    zoom: 6,
    maxBounds: [[-90, -180], [90, 180]],
    maxBoundsViscosity: 0.25,
    timeDimension: true
  },
  // Default GeoJSON layer style for polygons/lines
  featureStyle: {
    'stroke-opacity': 1,
    'stroke-color': 'red',
    'stroke-width': 3,
    'fill-opacity': 0.5,
    'fill-color': 'green'
  },
  // Default GeoJSON layer style for polygons/lines edition
  editFeatureStyle: {
    'stroke-opacity': 1,
    'stroke-color': 'red',
    'stroke-width': 3,
    'fill-opacity': 0.5,
    'fill-color': 'green'
  },
  // Default GeoJSON layer style for points
  pointStyle: {
    'icon-color': '#FFFFFF',
    'marker-color': '#2196f3',
    'icon-classes': 'fas fa-circle'
  },
  // Default GeoJSON layer style for points edition
  editPointStyle: {
    'marker-type': 'circleMarker',
    radius: 6,
    'stroke-color': 'red',
    'stroke-opacity': 1,
    'fill-opacity': 0.5,
    'fill-color': 'green'
  },
  // Default GeoJSON infobox will display all properties
  popup: { pick: [] },
  infobox: {},
  cluster: { disableClusteringAtZoom: 18 },
  fileLayers: {
    fileSizeLimit: 1024 * 1024, // 1GB
    formats: ['.geojson', '.kml', '.gpx']
  }
}

// Default globe catalog categories
const globeCatalog = {
  categories: [
    {
      name: 'BaseLayers',
      label: 'KCatalogPanel.BASE_LAYERS',
      icon: 'las la-layer-group',
      options: { exclusive: true, filter: { type: 'BaseLayer' } } 
    },
    {
      name: 'TerrainLayers',
      label: 'KCatalogPanel.TERRAIN_LAYERS',
      icon: 'las la-mountain',
      options: { exclusive: true, filter: { type: 'TerrainLayer' } }
    },
    {
      name: 'BusinessLayers',
      label: 'KCatalogPanel.BUSINESS_LAYERS',
      icon: 'las la-briefcase',
      options: { exclusive: false, filter: { type: 'OverlayLayer', tags: { $in: ['business'] } } }
    },
    {
      name: 'OverlayLayers',
      label: 'KCatalogPanel.OVERLAY_LAYERS',
      icon: 'las la-map-marker',
      options: { exclusive: false, filter: { type: 'OverlayLayer', tags: { $exists: false } } }
    },
    {
      name: 'MeasureLayers',
      label: 'KCatalogPanel.MEASURE_LAYERS',
      icon: 'las la-map-pin',
      options: { exclusive: false, filter: { type: 'OverlayLayer', tags: { $in: ['measure'] } } }
    }
  ]
}

// Globe engine configuration
const globeEngine = {
  viewer: {
    sceneMode: 3, // SceneMode.COLUMBUS_VIEW = 1, SceneMode.SCENE3D = 3,
    sceneModePicker: false,
    scene3DOnly: true,
    homeButton: false,
    geocoder: false,
    navigationHelpButton: false,
    baseLayerPicker: false,
    vrButton: false,
    fullscreenButton: false,
    animation: false,
    timeline: false,
    creditContainer: 'globe-credit'
  },
  fileLayers: {
    clearOnDrop: false,
    flyToOnDrop: true,
    clampToGround: true
  },
  // Default GeoJSON layer style for points/polygons/lines in simple style spec
  featureStyle: {
    'marker-symbol': 'marker',
    'marker-color': '#57D824',
    stroke: '#FF0000',
    'fill-color': '#00FF00'
  },
  entityStyle: {
    billboard: {
      heightReference: 'Cesium.HeightReference.CLAMP_TO_GROUND'
    },
    label: {
      heightReference: 'Cesium.HeightReference.CLAMP_TO_GROUND',
      verticalOrigin: 'Cesium.VerticalOrigin.BASELINE'
    },
    polyline: {
      clampToGround: true
    }
  },
  tooltip: {
    options: {
      showBackground: true,
      backgroundColor: 'Cesium.Color.WHITE',
      font: '14px monospace',
      fillColor: 'Cesium.Color.BLACK',
      outlineColor: 'Cesium.Color.BLACK',
      horizontalOrigin: 'Cesium.HorizontalOrigin.LEFT',
      verticalOrigin: 'Cesium.VerticalOrigin.CENTER',
      pixelOffset: {
        type: 'Cesium.Cartesian2',
        options: [32, -32]
      }
    }
  },
  // Default GeoJSON infobox will display all properties
  popup: {
    pick: [],
    options: {
      showBackground: true,
      backgroundColor: 'Cesium.Color.WHITE',
      font: '14px monospace',
      fillColor: 'Cesium.Color.BLACK',
      outlineColor: 'Cesium.Color.BLACK',
      horizontalOrigin: 'Cesium.HorizontalOrigin.CENTER',
      verticalOrigin: 'Cesium.VerticalOrigin.BOTTOM',
      pixelOffset: {
        type: 'Cesium.Cartesian2',
        options: [0, -64]
      }
    }
  },
  infobox: {},
  clusterStyle: {
    label: {
      show: true,
      text: '<%= entities.length.toLocaleString() %>'
    }
  }
}

const widgets = [
  { id: 'information-box', icon: 'las la-digital-tachograph', component: 'widget/KInformationBox', bind: '$data.selection' },
  { id: 'time-series', icon: 'las la-chart-line', component: 'widget/KTimeSeries', bind: '$data' },
  { id: 'mapillary-viewer', icon: 'img:statics/mapillary-icon.svg', component: 'widget/KMapillaryViewer' }
]

module.exports = {
  // Special alias to host loopback interface in cordova
  // domain: 'http://10.0.2.2:8081',
  // If using port forwarding
  // domain: 'http://localhost:8081',
  // If using local IP on WiFi router
  // domain: 'http://192.168.1.16:8081',
  domain,
  flavor: process.env.NODE_APP_INSTANCE || 'dev',
  version: require('../package.json').version,
  buildNumber: process.env.BUILD_NUMBER,
  apiPath: API_PREFIX,
  apiJwt: 'kano-jwt',
  apiTimeout: 30000,
  transport: 'websocket', // Could be 'http' or 'websocket',
  gateway: 'https://api.',
  gatewayJwtField: 'jwt',
  gatewayJwt: 'kano-gateway-jwt',
  appName: 'Kano',
  appLogo: 'kano-icon-32x32.png',
  appWebsite: 'https://github.com/kalisio/kano',
  appOnlineHelp: 'https://kalisio.github.io/kano',
  publisher: 'Kalisio',
  publisherWebsite: 'https://www.kalisio.com',
  locale: {
    // If you'd like to force locale otherwise it is retrieved from browser
    // default: 'en',
    fallback: 'en'
  },
  logs: {
    level: (process.env.NODE_ENV === 'development' ? 'debug' : 'info')
  },
  screens: {
    banner: 'kano-logo-black-256x84.png',
    login: {
      providers: [],
      links: [
        { id: 'contextual-help', label: 'KLogin.CONTEXTUAL_HELP', route: { name: 'login', query: { tour: true } } }
      ]
    },
    logout: {
      links: [
        { id: 'login-link', label: 'KLogout.LOG_IN_AGAIN_LINK', route: { name: 'login' } }
      ]
    },
    changeEndpoint: {
      links: [
        { id: 'login-link', label: 'KChangeEndpoint.LOGIN_LINK', route: { name: 'login' } }
      ]
    }
  },
  layout: {
    view: 'lhh LpR lff',
    topPane: {
      opener: true,
      visible: true
    },
    bottomPane: {
      opener: true
    },
    rightPane: {
      opener: true
    },
    leftDrawer: {
      content: [
        { component: 'QImg', src: 'statics/kano-logo.png' },
        { component: 'Settings' },
        { component: 'QSeparator', color: 'lightgrey', style: 'min-height: 1px;' },
        { component: 'layout/KAbout' },
        { id: 'contextual-help', icon: 'las la-question-circle', label: 'sideNav.CONTEXTUAL_HELP', route: { query: { tour: 'home' } }, renderer: 'item' },
        { component: 'QSeparator', color: 'lightgrey', style: 'min-height: 1px;' },
        { id: 'logout', icon: 'las la-sign-out-alt', label: 'sideNav.LOGOUT', route: { name: 'logout' }, renderer: 'item' }
      ],
      behavior: 'mobile',
      opener: true
    },
    rightDrawer: {
      behavior: 'mobile',
      opener: true
    }
  },
  mapActivity: {
    topPane: {
      content: {
        default: [
          { id: 'toggle-globe', icon: 'las la-globe', tooltip: 'mixins.activity.TOGGLE_GLOBE', route: { name: 'globe-activity', query: true } },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' },
          /* Only for example purpose
          { id: 'zoom-in', icon: 'add', tooltip: 'mixins.activity.ZOOM_IN', handler: { name: 'onZoomIn' } },
          { id: 'zoom-out', icon: 'remove', tooltip: 'mixins.activity.ZOOM_OUT', handler: { name: 'onZoomOut' } },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' }, */
          { component: 'KLocateUser' },
          { id: 'search-location', icon: 'las la-search-location', tooltip: 'mixins.activity.SEARCH_LOCATION', handler: { name: 'setTopPaneMode', params: ['search-location'] } },
          { id: 'set-favorite', icon: 'star_border', tooltip: 'mixins.activity.ADD_FAVORITE', handler: { name: 'onSetFavorite' } },
          {
            component: 'frame/KMenu',
            icon: 'las la-wrench',
            tooltip: 'mixins.activity.TOOLS',
            actionRenderer: 'item',
            content: [
              { id: 'display-position', icon: 'las la-plus', label: 'mixins.activity.DISPLAY_POSITION', handler: { name: 'setTopPaneMode', params: ['display-position'] } }
            ]
          },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' },
          { id: 'toggle-fullscreen', icon: 'las la-expand', tooltip: 'mixins.activity.ENTER_FULLSCREEN', toggle: { icon: 'las la-compress', tooltip: 'mixins.activity.EXIT_FULLSCREEN' }, handler: { name: 'onToggleFullscreen' } }
        ],
        'display-position': [
          { id: 'back', icon: 'las la-arrow-left', handler: { name: 'setTopPaneMode', params: ['default'] } },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' },
          { component: 'KPositionIndicator' }
        ],
        'search-location': [
          { id: 'back', icon: 'las la-arrow-left', handler: { name: 'setTopPaneMode', params: ['default'] } },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' },
          { component: 'KSearchLocation' }
        ]
      }
    },
    rightPane: {
      content: [
        { component: 'catalog/KCatalog' }
      ]
    },
    bottomPane: {
      content: [
        { component: 'KTimeline' }
      ]
    },
    window: {
      widgets: widgets
    },
    fab: {
      actions: [
        { id: 'create-layer', icon: 'las la-plus', label: 'mixins.activity.CREATE_LAYER', handler: { name: 'onCreateLayer' } },
        { id: 'import-layer', icon: 'las la-file-upload', label: 'mixins.activity.IMPORT_LAYER', handler: { name: 'onImportLayer' } },
        { id: 'probe-location', icon: 'las la-eye-dropper', label: 'mixins.activity.PROBE', handler: { name: 'onProbeLocation' } }
      ]
    },
    engine: mapEngine,
    catalog: mapCatalog,
    layerActions: ['zoom-to', 'save', 'edit', 'edit-style', 'filter-data', 'view-data', 'chart-data', 'edit-data', 'remove'],
    featuresChunkSize: 5000 // TODO: here or in mapEngine ?
  },
  globeActivity: {
    topPane: {
      content: {
        default: [
          { id: 'toggle-map', icon: 'las la-map', tooltip: 'mixins.activity.TOGGLE_MAP', route: { name: 'map-activity', query: true } },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' },
          { component: 'KLocateUser' },
          { id: 'search-location', icon: 'las la-search-location', tooltip: 'mixins.activity.SEARCH_LOCATION', handler: { name: 'setTopPaneMode', params: ['search-location'] } },
          { id: 'set-favorite', icon: 'star_border', tooltip: 'mixins.activity.ADD_FAVORITE', handler: { name: 'onSetFavorite' } },
          {
            component: 'frame/KMenu',
            icon: 'las la-wrench',
            tooltip: 'mixins.activity.TOOLS',
            actionRenderer: 'item',
            content: [
              { id: 'display-position', icon: 'las la-plus', label: 'mixins.activity.DISPLAY_POSITION', handler: { name: 'setTopPaneMode', params: ['display-position'] } }
            ]
          },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' },
          { id: 'toggle-vr', icon: 'las la-vr-cardboard', tooltip: 'mixins.activity.ENTER_VR', toggle: { tooltip: 'mixins.activity.EXIT_VR' }, handler: { name: 'onToggleVr' } },
          { id: 'toggle-fullscreen', icon: 'las la-expand', tooltip: 'mixins.activity.ENTER_FULLSCREEN', toggle: { icon: 'las la-compress', tooltip: 'mixins.activity.EXIT_FULLSCREEN' }, handler: { name: 'onToggleFullscreen' } }
        ],
        'display-position': [
          { id: 'back', icon: 'las la-arrow-left', handler: { name: 'setTopPaneMode', params: ['default'] } },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' },
          { component: 'KPositionIndicator' }
        ],
        'search-location': [
          { id: 'back', icon: 'las la-arrow-left', handler: { name: 'setTopPaneMode', params: ['default'] } },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' },
          { component: 'KSearchLocation' }
        ]
      }
    },
    rightPane: {
      content: [
        { component: 'catalog/KCatalog' }
      ]
    },
    bottomPane: {
      content: [
        { component: 'KTimeline' }
      ]
    },
    window: {
      widget: widgets
    },
    fab: {
      actions: [
        { id: 'probe-location', icon: 'las la-eye-dropper', tooltip: 'mixins.activity.PROBE', handler: { name: 'onProbeLocation' } }
      ]
    },
    engine: globeEngine,
    catalog: globeCatalog
  },
  routes: require('../src/router/routes')
}
