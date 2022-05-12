function SelectDate( clicked_id) {

    var active = document.getElementsByClassName("active");

    //if active == null{

    //}
    
    //console.log(active[0].text);
    
    //while(active.length)
    //    active[0].classList.remove("active");

    //geoMap(active[0].id,active[0].text , clicked_id );
    PCPPlotFlask( "year" ,  clicked_id );
    barFlask( "year",  clicked_id );
    lineplotFlask( "year" , clicked_id);
    scatterPlotFlask( "year" , clicked_id);

    if (active == null){
        geomapFlask('median_listing_price',  clicked_id);
    }
    else{
        geomapFlask( active[0].id  ,  clicked_id);
    }

}



function SelectState( state ) {

    //var active = document.getElementsByClassName("active");

    PCPPlotFlask( "state" , state );
    barFlask( "state" , state );
    lineplotFlask( "state" , state );
    scatterPlotFlask( "state" , state );

    //if (active == null){
    //    geomapFlask('median_listing_price',  clicked_id);
    //}
    //else{
    //    geomapFlask( active[0].id  ,  clicked_id);
    //}

}