    var directionsDisplay;
    var directionsService = new google.maps.DirectionsService();
    var taxiToUserMap;
    var taxiLocation; //rand from page 1
    var userLocation; //user location from page 1
    var chosenDriver;

    var taxiDriver = [
        {pic:"img/driver/driver0.png",name:"Sammy Sun",car:"Toyota Vellfire Prime Royal",carPlate:"SMR4036Y",rating:"4.3"},
        {pic:"img/driver/driver1.png",name:"Charles Kang",car:"Toyota Prius Alpha Hybrid",carPlate:"SGF1881C",rating:"4.7"},
        {pic:"img/driver/driver2.png",name:"Roland Soh",car:"Honda Fit",carPlate:"SGK7437M",rating:"4.8"},
        {pic:"img/driver/driver3.png",name:"Ethan Sun",car:"Hyundai Avante",carPlate:"SWR8703J",rating:"4.7"},
        {pic:"img/driver/driver4.png",name:"Davin Yu",car:"Toyota Corolla Axio Hybrid",carPlate:"SGK9429A",rating:"5.0"},
        {pic:"img/driver/driver5.png",name:"Lewis Boo",car:"Toyota Prius Alpha Hybrid",carPlate:"SGS6006L",rating:"4.9"},
        {pic:"img/driver/driver6.png",name:"Russell Poon",car:"Toyota Prius Alpha Hybrid",carPlate:"SJZ1678U",rating:"4.9"},
        {pic:"img/driver/driver7.png",name:"Nathaniel Cheah",car:"Hyundai Avante",carPlate:"SCG3828L",rating:"4.8"},
        {pic:"img/driver/driver8.png",name:"Rusty Chin",car:"Hyundai Avante",carPlate:"SMK9590E",rating:"5.0"},
        {pic:"img/driver/driver9.png",name:"Ng Sheng Yuan",car:"Hyundai Avante",carPlate:"SFX4435Z",rating:"5.0"},
    ]

    function openPopupPage3(){
        $("#popupBasicPage3").css("display", "block");
      }

    /////////////////////////////////////////////////////Change CSS Styling//
    function addDriverDetails(){
        var randDriver = Math.floor(Math.random() * taxiDriver.length);
        console.log(taxiDriver);
        console.log(randDriver);
        console.log(taxiDriver[randDriver]);
        chosenDriver = taxiDriver[randDriver];
        $("#driverImg").attr("src",chosenDriver.pic);
        $(".driverName").text(chosenDriver.name);
        $(".driverCarType").text(chosenDriver.car);
        $(".driverPlate").text(chosenDriver.carPlate);
        $(".driverRatingScore").text(chosenDriver.rating);

        setTimeout(function(){openPopupPage3();}, 10000);
    }
    /////////////////////////////////////////////////////Change CSS Styling END//

    /////////////////////////////////////////////////////Change CSS Styling//
    function changeCssThree(duration){
        console.log(duration);
        $("#taxiToUserMap").css("height", "65%");
        $("#pageThreeContainer").show();
        $("#driverTimingVal").text(duration);
        addDriverDetails();
    }
    /////////////////////////////////////////////////////Change CSS Styling END//

    /////////////////////////////////////////////////////Calculate values for display//
    function calcRouteTaxiToUser() {
        console.log("calcRoute");

        var request = {
        origin:taxiLocation,
        destination:userLocation,
        // origin:{lat: 1.316743,lng: 103.926012},
        // destination:{lat: 1.3573661,lng: 103.8452482},
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

            //cab fare
            var fare = (2.7 + (distanceval/1000)*0.7).toFixed(2);
            if (fare<6){
            fare = 6;
            console.log("Cab fare: " + fare);
            }else{
            console.log("Cab fare: " + fare);
            }
            changeCssThree(duration);
            ////////////////////////////////////////////////////////////////////////////////////////////////////////END OF PAGE 3
        }
        });
        

    }
    /////////////////////////////////////////////////////Calculate values for display END//

    /////////////////////////////////////////////////////Set the map for the page//
    function getTaxiToUserDirections() {
        console.log(originAddress);
        console.log('getDirections');
        //set locations //define here cos marker needs the taxi location
            taxiLocation = rand;
            userLocation = latLngForTaxiToUser;
            console.log(taxiLocation,userLocation)
        //set locations//END
        directionsDisplay = new google.maps.DirectionsRenderer({
            suppressMarkers: true
        });

        //change for zoom on mobile ??
        var directionsOptions = {
            zoom:40,
            disableDefaultUI: true
        }
        taxiToUserMap = new google.maps.Map(document.getElementById("taxiToUserMap"), directionsOptions);
        directionsDisplay.setMap(taxiToUserMap);

        //set marker image and infowindow//
        var taxiArriveMarker = new google.maps.Marker({
            position: taxiLocation,
            // position: {lat: 1.316743,lng: 103.926012},
            map: taxiToUserMap,
            draggable: false,
            icon:'img/icons/taxi.png',
        });
        var arriveAtUserMarker = new google.maps.Marker({
            position: originLatLng,
            // position: {lat: 1.3573661,lng: 103.8452482},
            map: taxiToUserMap,
            draggable: false,
            icon:'img/icons/userLocation.png'
        });
        var arriveAtUserInfoWindow = new google.maps.InfoWindow({
        content: "<span style='font-size:24px'>"+originAddress+"</span>"
        })
        arriveAtUserInfoWindow.open(taxiToUserMap,arriveAtUserMarker);
        //set marker image and infowindow END//

        calcRouteTaxiToUser();
    }
    /////////////////////////////////////////////////////Set the map for the page END//
    function findingTaxiSuccess(){
        $("#taxiToUserMap").css({
            "background-image": "url('img/svg/findingTaxiSuccess.svg')",
            "height":"100%"
        })
        setTimeout(function(){getTaxiToUserDirections();}, 2000);
    }

    ////////////////////////////////////////////////////findDriverDelay//
    function findDriverDelay(){

        setTimeout(function(){findingTaxiSuccess();}, 5000);
        
        // setTimeout(function(){getTaxiToUserDirections();}, 0);
    }
    ////////////////////////////////////////////////////findDriverDelay END//
    


    $( document ).on( "pageshow", "#pagethree", function() {
        console.log('page three show');
        findDriverDelay();
        $(document).on("tap", "#taxiArrivedBtn", function(){
            console.log("button tapped")
            $( ":mobile-pagecontainer" ).pagecontainer( "change", "#pagefour", { role: "page" } );
        })

        //dialog popup
        $(document).on("tap","#closePopup",function(){
            console.log("close dialog")
            // $("#popupBasic").dialog('close');
            $("#popupBasicPage3").css("display","none");
        });
    });
