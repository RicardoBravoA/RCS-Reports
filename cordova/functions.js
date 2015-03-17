
function obtenerVariables(name){
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp ( regexS );
    var tmpURL = window.location.href;
    var results = regex.exec( tmpURL );
    
    if(results == null){
        return "-1";
    }else{
        return results[1];
    }
}

function checkNetConnection(){
    var status = navigator.onLine;
    if(status){
        return true;
    }else{
        return false;
    }
}

function validIP(ip, port, _url, alias, use, site){
    var xurl = _url+'/region/';
    var valor = obtenerVariables('variable');
    $.ajax({
        type: 'get',
        timeout: 15000,
        url: xurl,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: true,
        crossdomain: true,
        beforeSend: function() { //alert("before");
            showLoading(); 
        },        
        complete: function() { //alert("complete");
            hideLoading(); 
        },    
        success: function(data, textStatus, XMLHttpRequest){
            console.log('Error: ' + textStatus);
            console.log('url '+_url+" - xurl: "+xurl);
            if(valor!=-1){
                updateState();
                deleteConfiguration();
                addData(ip, port, _url, alias, use, site);
            }else{
                addData(ip, port, _url, alias, use, site);
            }            
        },
        error:function (xhr, ajaxOptions, thrownError){
            console.log(xhr.status);
            console.log(xhr.statusText);
            console.log(xhr.responseText);
            alert("url incorrecta");
        }
            
    });
}


function selectOption(){    
    var value = $(this).attr("data-value");    
    alert(value);
}

function showCombo(){
    $("#divRegion").show("slow");
    $('body').addClass('mostrarRegion'); /* varia si existe regiones*/
    loadRegionCode();
}

function hideCombo(){
    $("#divRegion").hide();
    $('body').addClass('ocultarRegion'); /* Siempre carga*/
/*
     var elElemento=document.getElementById("divRegion");
       //if(elElemento.style.display == 'block') {
          elElemento.style.display = 'none';2
       //} else {
         // elElemento.style.display = 'block';
       //}
*/
}

function loadRegions(){
    localDB.transaction(loadRegionsConsulta, errorDB);
}

function loadRegionsConsulta(tx){
    console.log("Cargando registros de la base de datos");
    tx.executeSql("SELECT "+KEY_URLBASE+" FROM "+TABLE_URL+" WHERE "+KEY_USE+" = 1;", [], loadRegionsSuccess, errorDB);
}

function loadRegionsSuccess(tx, results){
    console.log("Recibidos de loadRegions " + results.rows.length + " registros");
    if(results.rows.length == 0){
        console.log("No se han recibido registros loadRegions");
    }
    
    //for(var i=0; i<results.rows.length; i++){
        var data = results.rows.item(0);
        var xurl = data.urlBase;
        var yurl = xurl+"/region/";
        console.log("url loadRegions: "+yurl);

                $.ajax({
                    url: yurl,
                    type: 'get',
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',                  
                    timeout: 15000,
                    crossdomain: true,
                    async: true,
                    beforeSend: function() { //alert("before");
                        showLoading(); 
                    },        
                    complete: function() { //alert("cmplete");
                        hideLoading(); 
                    },                
                    success: function(data){
                        if(data.quantity==1){
                            console.log("entro");
                            $(data.data).each(function(index, value){
                                var regionCode = value.regionCode;
                                var regionName = value.regionName;

                                $('#selectRegion')
                                  .append($("<li class='item' id= "+regionCode+"><p>"+regionName+"</p></li>")
                                  .attr("data-value",regionCode)
                                  .text(regionName));                      

                              });                                
                                showCombo();
                        }else{
                            console.log("no entra");
                            hideCombo();
                            downloadGoal();
                        }
                    }
                });


    //}
    
}

function validData(pin, check){
    var xurl ="";
    var query = "SELECT "+KEY_URLBASE+" FROM "+TABLE_URL+" WHERE "+KEY_USE+" = 1;";

    try {
        localDB.transaction(function(transaction){        
            transaction.executeSql(query, [], function(transaction, results){            
                xurl = results.rows.item(0).urlBase; 

                var yurl = xurl+"/login/session/post";
                var array = {Pin: pin};

                $.ajax({
                url: yurl,
                timeout: 15000,
                type: 'POST',
                data: JSON.stringify(array),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                async: true,
                crossdomain: true,
                beforeSend: function() { //alert("before");
                    showLoading(); 
                },        
                complete: function() { //alert("complete");
                    hideLoading(); 
                },   
                success: function(data){
                    if(data.successful==1){
                        addConfiguration(check);
                    }else{
                        alert("Datos incorrectos");
                    }
                }
                });

            },function(transaction, error){
                console.log("Error: " + error.code + "<br>Mensage: " + error.message);
            });
        });
    } catch (e) {
        console.log("Error getUrlBase " + e + ".");
    }
}




function drawGraphic(year1, year2, year3, sales1, sales2, sales3, option){
    var chartData = [
    {
        "year": year1,
        "duration": sales1
    },
    {
        "year": year2,
        "duration": sales2
    },
    {
        "year": year3,
        "duration": sales3
    }
    ];
    var chart = AmCharts.makeChart("chartdiv-"+option, {
     theme: "none",
      type: "serial",
      dataDateFormat: "YYYY",
      dataProvider: chartData,
      addClassNames: true,
      //startDuration: 0,
      color: "#f1f1f1",
      marginLeft: 0,
      categoryField: "year",

      valueAxes: [{
        id: "a3",
        position: "right",
        gridAlpha: 0,
        axisAlpha: 0,
        inside: true,
        ignoreAxisWidth: true
      }],
      graphs: [{
        id: "g3",
        valueField: "duration",
        type: "line",
        lineColor: "#fff",
        balloonText: "[[category]]<br><b>[[value]]</b>",
        lineThickness: 2,
        bullet: "round",
        bulletBorderColor: "#f1f1f1",
        bulletBorderThickness: 2,
        bulletBorderAlpha: 1,
        dashLengthField: "dashLength",
        animationPlayed: false
      }],

      /*
      chartCursor: {
        zoomable: false,
        categoryBalloonDateFormat: "YYYY",
        cursorAlpha: 0,
        cursorPosition: "mouse",
        valueBalloonsEnabled: false,
        valueLineEnabled:true,
        valueLineBalloonEnabled:true
      }
      */
    });

}
