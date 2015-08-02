require.config({
  paths: {
    angular: '../lib/angular/angular',
    "angular-sanitize": '../lib/angular/angular-sanitize',
    "angular-gettext": '../lib/angular/angular-gettext',
    "gettext-translations": 'translations', // TODO need help with requireJS
    onsen: '../lib/onsen/js/onsenui'
  },
  shim: {
    "angular": {
      exports: "angular"
    },
    "angular-sanitize": ["angular"],
    "angular-gettext": {
      deps: ["angular"],
      exports: "gettext" // TODO need help with requireJS
    },
    "gettext-translations": ["angular", "gettext"], // TODO need help with requireJS
    "onsen": ["angular"]
  }
});

(function () {
  "use strict";

  window.app = {
      bbsCore: null
  };

  function onDeviceReady() {
    // Handle the Cordova pause and resume events
    //document.addEventListener( 'pause', onPause.bind(this), false );
    //document.addEventListener( 'resume', onResume.bind(this), false );
    require([
      'frontend/appController',
      'core/sites/ptt',
      '../lib/domReady!'
      ], function () {

      // TODO: replace visibility into a loading indicator
      document.body.style.visibility = "";
      angular.bootstrap(document, ['app']);

    });
  }

  function onPause() {
    // TODO: This application has been suspended. Save application state here.
  }

  function onResume() {
    // TODO: This application has been reactivated. Restore application state here.
  }

  function onLoad() {

  }

  function onUnload() {
    //TODO: disconnect
  }

  document.addEventListener('deviceready', onDeviceReady.bind(this), false);
  //window.addEventListener('load', onLoad.bind(this), false);
  //window.addEventListener('unload', onUnload.bind(this), false);
}) ();
