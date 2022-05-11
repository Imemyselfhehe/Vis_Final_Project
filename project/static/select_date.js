function SelectDate(clicked_id) {

    var active = document.getElementsByClassName("active");

    //if active == null{

    //}
    
    //console.log(active[0].text);
    
    //while(active.length)
    //    active[0].classList.remove("active");

    //geoMap(active[0].id,active[0].text , clicked_id );
    PCPPlotFlask( clicked_id );
    barFlask( clicked_id );
    lineplotFlask(clicked_id);

    if (active == null){
        geomapFlask('median_listing_price',  clicked_id);
    }
    else{
        geomapFlask( active[0].id  ,  clicked_id);
    }

}