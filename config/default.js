module.exports = {
  apiPath: '/api',
  transport: 'websocket', // Could be 'http' or 'websocket',
  appName: 'weacast',
  appLogo: 'weacast-logo.png',
  publisher: {
    name: 'Kaelia Tech',
    website: 'https://www.kaelia-tech.com',
    contact: 'support@kaelia-tech.com'
  },
  logs: {
    level: (process.env.NODE_ENV === 'development' ? 'debug' : 'info')
  },
  screen: {
    footer: [
      { label: 'About Kaelia Tech', url: 'https://www.kaelia-tech.com' },
      { label: 'Contact', url: 'https://www.kaelia-tech.com/terms/contact' },
      { label: 'Terms & Policies', url: 'https://www.kaelia-tech.com/terms' },
    ]
  },
  layout: {
    appBar: 'layout/KAppBar',
    sideNav: 'layout/KSideNav'
  },
  appBar: {
    title: 'kApp',
    subtitle: 'A template application powered by Kaelia'
  },
  sideNav: {
    identity: 'layout/KIdentity',
    links: [
      { label: 'Users', icon: 'person', route: 'users' },
      { }, // separator
      { label: 'Logout', icon: 'exit_to_app', route: 'logout' }
    ]
  },
  users: {
    // renderer: 'users/UserCardItem',
    // nbItemsPerPage: '8',
    mixins: ['baseCollection', 'createItem', 'deleteItem', 'editItem']
  }
}