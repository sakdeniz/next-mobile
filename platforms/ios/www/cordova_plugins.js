cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "cordova-plugin-navigationbar-color.navigationbar",
    "file": "plugins/cordova-plugin-navigationbar-color/www/navigationbar.js",
    "pluginId": "cordova-plugin-navigationbar-color",
    "clobbers": [
      "window.NavigationBar"
    ]
  },
  {
    "id": "cordova-plugin-statusbar.statusbar",
    "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
    "pluginId": "cordova-plugin-statusbar",
    "clobbers": [
      "window.StatusBar"
    ]
  },
  {
    "id": "cordova-sqlcipher-adapter.SQLitePlugin",
    "file": "plugins/cordova-sqlcipher-adapter/www/SQLitePlugin.js",
    "pluginId": "cordova-sqlcipher-adapter",
    "clobbers": [
      "SQLitePlugin"
    ]
  },
  {
    "id": "cordova-plugin-qrscanner.QRScanner",
    "file": "plugins/cordova-plugin-qrscanner/www/www.min.js",
    "pluginId": "cordova-plugin-qrscanner",
    "clobbers": [
      "QRScanner"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-navigationbar-color": "0.0.8",
  "cordova-plugin-statusbar": "2.4.2",
  "cordova-plugin-whitelist": "1.3.3",
  "cordova-sqlcipher-adapter": "0.4.0",
  "cordova-plugin-add-swift-support": "2.0.2",
  "cordova-plugin-qrscanner": "2.6.2"
};
// BOTTOM OF METADATA
});