//global variables for next pages
var journeyStartTime;
var journeyEndTime;
var journeyDistance;
var journeyDuration;
var chosenDay;
var chosenMonth;
var chosenYear;
var userRideObj;


//Stored array to be used to store in firebase for CA2
function createStoredArray(){
  userRideObj = {};
  userRideObj.originAddress = originAddress;
  userRideObj.destinationAddress = destinationAddress;
  userRideObj.fare = fare;
  userRideObj.journeyStartTime = journeyStartTime;
  userRideObj.journeyEndTime = journeyEndTime;
  userRideObj.journeyDistance = journeyDistance;
  userRideObj.journeyDuration = journeyDuration;
  userRideObj.chosenDay = chosenDay;
  userRideObj.chosenMonth = chosenMonth;
  userRideObj.chosenYear = chosenYear;
  console.log(userRideObj);
  console.log(originAddress,destinationAddress);
  console.log(fare);
  //chosen driver not added
  console.log(chosenDriver);
  console.log(journeyStartTime,journeyEndTime,journeyDistance,journeyDuration,chosenDay,chosenMonth,chosenYear); 
}

  function openPopupPage4(){
    $("#popupBasicPage4").css("display", "block");
  }



////////////////////////////////////////////////getDirections for routing polylines//
function getJourneyRoute(journeyStartTime,journeyEndTime) {
  console.log('getDirections');
  directionsDisplay = new google.maps.DirectionsRenderer({
      suppressMarkers: true
  });
  

  console.log("below checks if start and destination has been declared")
  console.log(originLatLng,destinationLatLng);

  var startJourneyMarker = new google.maps.Marker({
    position: originLatLng,
    map: journeyMap,
    draggable: false,
    icon:'img/icons/taxi.png'
  });
  var endJourneyMarker = new google.maps.Marker({
    position: destinationLatLng,
    map: journeyMap,
    draggable: false,
    icon:'img/icons/destination.png'
});
  var endJourneyInfoWindow = new google.maps.InfoWindow({
    content:"<span class='infoWindowTitle'>Destination</span><br>"+"<span class='infoWindowValue'>"+destinationAddress+"<br></span>"
    +"<span class='infoWindowTimings'>"+journeyStartTime+" ~ "+journeyEndTime+"</span>"
  })
  endJourneyInfoWindow.open(journeyMap,endJourneyMarker);
  
  console.log("All functions for page 4 have been completed")
      //dialog driver has said that arrived
      //button appear to go page 5
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////END OF PAGE 2
      console.log(journeyStartTime,
        journeyEndTime,
        journeyDistance,
        journeyDuration,
        chosenDay,
        chosenMonth,
        chosenYear);

  createStoredArray();
  setTimeout(function(){openPopupPage4();}, 10000);
}
////////////////////////////////////////////////getDirections for routing polylines END//

////////////////////////////////////////////////Random Stuff//
function createMap4(){
  //start = new google.maps.LatLng(directionsLatLng);
  //change for zoom on mobile ??
  journeyMap = new google.maps.Map(document.getElementById("journey-canvas"), {
    zoom:20,
    disableDefaultUI: true
    // ,center:currentLatLng
  });
  directionsDisplay.setMap(journeyMap);
}

function changeCssFour(journeyEndTime){
  console.log(chosenDriver);
  $(".timingVal").text(journeyEndTime);
  $(".carplate4").text(chosenDriver.carPlate);
  $(".cartype4").text(chosenDriver.car);
  $(".driverName4").text(chosenDriver.name);
  $(".driverRatingScore4").text(chosenDriver.rating);
  $(".driverImg4").attr("src",chosenDriver.pic)

}

////////////////////////////////////////////////Random Stuff END//

///////////////////////////////////////////////Calculations for Journey//
function calcJourney() {
  console.log("calcRoute");

  createMap4();

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
    console.log(JSON.stringify(result));
    // console.log(JSON.stringify(result.routes[0].legs[0].distance.value));
    if (status != google.maps.DirectionsStatus.OK) {
      console.log("callback failed");
    }else{
      directionsDisplay.setDirections(result);
      
      journeyDistance = result.routes[0].legs[0].distance.text;
      var distanceval = result.routes[0].legs[0].distance.value;
      journeyDuration = result.routes[0].legs[0].duration.text;
      console.log(journeyDistance, journeyDuration)

      var durationval = result.routes[0].legs[0].duration.value;
      journeyStartTime = request.drivingOptions.departureTime.toLocaleTimeString();
      var calculateTime = request.drivingOptions.departureTime;
      calculateTime.setMinutes( calculateTime.getMinutes() + durationval/60);
      journeyEndTime = calculateTime.toLocaleTimeString()
      console.log(journeyStartTime, journeyEndTime);

      //cab fare
      var fare = (2.7 + (distanceval/1000)*0.7).toFixed(2);
      if (fare<6){
        fare = 6;
        console.log("Cab fare: " + fare);
      }else{
        console.log("Cab fare: " + fare);
      }
      getJourneyRoute(journeyStartTime,journeyEndTime);
      changeCssFour(journeyEndTime);
    
    }
  });
}

function calcDate(){
  var today = new Date();
  chosenDay = today.getDate();
  var todayJourneyMonth = today.getMonth();
  var monthInYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  chosenMonth = monthInYear[todayJourneyMonth];
  chosenYear = today.getFullYear()
  console.log(chosenDay,chosenMonth, chosenYear);
}
///////////////////////////////////////////////Calculations for Journey END//


    $(document).on("pageshow","#pagefour",function(){
      console.log("page four show");
      calcJourney();
      calcDate();
      $(document).on("tap", "#journeyComplete", function(){
        $( ":mobile-pagecontainer" ).pagecontainer( "change", "#pagefive", { role: "page" } );
      });

      //dialog popup
      $(document).on("tap","#closePopup",function(){
        console.log("close dialog")
        // $("#popupBasic").dialog('close');
        $("#popupBasicPage4").css("display","none");
      });

    });