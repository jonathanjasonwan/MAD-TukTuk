
function changeCssFive(){
    $(".driverImg5").attr("src",chosenDriver.pic)
    $(".driverName5").text(chosenDriver.name);
    //rating star
    $(".carPlate5").text(chosenDriver.carPlate);
    $(".carType5").text(chosenDriver.car);
    $(".fareVal5").text(fare);
    $(".distance5").text(journeyDistance);
    $(".duration5").text(journeyDuration);
    $("#userLocationValue5").text(originAddress);
    $("#userDestinationValue5").text(destinationAddress);
}

function retrieveDataPage5(){
    console.log(originAddress,destinationAddress);
    console.log(fare);
    console.log(chosenDriver);
    console.log(journeyStartTime,journeyEndTime,journeyDistance,journeyDuration,chosenDay,chosenMonth,chosenYear);
    changeCssFive();
}

// function openPopup(){
//     $("#popupBasic").dialog();
// }


$( document ).on( "pageshow", "#pagefive", function() {
    console.log('page five show');

    // setTimeout(function(){openPopup();}, 500);
    retrieveDataPage5();

    $(document).on("tap","#closePopup",function(){
        console.log("close dialog")
        // $("#popupBasic").dialog('close');
        $("#popupBasic").css("display","none");
    });

    $(document).on("tap","#returnHome",function(){
        $( ":mobile-pagecontainer" ).pagecontainer( "change", "#pageone", { role: "page" } );
        console.log("button pressed");
    });

    //rating star
    $(document).on("tap", "#oneStar", function(){
        $("#userRatingScore").attr("src","img/rating/star1.svg");
        $("#popupBasic").css("display","none");
    });
    $(document).on("tap", "#twoStar", function(){
        $("#userRatingScore").attr("src","img/rating/star2.svg");
        $("#popupBasic").css("display","none");
    });
    $(document).on("tap", "#threeStar", function(){
        $("#userRatingScore").attr("src","img/rating/star3.svg");
        $("#popupBasic").css("display","none");
    });
    $(document).on("tap", "#fourStar", function(){
        $("#userRatingScore").attr("src","img/rating/star4.svg");
        $("#popupBasic").css("display","none");
    });
    $(document).on("tap", "#fiveStar", function(){
        console.log("tapped")
        $("#userRatingScore").attr("src","img/rating/star5.svg");
        $("#popupBasic").css("display","none");
    });
});