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
// Override defaults if env provided at build time
if (process.env.SUBDOMAIN) {
  domain = 'https://kano.' + process.env.SUBDOMAIN
}
// On a developer machine will do domain = gateway = localhost
const gateway = (process.env.API_GATEWAY_URL ? process.env.API_GATEWAY_URL : domain.replace('kano', 'api'))

// Allow to override version number for custom build
const version = (process.env.VERSION ? process.env.VERSION : require('../package.json').version)

// Left pane
const leftPane = {
  content: [
    { component: 'QImg', src: 'kano-banner.png' },
    { component: 'QSeparator' },
    { component: 'editor/KSettingsEditor' },
    { component: 'layout/KAbout' },
    { id: 'contextual-help', icon: 'las la-question-circle', label: 'sideNav.CONTEXTUAL_HELP', route: { query: { tour: 'home' } }, renderer: 'item' },
    { component: 'QSeparator' },
    { component: 'QSpace' },
    { component: 'QSeparator' },
    { id: 'logout', icon: 'las la-sign-out-alt', label: 'sideNav.LOGOUT', route: { name: 'logout' }, renderer: 'item' }
  ]
}

// Catalog tababr
function catalogTabbar (activeView) {
  return {
    id: 'catalog-tabbar', component: 'frame/KPanel', class: 'q-pa-sm justify-center', actionRenderer: 'tab', content: [
      { 
        id: 'user-layers-tab', label: 'KUserLayersPanel.LAYERS_LABEL', color: 'grey-7', toggle: { color: 'primary' }, 
        toggled: activeView === 'user-layers' ? true : false,
        handler: { name: 'setRightPaneMode', params: ['map'] } 
      },
      { 
        id: 'user-views-tab', label: 'KViewsPanel.VIEWS_LABEL', color: 'grey-7', toggle: { color: 'primary' },
        toggled: activeView === 'user-views' ? true : false,
        handler: { name: 'setRightPaneMode', params: ['user-views'] } 
      },
      { 
        id: 'catalog-layers-tab', label: 'KCatalogLayersPanel.LAYERS_LABEL', color: 'grey-7', toggle: { color: 'primary' },
        toggled: activeView === 'catalog-layers' ? true : false,
        handler: { name: 'setRightPaneMode', params: ['catalog-layers'] } 
      }
    ]
  }
}

// Catalog panes
const catalogPanes = {
  'user-layers': [
    catalogTabbar('user-layers'),
    { id: 'user-layers', component: 'catalog/KUserLayersPanel', bind: '$data' },
    { component: 'QSpace' },
    { id: 'catalog-footer', component: 'frame/KPanel', content: [{
        id: 'manage-layer-categories',
        icon: 'las la-cog',
        label: 'KLayerCategories.LAYER_CATEGORIES_LABEL',
        visible: { name: '$can', params: ['create', 'catalog'] },
        route: { name: 'manage-layer-categories', params: { south: ':south', north: ':north', west: ':west', east: ':east' }, query: { layers: ':layers' } },
      }],
      class: 'justify-center'
    }
  ],
  'user-views': [
   catalogTabbar('user-views'),
    { id: 'user-views', component: 'catalog/KViewsPanel' }
  ],
  'catalog-layers': [
    catalogTabbar('catalog-layers'),
    { id: 'system-layers', component: 'catalog/KCatalogLayersPanel', bind: '$data' }
  ]
} 

const legendWidgets = [
  { id: 'legend-box', label: 'LegendBox.LABEL', icon: 'las la-list',  component: 'widget/KLegendBox' }
]

// Map layer actions
const mapLayerActions = [{
  id: 'layer-actions',
  component: 'menu/KMenu',
  dropdownIcon: 'las la-ellipsis-v',
  actionRenderer: 'item',
  content: [
    { id: 'zoom-to', label: 'mixins.activity.ZOOM_TO_LABEL', icon: 'las la-search-location', handler: 'onZoomToLayer' },
    { id: 'save', label: 'mixins.activity.SAVE_LABEL', icon: 'las la-save', handler: 'onSaveLayer',
      visible: ['isLayerStorable', { name: '$can', params: ['create', 'catalog'] }] },
    { id: 'filter-data', label: 'mixins.activity.FILTER_DATA_LABEL', icon: 'las la-filter', visible: ['isFeatureLayer', 'hasFeatureSchema'],
      handler: 'onSelectLayer', route: { name: 'map-layer-filter', params: { layerId: ':_id' } } },
    { id: 'view-data', label: 'mixins.activity.VIEW_DATA_LABEL', icon: 'las la-th-list', visible: ['isFeatureLayer', 'hasFeatureSchema'],
      handler: 'onSelectLayer', route: { name: 'map-layer-table', params: { layerId: ':_id' } } },
    { id: 'chart-data', label: 'mixins.activity.CHART_DATA_LABEL', icon: 'las la-chart-pie', visible: ['isFeatureLayer', 'hasFeatureSchema'],
      handler: 'onSelectLayer', route: { name: 'map-layer-chart', params: { layerId: ':_id' } } },
    { id: 'edit', label: 'mixins.activity.EDIT_LABEL', icon: 'las la-file-alt', visible: ['isLayerEditable', { name: '$can', params: ['update', 'catalog'] }],
      handler: 'onSelectLayer', route: { name: 'edit-map-layer', params: { layerId: ':_id' } } },
    { id: 'edit-style', label: 'mixins.activity.EDIT_LAYER_STYLE_LABEL', icon: 'las la-border-style', visible: 'isLayerStyleEditable',
      handler: 'onSelectLayer', route: { name: 'edit-map-layer-style', params: { layerId: ':_id' } } },
    { id: 'edit-data', label: 'mixins.activity.START_EDIT_DATA_LABEL', icon: 'las la-edit', handler: 'onEditLayerData', visible: 'isLayerDataEditable',
      toggle: { icon: 'las la-edit', tooltip: 'mixins.activity.STOP_EDIT_DATA_LABEL' }, component: 'KEditLayerData' },
    { id: 'remove', label: 'mixins.activity.REMOVE_LABEL', icon: 'las la-trash', handler: 'onRemoveLayer', visible: 'isLayerRemovable' }
  ]
}]

const mapWidgets = [
  { id: 'information-box', label: 'KInformationBox.LABEL', icon: 'las la-digital-tachograph', component: 'widget/KInformationBox', bind: '$data.selection' },
  { id: 'time-series', label: 'KTimeSeries.LABEL', icon: 'las la-chart-line', component: 'widget/KTimeSeries', bind: '$data' },
  { id: 'elevation-profile', label: 'KElevationProfile.LABEL', icon: 'las la-mountain', component: 'widget/KElevationProfile', bind: '$data.selection' },
  { id: 'mapillary-viewer', label: 'KMapillaryViewer.LABEL', icon: 'kdk:mapillary.png',  component: 'widget/KMapillaryViewer' }
]

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

// Globe layer actions
const globeLayerActions = [{
  id: 'layer-actions',
  component: 'menu/KMenu',
  dropdownIcon: 'las la-ellipsis-v',
  actionRenderer: 'item',
  content: [
    { id: 'zoom-to', label: 'mixins.activity.ZOOM_TO_LABEL', icon: 'las la-search-location', handler: 'onZoomToLayer' },
    { id: 'filter-data', label: 'mixins.activity.FILTER_DATA_LABEL', icon: 'las la-filter', visible: ['isFeatureLayer', 'hasFeatureSchema'],
      handler: 'onSelectLayer', route: { name: 'globe-layer-filter', params: { layerId: ':_id' } } },
    { id: 'view-data', label: 'mixins.activity.VIEW_DATA_LABEL', icon: 'las la-th-list', visible: ['isFeatureLayer', 'hasFeatureSchema'],
      handler: 'onSelectLayer', route: { name: 'globe-layer-table', params: { layerId: ':_id' } } },
    { id: 'chart-data', label: 'mixins.activity.CHART_DATA_LABEL', icon: 'las la-chart-pie', visible: ['isFeatureLayer', 'hasFeatureSchema'],
      handler: 'onSelectLayer', route: { name: 'globe-layer-chart', params: { layerId: ':_id' } } },
    { id: 'edit', label: 'mixins.activity.EDIT_LABEL', icon: 'las la-file-alt', visible: ['isLayerEditable', { name: '$can', params: ['update', 'catalog'] }],
      handler: 'onSelectLayer', route: { name: 'edit-globe-layer', params: { layerId: ':_id' } } },
    { id: 'remove', label: 'mixins.activity.REMOVE_LABEL', icon: 'las la-minus-circle', handler: 'onRemoveLayer',
      visible: ['isLayerRemovable', { name: '$can', params: ['remove', 'catalog'] }] }
  ]
}]

const globeWidgets = [
  { id: 'information-box', label: 'KInformationBox.LABEL', icon: 'las la-digital-tachograph', component: 'widget/KInformationBox', bind: '$data.selection' },
  { id: 'time-series', label: 'KTimeSeries.LABEL', icon: 'las la-chart-line', component: 'widget/KTimeSeries', bind: '$data' },
  { id: 'elevation-profile', label: 'KElevationProfile.LABEL', icon: 'las la-mountain', component: 'widget/KElevationProfile', bind: '$data.selection' },
  { id: 'mapillary-viewer', label: 'KMapillaryViewer.LABEL', icon: 'kdk:mapillary.png',  component: 'widget/KMapillaryViewer' }
]

// Globe engine configuration
const globeEngine = {
  viewer: {
    sceneMode: 3, // SceneMode.COLUMBUS_VIEW = 1, SceneMode.SCENE3D = 3,
    sceneModePicker: false,
    infoBox: false,
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

module.exports = {
  // Special alias to host loopback interface in cordova
  // domain: 'http://10.0.2.2:8081',
  // If using port forwarding
  // domain: 'http://localhost:8081',
  // If using local IP on WiFi router
  // domain: 'http://192.168.1.16:8081',
  domain,
  flavor: process.env.NODE_APP_INSTANCE || 'dev',
  version,
  buildNumber: process.env.BUILD_NUMBER,
  apiPath: API_PREFIX,
  apiJwt: 'kano-jwt',
  apiTimeout: 30000,
  transport: 'websocket', // Could be 'http' or 'websocket',
  gateway,
  gatewayJwtField: 'jwt',
  gatewayJwt: 'kano-gateway-jwt',
  appName: 'Kano',
  appLogo: 'kano-icon-32x32.png',
  appWebsite: 'https://github.com/kalisio/kano',
  appOnlineHelp: 'https://kalisio.github.io/kano',
  publisher: 'Kalisio',
  publisherWebsite: 'https://kalisio.com',
  locale: {
    // If you'd like to force locale otherwise it is retrieved from browser
    // default: 'en',
    fallback: 'en'
  },
  logs: {
    level: (process.env.NODE_ENV === 'development' ? 'debug' : 'info')
  },
  units: {
    // Nothing specific, use defaults
  },
  settings: {
    propertyMapping: {
      // Nothing specific, use defaults
    }
  },
  screens: {
    banner: 'kano-banner.png',
    login: {
      actions: [
        { id: 'contextual-help', label: 'CONTEXTUAL_HELP', route: { name: 'login', query: { tour: true } } }
      ]
    },
    logout: {
      actions: [
        { id: 'login-link', label: 'KLogoutScreen.LOG_IN_AGAIN_LABEL', route: { name: 'login' } }
      ]
    },
    endpoint: {
      actions: [
        { id: 'login-link', label: 'KEndpointScreen.LOG_IN_LABEL', route: { name: 'login' } }
      ]
    }
  },
  layout: {
    view: 'lhh LpR lff',
    topPane: {
      opener: true,
      visible: true
    },
    leftPane: {
      opener: true
    },
    bottomPane: {
      opener: true
    },
    rightPane: {
      opener: true
    }
  },
  mapActivity: {
    additionalMixins: [],
    topPane: {
      content: {
        default: [
          { id: 'toggle-globe', icon: 'las la-globe', tooltip: 'mixins.activity.TOGGLE_GLOBE', route: { name: 'globe-activity', params: { south: ':south', north: ':north', west: ':west', east: ':east' }, query: { layers: ':layers' } } },
          { component: 'QSeparator', vertical: true },
          { id: 'zoom-in', icon: 'add', tooltip: 'mixins.activity.ZOOM_IN', handler: { name: 'onZoomIn' } },
          { id: 'zoom-out', icon: 'remove', tooltip: 'mixins.activity.ZOOM_OUT', handler: { name: 'onZoomOut' } },
          { id: 'zoom-separator', component: 'QSeparator', vertical: true },
          { id: 'locate-user', component: 'KLocateUser' },
          { id: 'search-location', icon: 'las la-search-location', tooltip: 'mixins.activity.SEARCH_LOCATION', handler: { name: 'setTopPaneMode', params: ['search-location'] } },
          {
            id: 'tools',
            component: 'menu/KMenu',
            icon: 'las la-wrench',
            tooltip: 'mixins.activity.TOOLS',
            actionRenderer: 'item',
            content: [
              { id: 'measure-tool', icon: 'las la-ruler-combined', label: 'KMeasureTool.TOOL_BUTTON_LABEL', handler: { name: 'setTopPaneMode', params: ['measure-tool'] } },
              { id: 'display-position', icon: 'las la-plus', label: 'mixins.activity.DISPLAY_POSITION', handler: { name: 'setTopPaneMode', params: ['display-position'] } },
              { id: 'display-legend', icon: 'las la-list', label: 'mixins.activity.DISPLAY_LEGEND', handler: { name: 'openWidget', params: ['legend-box'] } },
              { component: 'QSeparator' },
              { id: 'capture-map', icon: 'las la-camera', label: 'mixins.activity.CAPTURE_VIEW', handler: { name: 'setTopPaneMode', params: ['capture-map'] } }
            ]
          },
          { component: 'QSeparator', vertical: true, inset: true },
          { id: 'toggle-fullscreen', icon: 'las la-expand', tooltip: 'mixins.activity.ENTER_FULLSCREEN', toggle: { icon: 'las la-compress', tooltip: 'mixins.activity.EXIT_FULLSCREEN' }, handler: { name: 'onToggleFullscreen' } }
        ],
        'display-position': [
          { id: 'back', icon: 'las la-arrow-left', handler: { name: 'setTopPaneMode', params: ['default'] } },
          { component: 'QSeparator', vertical: true },
          { component: 'KPositionIndicator' }
        ],
        'search-location': [
          { id: 'back', icon: 'las la-arrow-left', handler: { name: 'setTopPaneMode', params: ['default'] } },
          { component: 'QSeparator', vertical: true },
          { component: 'KSearchLocation' }
        ],
        'edit-layer-data': [
          { id: 'accept', icon: 'las la-arrow-left', handler: { name: 'onEndLayerEdition', params: ['accept'] } },
          { component: 'QSeparator', vertical: true },
          { component: 'KLayerEditionToolbar' }
        ],
        'capture-map': [ 
          { id: 'back', icon: 'las la-arrow-left', handler: { name: 'setTopPaneMode', params: ['default'] } },
          { component: 'QSeparator', vertical: true },
          { component: 'KCaptureToolbar' }
        ],
        'measure-tool': [
          { id: 'back', icon: 'las la-arrow-left', handler: { name: 'setTopPaneMode', params: ['default'] } },
          { component: 'QSeparator', vertical: true },
          { component: 'KMeasureTool' }
        ]
      },
      // Hide zoom by default but keep it in config so that it can be easily shown by configuring the filter
      filter: { id: { $nin: ['zoom-in', 'zoom-out', 'zoom-separator'] } }
    },
    leftPane: leftPane,
    rightPane: {
      content: catalogPanes
    },
    bottomPane: {
      content: [
        { component: 'KTimeline' }
      ]
    },
    page: {
      sticky: {
        zIndex: 1000 // On top of Leaflet layers
      },
      content: [{
        id: 'color-legend', component: 'frame/KPageSticky', position: 'left', offset: [18, 0], content: [{ component: 'KColorLegend' }]
      }, {
        id: 'url-legend', component: 'frame/KPageSticky', position: 'top-left', offset: [18, 18], content: [{ component: 'KUrlLegend' }]
      }, {
        id: 'level-slider', component: 'frame/KPageSticky', position: 'right', offset: [40, 0], content: [{ component: 'KLevelSlider' }]
      } /* Only for example purpose
      {
        id: 'site-seeker', component: 'frame/KPageSticky', position: 'bottom-right', offset: [16, 16], content: [{ component: 'SiteSeeker' }]
      }*/]
    },
    windows: {
      left: { widgets: legendWidgets },
      top: { widgets: mapWidgets }
    },
    fab: {
      actions: [
        { 
          id: 'create-view', icon: 'las la-star', label: 'mixins.activity.CREATE_VIEW',
          visible: { name: '$can', params: ['create', 'catalog'] },
          route: { name: 'create-view', params: { south: ':south', north: ':north', west: ':west', east: ':east' }, query: { layers: ':layers' } }
        },
        { 
          id: 'add-layer', icon: 'las la-plus', label: 'mixins.activity.ADD_LAYER',
          route: { name: 'add-map-layer', params: { south: ':south', north: ':north', west: ':west', east: ':east' }, query: { layers: ':layers' } } 
        },
        { id: 'probe-location', icon: 'las la-eye-dropper', label: 'mixins.activity.PROBE', handler: 'onProbeLocation' }
      ]
    },
    engine: mapEngine,
    layers: {
      actions: mapLayerActions
    },
    featuresChunkSize: 5000 // TODO: here or in mapEngine ?
  },
  globeActivity: {
    additionalMixins: [],
    topPane: {
      content: {
        default: [
          { id: 'toggle-map', icon: 'las la-map', tooltip: 'mixins.activity.TOGGLE_MAP', route: { name: 'map-activity', params: { south: ':south', north: ':north', west: ':west', east: ':east' }, query: { layers: ':layers' } } },
          { component: 'QSeparator', vertical: true },
          { id: 'zoom-in', icon: 'add', tooltip: 'mixins.activity.ZOOM_IN', handler: { name: 'onZoomIn' } },
          { id: 'zoom-out', icon: 'remove', tooltip: 'mixins.activity.ZOOM_OUT', handler: { name: 'onZoomOut' } },
          { id: 'zoom-separator', component: 'QSeparator', vertical: true, inset: true },
          { id: 'locate-user', component: 'KLocateUser' },
          { id: 'search-location', icon: 'las la-search-location', tooltip: 'mixins.activity.SEARCH_LOCATION', handler: { name: 'setTopPaneMode', params: ['search-location'] } },
          {
            id: 'tools',
            component: 'menu/KMenu',
            icon: 'las la-wrench',
            tooltip: 'mixins.activity.TOOLS',
            actionRenderer: 'item',
            content: [
              { id: 'display-position', icon: 'las la-plus', label: 'mixins.activity.DISPLAY_POSITION', handler: { name: 'setTopPaneMode', params: ['display-position'] } },
              { id: 'display-legend', icon: 'las la-list', label: 'mixins.activity.DISPLAY_LEGEND', handler: { name: 'openWidget', params: ['legend-box'] } },
            ]
          },
          { component: 'QSeparator', vertical: true, inset: true },
          { id: 'toggle-vr', icon: 'las la-vr-cardboard', tooltip: 'mixins.activity.ENTER_VR', toggle: { tooltip: 'mixins.activity.EXIT_VR' }, handler: { name: 'onToggleVr' } },
          { id: 'toggle-fullscreen', icon: 'las la-expand', tooltip: 'mixins.activity.ENTER_FULLSCREEN', toggle: { icon: 'las la-compress', tooltip: 'mixins.activity.EXIT_FULLSCREEN' }, handler: { name: 'onToggleFullscreen' } }
        ],
        'display-position': [
          { id: 'back', icon: 'las la-arrow-left', handler: { name: 'setTopPaneMode', params: ['default'] } },
          { component: 'QSeparator', vertical: true },
          { component: 'KPositionIndicator' }
        ],
        'search-location': [
          { id: 'back', icon: 'las la-arrow-left', handler: { name: 'setTopPaneMode', params: ['default'] } },
          { component: 'QSeparator', vertical: true },
          { component: 'KSearchLocation' }
        ]
      },
      // Hide zoom by default but keep it in config so that it can be easily shown by configuring the filter
      filter: { id: { $nin: ['zoom-in', 'zoom-out', 'zoom-separator'] } }
    },
    leftPane: leftPane,
    rightPane: {
      content: catalogPanes
    },
    bottomPane: {
      content: [
        { component: 'KTimeline' }
      ]
    },
    page: {
      content: [{
        id: 'url-legend', component: 'frame/KPageSticky', position: 'top-left', offset: [18, 18], content: [{ component: 'KUrlLegend' }]
      }]
    },
    windows: {
      left: { widgets: legendWidgets },      
      top: { widgets: globeWidgets }
    },
    fab: {
      actions: [
        { id: 'probe-location', icon: 'las la-eye-dropper', label: 'mixins.activity.PROBE', handler: 'onProbeLocation' }
      ]
    },
    engine: globeEngine,
    layers: {
      actions: globeLayerActions
    }
  },
  routes: require('../src/router/routes')
}
