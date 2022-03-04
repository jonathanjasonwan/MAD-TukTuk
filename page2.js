var directionsDisplay; // google.maps.DirectionsRenderer
var directionsService = new google.maps.DirectionsService();
var directionsMap; //Name of the routing map for user to destination
var fare; //for page >5
function makeMarkers(distance,duration){
  var userStartPointMarker = new google.maps.Marker({
    position: originLatLng,
    map: directionsMap,
    draggable: false,
    icon:'img/icons/userLocation.png'
  });
  var destinationMarker = new google.maps.Marker({
    position: destinationLatLng,
    map: directionsMap,
    draggable: false,
    icon:'img/icons/destination.png'
});
  var userStartPointInfoWindow = new google.maps.InfoWindow({
    content:"<span class='infoWindowTitle'>Start</span><br>"+"<span class='infoWindowValue'>"+originAddress+"</span>"
  })
  var destinationInfoWindow = new google.maps.InfoWindow({
    content:"<span class='infoWindowTitle'>Destination</span><br>"+"<span class='infoWindowValue'>"+destinationAddress+"</span>"
            +"<br>"+"<span class='infoWindowDistance'>"+distance+"</span>"+"<span class='infoWindowDuration'>"+duration+"</span>"
  })
  userStartPointInfoWindow.open(directionsMap,userStartPointMarker);
  destinationInfoWindow.open(directionsMap,destinationMarker);
}

function calcRoute() {
  console.log("calcRoute");

  var request = {
    origin:originLatLng,
    destination:destinationLatLng,
    travelMode: 'DRIVING',
    drivingOptions: {
      departureTime: new Date(),  // for the time N milliseconds from now.
      trafficModel: 'bestguess'
    },
    unitSystem: google.maps.UnitSystem.metric,
    avoidHighways: false,
    avoidTolls: false
  };

  directionsService.route(request, function(result, status) {
    console.log(JSON.stringify(result.routes[0].legs[0].distance.value));
    if (status != google.maps.DirectionsStatus.OK) {
      console.log("callback failed");
    }else{
      directionsDisplay.setDirections(result);
      console.log(result);
      var distance = result.routes[0].legs[0].distance.text;
      var distanceval = result.routes[0].legs[0].distance.value;
      var duration = result.routes[0].legs[0].duration.text;
      console.log(distance, duration)

      var durationval = result.routes[0].legs[0].duration.value;
      var startTime = request.drivingOptions.departureTime.toLocaleTimeString();
      var calculateTime = request.drivingOptions.departureTime;
      calculateTime.setMinutes( calculateTime.getMinutes() + durationval/60);
      var endTime = calculateTime.toLocaleTimeString()
      console.log(startTime, endTime);

      console.log(originAddress,destinationAddress)
      //cab fare
      fare = (2.7 + (distanceval/1000)*0.7).toFixed(2);
      if (fare<6){
        fare = 6;
        console.log("Cab fare: " + fare);
      }else{
        console.log("Cab fare: " + fare);
      }

      
      makeMarkers(distance,duration);
      changeCssTwo(fare);
      console.log("All functions for page 2 have been completed")
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////END OF PAGE 2
    
    }
  });
}


 /////////////////////////////////////////////////////Change CSS Styling//
 function changeCssTwo(fare){
   console.log('fare');
   console.log(originAddress, destinationAddress);
  $("#userLocationValue").text(originAddress);
  $("#userDestinationValue").text(destinationAddress);
  $("#currencyVal").text(fare);
}
/////////////////////////////////////////////////////Change CSS Styling END//

////////////////////////////////////////////////getDirections for routing polylines//
function getDirections() {
	console.log('getDirections');
  directionsDisplay = new google.maps.DirectionsRenderer({
      suppressMarkers: true
  });
  
  //start = new google.maps.LatLng(directionsLatLng);
  //change for zoom on mobile ??
  directionsMap = new google.maps.Map(document.getElementById("directions-canvas"), {
    zoom:20,
    disableDefaultUI: true
    // ,center:currentLatLng
  });
  directionsDisplay.setMap(directionsMap);
  console.log("below checks if start and destination has been declared")
  console.log(originLatLng,destinationLatLng);
  
  calcRoute();
}
////////////////////////////////////////////////getDirections for routing polylines END//


$( document ).on( "pageshow", "#directionsPage", function() {
  console.log('page two show');
  setTimeout(function(){getDirections();}, 300);
  $(document).on("tap", "#bookingConfirmed", function(){
    $( ":mobile-pagecontainer" ).pagecontainer( "change", "#pagethree", { role: "page" } );
  })
  $(document).on("tap", "#backBtn2", function(){
    $( ":mobile-pagecontainer" ).pagecontainer( "change", "#pageone", { role: "page" } );
  })
});

