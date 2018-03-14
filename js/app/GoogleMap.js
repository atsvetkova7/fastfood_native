define(['gmaps-api'], function() {
    
  class GoogleMap {
    constructor(){

    }

    initMap  (myLat, myLong, title) {
      var myLatLng = {lat: myLat, lng: myLong};
      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        center: myLatLng
      });
      var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: title
      });
    }

    autocompliteInit () {    
        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 50.00, lng: 30.18},
          zoom: 5
        });

        var input = document.getElementById('form-adress');

        if ( input === null ) return;

        var defaultBounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(48.37, 22.18),
          new google.maps.LatLng(50.00, 35.15)
        )

        var options = {
          bounds: defaultBounds,
          types: ['address'],
          componentRestrictions: {country: 'ua'}   
        }
            
        var autocomplete = new google.maps.places.Autocomplete(input, options);

        autocomplete.bindTo('bounds', map);

        var latEdit = $('#form-adress').attr('data-lat');
        var lngEdit = $('#form-adress').attr('data-lng');

        var myLatLng = {
          lat: +latEdit,
          lng: +lngEdit
        }

        var marker = new google.maps.Marker({
          map: map,
          position: myLatLng,
          anchorPoint: new google.maps.Point(0, -29),
          draggable: true
        });

        autocomplete.addListener('place_changed', function() {

          marker.setVisible(false);

          var places = autocomplete.getPlace();
          var lat = places.geometry.location.lat();
          var lng = places.geometry.location.lng();
          $('#form-adress').attr('data-lat', lat);
          $('#form-adress').attr('data-lng', lng);

          map.fitBounds(places.geometry.viewport);
          marker.setPosition(places.geometry.location);
          marker.setVisible(true);
        });

        google.maps.event.addListener(marker, 'dragend', function (event) {
          var lat = this.getPosition().lat();
          var lng = this.getPosition().lng();
          $('#form-adress').attr('data-lat', lat);
          $('#form-adress').attr('data-lng', lng);

        });

        marker.addListener('click', function() {
          map.setZoom(16);
          map.setCenter(marker.getPosition());
      });
    }
  }
  
  return GoogleMap;  
})