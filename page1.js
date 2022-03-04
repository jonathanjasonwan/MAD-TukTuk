  var map;
  var latLngForTaxiToUser; //user location
  var latLngForReverseGeocode; //user location
  var currentLatLng;//user location in google.maps.LatLng format for markers
  var taxiArr; //array to store taxis in radius
  var rand; //Random taxi is chosen from taxiArr
  var geocoder = new google.maps.Geocoder// Geocoder thing to get address of user location

  var originLatLng; //latlng of origin [latLngForTaxiToUser,latLngForReverseGeocode]
  var destinationLatLng; //latlng of destination
  var originAddress;
  var destinationAddress;




  //autocomplete/////////////////////////////////////////////

  function autoComplete(){
     // add input listeners
    //  google.maps.event.addDomListener(window, 'load', function () {
      console.log("run")

      var to_places = new google.maps.places.Autocomplete(document.getElementById('to_places'));

      google.maps.event.addListener(to_places, 'place_changed', function () {
          var to_place = to_places.getPlace();
          var to_address = to_place.formatted_address;
          $('#destination').val(to_address);
      });

  // });
  //get destination latlng
  }

  function getDestinationsOfAll(){
    autoComplete();
    console.log("getting latlngs from input")
    console.log("All functions complete before button pressed")
        //get latlng from input   //
        function getDestinationLatLng(destinationAddress){
          console.log('address is' + destinationAddress);
          var url = "https://maps.googleapis.com/maps/api/geocode/json";
          $.getJSON(url,{key:"AIzaSyDUF0-L5xCgdpfwjXO0bkTo7wsPoyBd5ls",address:destinationAddress},function(obj){
            console.log(JSON.stringify(obj))
            resultsArr = obj.results;
            getDestinationLat = resultsArr[0].geometry.location.lat;
            getDestinationLng = resultsArr[0].geometry.location.lng;
            destinationLatLng = {lat:getDestinationLat,lng:getDestinationLng}
            console.log(destinationLatLng);
          })
          
        }
        function getOriginLatLng(originAddress){
          console.log('address is' + originAddress);
          var url = "https://maps.googleapis.com/maps/api/geocode/json";
          $.getJSON(url,{key:"AIzaSyDUF0-L5xCgdpfwjXO0bkTo7wsPoyBd5ls",address:originAddress},function(obj){
            console.log(JSON.stringify(obj))
            resultsArr = obj.results;
            getOriginLat = resultsArr[0].geometry.location.lat;
            getOriginLng = resultsArr[0].geometry.location.lng;
            originLatLng = {lat:getOriginLat,lng:getOriginLng}
            console.log(originLatLng);
          })
          
        }
        //get latlng from input   END//

        // calculate distance
        function calculateDistance() {
          console.log('calculating distance');
            originAddress = $('#origin').text();
            destinationAddress = $('#destination').val();
            getDestinationLatLng(destinationAddress);
            getOriginLatLng(originAddress);
            console.log(originAddress, destinationAddress)

            $( ":mobile-pagecontainer" ).pagecontainer( "change", "#directionsPage", { role: "page" } );
            console.log("changed page")
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////END OF PAGE 1
        }    
        // print results on submit the form
        $('#submitBtn').on("tap", function(e){
            e.preventDefault();
            calculateDistance();
    });
  }
  //autocomplete/////////////////////////////////////////////END

  ///////////////////////////////////////////////////////////reverse geocode to get name of current location//
  
  function reverseGeocode(geocoder){
    console.log(latLngForReverseGeocode)
    geocoder.geocode({'location': latLngForReverseGeocode}, function(results, status) {
        latLngToAddress = results[0].formatted_address;
        console.log("user address is: "+ latLngToAddress)
        $("#origin").text(latLngToAddress);
        getDestinationsOfAll();
    });
  }
  
  ///////////////////////////////////////////////////////////reverse geocode to get name of current location END//

////////////////////////////////////////////////////////////Choose random taxi to pick up user//

function randomTaxi(){
  // setTimeout(
  //   function(){
      var randNo = Math.floor(Math.random() * taxiArr.length)
      console.log("random no. chosen:"+ randNo)
      rand = JSON.parse(taxiArr[randNo]);//rand = taxiArr[x]
      console.log(rand);
  //}, 1000);// set timeout for 1 secs
    reverseGeocode(geocoder);
}
//////////////////////////////////////////////////////////////Choose random taxi to pick up user END//


//////////////////////////////////////////////////////////////Filter Taxis to those within radius//
function filterTaxisByLocation(){
  console.log("Total times filterTaxisByLocation func ran");
  
  var taxiDistance = google.maps.geometry.spherical.computeDistanceBetween(currentLatLng, taxiLatLng);
  // console.log(taxiDistance)
  var radius = 1000;
  if(taxiDistance <= radius){
    var marker = new google.maps.Marker({
        position: taxiLatLng,
        map: map,
        draggable: false,
        icon:"img/icons/availTaxi.png"
    });
    // console.log(taxiLatLng);
    taxiArr.push(JSON.stringify(taxiLatLng))
  }
}
////////////////////////////////////////////////////////////////Filter Taxis to those within radius END//

///////////////////////////////////////////////////////////////////////get Taxis from API//
function taxiData(){
    $.getJSON("https://api.data.gov.sg/v1/transport/taxi-availability", function(obj) {
    // console.log(JSON.stringify(obj))
      taxiArr = [];
      for(i = 0; i<obj.features[0].geometry.coordinates.length; i++){
      data = obj.features[0].geometry.coordinates[i];
      // console.log(JSON.stringify(data))
      var taxiLat = data[1];
      var taxiLng = data[0];
      taxiLatLng = new google.maps.LatLng(taxiLat,taxiLng);
      // console.log(taxiLat, taxiLng)
      filterTaxisByLocation();
      map.setZoom(16);
    }
    console.log(taxiArr);
    randomTaxi();
  });
  
}
///////////////////////////////////////////////////////////////////////get Taxis from API END//




////////////////////////////////////////////////////////////////////////successFunc//
  
  function successFunc(position){
  console.log(position);
  var currentLat = position.coords.latitude;
  var currentLng = position.coords.longitude;
  latLngForReverseGeocode = {lat:currentLat,lng:currentLng}
  console.log(latLngForReverseGeocode)
  currentLatLng = new google.maps.LatLng(currentLat,currentLng);
  latLngForTaxiToUser = {lat:currentLat,lng:currentLng}
  console.log(latLngForTaxiToUser)
  // latLngForTaxiToUser = {lat:currentLat,lng:currentLng}
  
  map = new google.maps.Map(document.getElementById('map_canvas'), {
      center: currentLatLng,
      zoom: 16,
      disableDefaultUI: true
      // ,styles: [
      //   {
      //     "elementType": "geometry",
      //     "stylers": [
      //       {
      //         "color": "#ebe3cd"
      //       }
      //     ]
      //   },
      //   {
      //     "elementType": "labels.text.fill",
      //     "stylers": [
      //       {
      //         "color": "#523735"
      //       }
      //     ]
      //   },
      //   {
      //     "elementType": "labels.text.stroke",
      //     "stylers": [
      //       {
      //         "color": "#f5f1e6"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "administrative",
      //     "elementType": "geometry.stroke",
      //     "stylers": [
      //       {
      //         "color": "#c9b2a6"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "administrative.land_parcel",
      //     "elementType": "geometry.stroke",
      //     "stylers": [
      //       {
      //         "color": "#dcd2be"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "administrative.land_parcel",
      //     "elementType": "labels.text.fill",
      //     "stylers": [
      //       {
      //         "color": "#ae9e90"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "landscape.natural",
      //     "elementType": "geometry",
      //     "stylers": [
      //       {
      //         "color": "#dfd2ae"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "poi",
      //     "elementType": "geometry",
      //     "stylers": [
      //       {
      //         "color": "#dfd2ae"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "poi",
      //     "elementType": "labels.text.fill",
      //     "stylers": [
      //       {
      //         "color": "#93817c"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "poi.park",
      //     "elementType": "geometry.fill",
      //     "stylers": [
      //       {
      //         "color": "#a5b076"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "poi.park",
      //     "elementType": "labels.text.fill",
      //     "stylers": [
      //       {
      //         "color": "#447530"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "road",
      //     "elementType": "geometry",
      //     "stylers": [
      //       {
      //         "color": "#f5f1e6"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "road.arterial",
      //     "elementType": "geometry",
      //     "stylers": [
      //       {
      //         "color": "#fdfcf8"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "road.highway",
      //     "elementType": "geometry",
      //     "stylers": [
      //       {
      //         "color": "#f8c967"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "road.highway",
      //     "elementType": "geometry.stroke",
      //     "stylers": [
      //       {
      //         "color": "#e9bc62"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "road.highway.controlled_access",
      //     "elementType": "geometry",
      //     "stylers": [
      //       {
      //         "color": "#e98d58"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "road.highway.controlled_access",
      //     "elementType": "geometry.stroke",
      //     "stylers": [
      //       {
      //         "color": "#db8555"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "road.local",
      //     "elementType": "labels.text.fill",
      //     "stylers": [
      //       {
      //         "color": "#806b63"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "transit.line",
      //     "elementType": "geometry",
      //     "stylers": [
      //       {
      //         "color": "#dfd2ae"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "transit.line",
      //     "elementType": "labels.text.fill",
      //     "stylers": [
      //       {
      //         "color": "#8f7d77"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "transit.line",
      //     "elementType": "labels.text.stroke",
      //     "stylers": [
      //       {
      //         "color": "#ebe3cd"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "transit.station",
      //     "elementType": "geometry",
      //     "stylers": [
      //       {
      //         "color": "#dfd2ae"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "water",
      //     "elementType": "geometry.fill",
      //     "stylers": [
      //       {
      //         "color": "#b9d3c2"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "water",
      //     "elementType": "labels.text.fill",
      //     "stylers": [
      //       {
      //         "color": "#92998d"
      //       }
      //     ]
      //   }
      // ]
  });

  var currentMarker = new google.maps.Marker({
      position: currentLatLng,
      map: map,
      draggable: false,
      icon:'img/icons/userLocation.png',
      title:'Current location'
  });
  //when click the marker
  currentMarker.addListener('click',function(){
    //info window - map name, marker name
      infoWindowCurrent.open(map,currentMarker);
      if(currentMarker.getAnimation() !== null){
      console.log("not null");
      currentMarker.setAnimation(null);
      }else{
      currentMarker.setAnimation(google.maps.Animation.DROP)
      }
  })
  var infoWindowCurrent = new google.maps.InfoWindow({
      content:"Current Location"
      })
      taxiData();
  }
////////////////////////////////////////////////////////////////////////successFunc END  //


  ///////////////////////////////////////////////////////////////Get user location//
  function getLocation(){
    console.log('getlocation');
      //ask for location
      navigator.geolocation.getCurrentPosition(successFunc,
         error => {
          console.error(error)
        }, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000
        })

  }//end of get location
  ////////////////////////////////////////////////////////////////Get user location END//

  $(document).on("pagecreate","#pageone",function(){
    console.log('page one created');
    getLocation();
  });
