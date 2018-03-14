requirejs.config({
    baseUrl: 'js/vendor',
    paths: {
        app: '../app',
        firebaseFolder: '../firebase',
        jquery: 'jquery.min',
        list: 'https://cdnjs.cloudflare.com/ajax/libs/list.js/1.5.0/list.min',
        handlebars : 'handlebars',
        'gmaps-api': 'https://maps.googleapis.com/maps/api/js?key=AIzaSyB4a6AMn5Ax9rMwdnJJBfC4AuIhHdYzcq0&libraries=places',
        'firebase': 'https://www.gstatic.com/firebasejs/4.9.1/firebase',
        'uikit' : 'https://cdnjs.cloudflare.com/ajax/libs/uikit/3.0.0-beta.40/js/uikit.min'
        
    },
    shim: {
        'firebase': {
          exports: 'Firebase'
        },
        'uikit' : {
            exports: 'UIkit'
        }
      }	
});

requirejs(['app/App', 'jquery',  'app/Router', 'app/FastfoodDA', 'app/Auth', 'firebase', 'handlebars', 'firebaseFolder/firebase'  ],
function (mainApp, $, Router, FastfoodDA, Auth, Firebase, Handlebars, fb  ) {

    const myApp = new mainApp();
    myApp.init();

});	 