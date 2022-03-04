function goPageOne(){
    $( ":mobile-pagecontainer" ).pagecontainer( "change", "#pageone", { role: "page" } );
}

$(document).on("pagecreate","#pagezero",function(){
    console.log('page zero created');
    setTimeout(function(){goPageOne();}, 2000);
  });