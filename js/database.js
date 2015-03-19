var localDB = 'RCS';

var TABLE_URL = "URLSTORE";
var TABLE_CONFIGURATION = "CONFIGURATION";
var TABLE_REGION = "REGION";
var KEY_ID = "id";
var KEY_IP = "ip";
var KEY_PORT = "port";
var KEY_URLBASE= "urlBase";
var KEY_ALIAS = "alias";
var KEY_USE="use";
var KEY_SITE="site";
var KEY_REMEMBER="site";
var KEY_REGIONCODE="regionCode";
var KEY_IDURL="idUrl";

function onInit(){
    try {
        if (!window.openDatabase) {
            console.log("No soporta BD");
        }
        else {
            initDB();
            createTables();
        }
    } 
    catch (e) {
        if (e == 2) {
            console.log("Versión de base de datos invalida");
        }
        else {
            console.log("Error de desconexión: " + e + ".");
        }
        return;
    }
}

function initDB(){
    var shortName = 'RCS';
    var version = '2.0';
    var displayName = 'RCS Reports';
    var maxSize = 10240; // Em bytes
    localDB = window.openDatabase(shortName, version, displayName, maxSize);
}

function createTables(){

    var tableURL = "CREATE TABLE " + TABLE_URL + " ( "
                + KEY_ID + " INTEGER PRIMARY KEY, " + KEY_IP + " TEXT, " + KEY_PORT + " TEXT, " +KEY_URLBASE + " TEXT, "
                + KEY_ALIAS + " TEXT, "  + KEY_USE + " TEXT, "+KEY_SITE+" TEXT ) ";
        
    var tableConfiguration = "CREATE TABLE "+TABLE_CONFIGURATION+"("+KEY_REMEMBER+" TEXT)";      
        
    var tableRegion = "CREATE TABLE "+TABLE_REGION+"("+KEY_ID+" INTEGER PRIMARY KEY, "+KEY_REGIONCODE+" TEXT, "
                +KEY_IDURL+" TEXT)";        

    try {
            localDB.transaction(function(transaction){
            transaction.executeSql(tableURL, [], nullDataHandler, errorHandler);
            console.log("Tabla URL status: OK.");
        });
    } 
    catch (e) {
        console.log("Error creando Tabla URL " + e + ".");
        return;
    }

    try {
            localDB.transaction(function(transaction){
            transaction.executeSql(tableConfiguration, [], nullDataHandler, errorHandler);
            console.log("Tabla CONFIGURATION status: OK.");
        });
    } 
    catch (e) {
        console.log("Error creando Tabla CONFIGURATION " + e + ".");
        return;
    }

    try {
            localDB.transaction(function(transaction){
            transaction.executeSql(tableRegion, [], nullDataHandler, errorHandler);
            console.log("Tabla REGION status: OK.");
        });
    } 
    catch (e) {
        console.log("Error creando Tabla REGION " + e + ".");
        return;
    }
}

function addData(ip, port, url, alias, use, site){
    var query = "INSERT INTO "+TABLE_URL + " ( " + KEY_IP + " , " + KEY_PORT 
                     + " , " + KEY_URLBASE + ", " + KEY_ALIAS + " , "+KEY_USE + ", "+KEY_SITE+") VALUES (?,?,?,?,?,?);";
    try {
        localDB.transaction(function(transaction){
            transaction.executeSql(query, [ip, port, url, alias, use, site], function(transaction, results){
                if (!results.rowsAffected) {
                    console.log("Error no se inserto Data");
                }else{
                    console.log("Insert realizado, id: " + results.insertId);
                    window.location.href = "login.html";
                }
            }, errorHandler);
        });
    }catch (e) {
        console.log("Error addData " + e + ".");
    }
}

function downloadGoal(){
    localDB.transaction(downloadGoalConsulta, errorDB);
}

function downloadGoalConsulta(tx){
    tx.executeSql("SELECT "+KEY_URLBASE+" FROM "+TABLE_URL+" WHERE "+KEY_USE+" = 1;", [], downloadGoalSuccess, errorDB);
}

function downloadGoalSuccess(tx, results){

    console.log("Recibidos de downloadGoalSuccess " + results.rows.length + " registros");
    if(results.rows.length == 0){
        console.log("No se han recibido registros downloadGoalSuccess");
    }

    var regionCode = $("ul.select-region li:first-child()").attr("data-value");
    console.log("region seleccionada "+regionCode);

    var optionCode = $("ul.select-date li:first-child()").attr("data-value");
    console.log("option seleccionada "+optionCode);

    if(regionCode=="R-1"){
        regionCode="";
    }
    
    //for(var i=0; i<results.rows.length; i++){
        var data = results.rows.item(0);
        var url_ = data.urlBase;                
        var xurl = url_+'/reportgoal/post';
        console.log("url downloadGoal "+xurl);
        var array = {option: optionCode, regionCode: regionCode};
        console.log("array : optionCode"+optionCode+" - regionCode: "+regionCode);

        console.log("downloadGoalSuccess: "+url_);
        
            $.ajax({
                url: xurl,
                type: 'POST',
                data: JSON.stringify(array),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                async: true,
                crossdomain: true,
                beforeSend: function(){
                    showLoading(); 
                },        
                complete: function(){
                    hideLoading(); 
                },
                success: function(data, textStatus, XMLHttpRequest){
                    
                    $("#items").empty();
                    $('.modal-backdrop').remove();  
                    if(data.quantity>0){                            
                        var mostrar = "";
                        var indice = 0;   
                            
                        $(data.report).each(function(index, value){
                            var goalAmount = value.goalAmount;
                            var goalAmountGlobal = value.goalAmountGlobal;
                            var payTotal = value.payTotal;
                            var payTotalGlobal = value.payTotalGlobal;  
                            var storeName = value.storeName;
                            var color = "";
                            var colorGlobal = "";
                            var percent = (payTotal * 100)/goalAmount;
                            var percentGlobal = (payTotalGlobal * 100)/goalAmountGlobal;

                            if(payTotal=="0.00000" || goalAmount=="0.00000"){
                                percent = "0.00";
                            }

                            if(payTotalGlobal=="0.00000" || goalAmountGlobal=="0.00000"){
                                percentGlobal = "0.00";
                            }

                            if(percent < 75){
                                color = "percentage red";
                            }

                            if(percent > 74 && percent < 100){
                                color = "percentage ambar";
                            }

                            if(percent > 99){
                                color = "percentage green";
                            }

                            if(goalAmount=="0.00000" && payTotal>"0.00000"){
                                color = "percentage green";
                            }

                            if(percentGlobal < 75){
                                colorGlobal = "percentage red";
                            }

                            if(percentGlobal > 74 && percentGlobal < 100){
                                colorGlobal = "percentage ambar";
                            }

                            if(percentGlobal > 99){
                                colorGlobal = "percentage green";
                            }

                            if(goalAmountGlobal=="0.00000" && payTotalGlobal>"0.00000"){
                                colorGlobal = "percentage green";
                            }

                            percent = parseFloat(percent).toFixed();
                            percentGlobal = parseFloat(percentGlobal).toFixed();

                            mostrar += "<ul class='col-xs-12' onclick=\"prueba('-"+indice+"')\">";

                                mostrar += "<li>";

                                    mostrar += "<h1 class='store-name'>"+storeName+"</h1>";

                                    mostrar += "<div class='actual'>";

                                        mostrar += "<p class='type'>A:</p>";
                                        mostrar += "<p class='gol-number'>"+parseFloat(goalAmount).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")+"</p>";
                                        mostrar += "<p class='sale-number'>"+parseFloat(payTotal).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")+"</p>";
                                        mostrar += "<p class='"+color+"'>"+percent+" %</p>";

                                    mostrar += "</div>";

                                    mostrar += "<div class='global'>";

                                        mostrar += "<p class='type'>G:</p>";
                                        mostrar += "<p class='gol-number'>"+parseFloat(goalAmountGlobal).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")+"</p>";
                                        mostrar += "<p class='sale-number'>"+parseFloat(payTotalGlobal).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")+"</p>";
                                        mostrar += "<p class='"+colorGlobal+"'>"+percentGlobal+" %</p>";

                                    mostrar += "</div>";
                                
                            var j = 0;
                            var array_description = [];
                            var array_total = [];

                            $(value.info).each(function(index, value){
                                var info = value.info;
                                var total = value.total; 

                                array_description[j] = info;
                                array_total[j] = total;

                                j++;   
                            });  

                                    
                                    mostrar += "<div id='chartdiv-"+indice+"' class='chartdiv-"+indice+"'></div>";

                                    mostrar += "<div class='detalle-"+indice+"'>";

                                        mostrar += "<div class='year'>Año</div><div class='quantity'>Cantidad</div>";
                                        mostrar += "<span>"+array_description[0]+"</span><span>"+parseFloat(array_total[0]).toFixed()+"</span>";
                                        mostrar += "<span>"+array_description[1]+"</span><span>"+parseFloat(array_total[1]).toFixed()+"</span>";
                                        mostrar += "<span>"+array_description[2]+"</span><span>"+parseFloat(array_total[2]).toFixed()+"</span>";

                                    mostrar += "</div>";
                                    
                                mostrar += "</li>";

                            mostrar += "</ul>"; 
                                

                            $("#items").append(mostrar); 
                                
                            drawGraphic(array_description[0], array_description[1], array_description[2], 
                                array_total[0], array_total[1], array_total[2], indice);
                                
                            mostrar="";
                            indice++; 
                        });
                    }
                    
                },
                error:function (xhr, ajaxOptions, thrownError){
                    console.log(xhr.status);
                    console.log(xhr.statusText);
                    console.log(xhr.responseText);
                    hideLoading(); 
                    mostrarModalGeneral(MSG_CONNECTION_FAILURE());
                }                  
            });
            
    //}   
}

function downloadGoalLoad(regionCode){    
    
    var query = "SELECT "+KEY_URLBASE+" FROM "+TABLE_URL+" WHERE "+KEY_USE+" = 1;";
    console.log(" "+query);

    if(regionCode=="R-1"){
        regionCode="";
    }
    
        localDB.transaction(function(transaction){        
            transaction.executeSql(query, [], function(transaction, results){            
                var url_ = results.rows.item(0).urlBase;
                
                var xurl = url_+'/reportgoal/post';
                console.log("url downloadGoalLoad "+xurl);
                var array = {option: 1, regionCode: regionCode};
                console.log("array : optionCode"+1+" - regionCode: "+regionCode);

                $.ajax({
                url: xurl,
                type: 'POST',
                data: JSON.stringify(array),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                async: true,
                crossdomain: true,
                beforeSend: function(){
                    showLoading(); 
                },        
                complete: function(){
                    hideLoading(); 
                },
                success: function(data, textStatus, XMLHttpRequest){
                    
                    $("#items").empty();
                    $('.modal-backdrop').remove();  
                    if(data.quantity>0){                            
                        var mostrar = "";
                        var indice = 0;   
                            
                        $(data.report).each(function(index, value){
                            var goalAmount = value.goalAmount;
                            var goalAmountGlobal = value.goalAmountGlobal;
                            var payTotal = value.payTotal;
                            var payTotalGlobal = value.payTotalGlobal;  
                            var storeName = value.storeName;
                            var color = "";
                            var colorGlobal = "";
                            var percent = (payTotal * 100)/goalAmount;
                            var percentGlobal = (payTotalGlobal * 100)/goalAmountGlobal;

                            if(payTotal=="0.00000" || goalAmount=="0.00000"){
                                percent = "0.00";
                            }

                            if(payTotalGlobal=="0.00000" || goalAmountGlobal=="0.00000"){
                                percentGlobal = "0.00";
                            }

                            if(percent < 75){
                                color = "percentage red";
                            }

                            if(percent > 74 && percent < 100){
                                color = "percentage ambar";
                            }

                            if(percent > 99){
                                color = "percentage green";
                            }

                            if(goalAmount=="0.00000" && payTotal>"0.00000"){
                                color = "percentage green";
                            }

                            if(percentGlobal < 75){
                                colorGlobal = "percentage red";
                            }

                            if(percentGlobal > 74 && percentGlobal < 100){
                                colorGlobal = "percentage ambar";
                            }

                            if(percentGlobal > 99){
                                colorGlobal = "percentage green";
                            }

                            if(goalAmountGlobal=="0.00000" && payTotalGlobal>"0.00000"){
                                colorGlobal = "percentage green";
                            }

                            percent = parseFloat(percent).toFixed();
                            percentGlobal = parseFloat(percentGlobal).toFixed();

                            mostrar += "<ul class='col-xs-12' onclick=\"prueba('-"+indice+"')\">";

                                mostrar += "<li>";

                                    mostrar += "<h1 class='store-name'>"+storeName+"</h1>";

                                    mostrar += "<div class='actual'>";

                                        mostrar += "<p class='type'>A:</p>";
                                        mostrar += "<p class='gol-number'>"+parseFloat(goalAmount).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")+"</p>";
                                        mostrar += "<p class='sale-number'>"+parseFloat(payTotal).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")+"</p>";
                                        mostrar += "<p class='"+color+"'>"+percent+" %</p>";

                                    mostrar += "</div>";

                                    mostrar += "<div class='global'>";

                                        mostrar += "<p class='type'>G:</p>";
                                        mostrar += "<p class='gol-number'>"+parseFloat(goalAmountGlobal).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")+"</p>";
                                        mostrar += "<p class='sale-number'>"+parseFloat(payTotalGlobal).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")+"</p>";
                                        mostrar += "<p class='"+colorGlobal+"'>"+percentGlobal+" %</p>";

                                    mostrar += "</div>";
                                
                            var j = 0;
                            var array_description = [];
                            var array_total = [];

                            $(value.info).each(function(index, value){
                                var info = value.info;
                                var total = value.total; 

                                array_description[j] = info;
                                array_total[j] = total;

                                j++;   
                            });  

                                    
                                    mostrar += "<div id='chartdiv-"+indice+"' class='chartdiv-"+indice+"'></div>";

                                    mostrar += "<div class='detalle-"+indice+"'>";

                                        mostrar += "<div class='year'>Año</div><div class='quantity'>Cantidad</div>";
                                        mostrar += "<span>"+array_description[0]+"</span><span>"+parseFloat(array_total[0]).toFixed()+"</span>";
                                        mostrar += "<span>"+array_description[1]+"</span><span>"+parseFloat(array_total[1]).toFixed()+"</span>";
                                        mostrar += "<span>"+array_description[2]+"</span><span>"+parseFloat(array_total[2]).toFixed()+"</span>";

                                    mostrar += "</div>";
                                    
                                mostrar += "</li>";

                            mostrar += "</ul>"; 
                                

                            $("#items").append(mostrar); 
                                
                            drawGraphic(array_description[0], array_description[1], array_description[2], 
                                array_total[0], array_total[1], array_total[2], indice);
                                
                            mostrar="";
                            indice++; 
                        });
                    }else{
                        console.log("No existe data");
                    }
                    
                },
                error:function (xhr, ajaxOptions, thrownError){
                    console.log(xhr.status);
                    console.log(xhr.statusText);
                    console.log(xhr.responseText);
                    hideLoading(); 
                    mostrarModalGeneral(MSG_CONNECTION_FAILURE());
                }                  
                });

            },function(transaction, error){
                console.log("Error: " + error.code + "<br>Mensage: " + error.message);
            });
        });
}

function downloadGoalReload(regionCode){    
    
    var query = "SELECT "+KEY_URLBASE+" FROM "+TABLE_URL+" WHERE "+KEY_USE+" = 1;";
    console.log(" "+query);
    
    var regionCode = $("ul.select-region li:first-child()").attr("data-value");
    console.log("region seleccionada downloadGoalReload"+regionCode);

    var optionCode = $("ul.select-date li:first-child()").attr("data-value");
    console.log("option seleccionada downloadGoalReload"+optionCode);

    if(regionCode=="R-1"){
        regionCode="";
    }
    
        localDB.transaction(function(transaction){        
            transaction.executeSql(query, [], function(transaction, results){            
                var url_ = results.rows.item(0).urlBase;
                
                var xurl = url_+'/reportgoal/post';
                console.log("url downloadGoalLoad "+xurl);
                var array = {option: 1, regionCode: regionCode};
                console.log("array : optionCode"+1+" - regionCode: "+regionCode);

                $.ajax({
                url: xurl,
                type: 'POST',
                data: JSON.stringify(array),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                async: true,
                crossdomain: true,
                beforeSend: function(){
                    showLoading(); 
                },        
                complete: function(){
                    hideLoading(); 
                },
                success: function(data, textStatus, XMLHttpRequest){
                    
                    $("#items").empty();
                    $('.modal-backdrop').remove();  
                    if(data.quantity>0){                            
                        var mostrar = "";
                        var indice = 0;   
                            
                        $(data.report).each(function(index, value){
                            var goalAmount = value.goalAmount;
                            var goalAmountGlobal = value.goalAmountGlobal;
                            var payTotal = value.payTotal;
                            var payTotalGlobal = value.payTotalGlobal;  
                            var storeName = value.storeName;
                            var color = "";
                            var colorGlobal = "";
                            var percent = (payTotal * 100)/goalAmount;
                            var percentGlobal = (payTotalGlobal * 100)/goalAmountGlobal;

                            if(payTotal=="0.00000" || goalAmount=="0.00000"){
                                percent = "0.00";
                            }

                            if(payTotalGlobal=="0.00000" || goalAmountGlobal=="0.00000"){
                                percentGlobal = "0.00";
                            }

                            if(percent < 75){
                                color = "percentage red";
                            }

                            if(percent > 74 && percent < 100){
                                color = "percentage ambar";
                            }

                            if(percent > 99){
                                color = "percentage green";
                            }

                            if(goalAmount=="0.00000" && payTotal>"0.00000"){
                                color = "percentage green";
                            }

                            if(percentGlobal < 75){
                                colorGlobal = "percentage red";
                            }

                            if(percentGlobal > 74 && percentGlobal < 100){
                                colorGlobal = "percentage ambar";
                            }

                            if(percentGlobal > 99){
                                colorGlobal = "percentage green";
                            }

                            if(goalAmountGlobal=="0.00000" && payTotalGlobal>"0.00000"){
                                colorGlobal = "percentage green";
                            }

                            percent = parseFloat(percent).toFixed();
                            percentGlobal = parseFloat(percentGlobal).toFixed();

                            mostrar += "<ul class='col-xs-12' onclick=\"prueba('-"+indice+"')\">";

                                mostrar += "<li>";

                                    mostrar += "<h1 class='store-name'>"+storeName+"</h1>";

                                    mostrar += "<div class='actual'>";

                                        mostrar += "<p class='type'>A:</p>";
                                        mostrar += "<p class='gol-number'>"+parseFloat(goalAmount).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")+"</p>";
                                        mostrar += "<p class='sale-number'>"+parseFloat(payTotal).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")+"</p>";
                                        mostrar += "<p class='"+color+"'>"+percent+" %</p>";

                                    mostrar += "</div>";

                                    mostrar += "<div class='global'>";

                                        mostrar += "<p class='type'>G:</p>";
                                        mostrar += "<p class='gol-number'>"+parseFloat(goalAmountGlobal).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")+"</p>";
                                        mostrar += "<p class='sale-number'>"+parseFloat(payTotalGlobal).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")+"</p>";
                                        mostrar += "<p class='"+colorGlobal+"'>"+percentGlobal+" %</p>";

                                    mostrar += "</div>";
                                
                            var j = 0;
                            var array_description = [];
                            var array_total = [];

                            $(value.info).each(function(index, value){
                                var info = value.info;
                                var total = value.total; 

                                array_description[j] = info;
                                array_total[j] = total;

                                j++;   
                            });  

                                    
                                    mostrar += "<div id='chartdiv-"+indice+"' class='chartdiv-"+indice+"'></div>";

                                    mostrar += "<div class='detalle-"+indice+"'>";

                                        mostrar += "<div class='year'>Año</div><div class='quantity'>Cantidad</div>";
                                        mostrar += "<span>"+array_description[0]+"</span><span>"+parseFloat(array_total[0]).toFixed()+"</span>";
                                        mostrar += "<span>"+array_description[1]+"</span><span>"+parseFloat(array_total[1]).toFixed()+"</span>";
                                        mostrar += "<span>"+array_description[2]+"</span><span>"+parseFloat(array_total[2]).toFixed()+"</span>";

                                    mostrar += "</div>";
                                    
                                mostrar += "</li>";

                            mostrar += "</ul>"; 
                                

                            $("#items").append(mostrar); 
                                
                            drawGraphic(array_description[0], array_description[1], array_description[2], 
                                array_total[0], array_total[1], array_total[2], indice);
                                
                            mostrar="";
                            indice++; 
                        });
                    }else{
                        console.log("No existe data");
                    }
                    
                },
                error:function (xhr, ajaxOptions, thrownError){
                    console.log(xhr.status);
                    console.log(xhr.statusText);
                    console.log(xhr.responseText);
                    hideLoading(); 
                    mostrarModalGeneral(MSG_CONNECTION_FAILURE());
                }                  
                });

            },function(transaction, error){
                console.log("Error: " + error.code + "<br>Mensage: " + error.message);
            });
        });
}

function existsData(){
    
    var url ="";
    var query = "SELECT COUNT("+KEY_URLBASE+") AS urlBase FROM "+ TABLE_URL + " WHERE " + KEY_USE + " = '1';";
    try {
        localDB.transaction(function(transaction){        
            transaction.executeSql(query, [], function(transaction, results){            
                url = results.rows.item(0).urlBase; 
                if(url>0){
                   getConfiguration(url);      
               }                         
            }, function(transaction, error){
                console.log("Error: " + error.code + "<br>Mensage: " + error.message);
            });
        });
    } 
    catch (e) {
        console.log("Error existsData " + e + ".");
    }   
}

function updateState(){

    var query = "UPDATE " + TABLE_URL+" SET "+KEY_USE+" = ?";
    
    try {
            localDB.transaction(function(transaction){
                transaction.executeSql(query, ["0"], function(transaction, results){
                    if (!results.rowsAffected) {
                        console.log("Error updateState");
                    }
                    else {
                        console.log("Update realizado:" + results.rowsAffected);
                    }
                }, errorHandler);
            });
    }catch (e) {
        console.log("Error updateState " + e + ".");
    }
}

function deleteConfiguration(){
    
    var query = "DELETE FROM "+TABLE_CONFIGURATION;
    try {
        localDB.transaction(function(transaction){
        
            transaction.executeSql(query, [], function(transaction, results){
                if (!results.rowsAffected) {
                    console.log("Error delete configuration.");
                }
                else {
                    console.log("Realizado deleteConfiguration");
                }
            }, errorHandler);
        });
    } 
    catch (e) {
        updateStatus("No se realizo deleteConfiguration " + e + ".");
    }
}

function validData(pin, check){
    var xurl ="";
    var query = "SELECT "+KEY_URLBASE+" FROM "+TABLE_URL+" WHERE "+KEY_USE+" = 1;";
    console.log("validData "+pin+" - "+check);
    try {
        localDB.transaction(function(transaction){        
            transaction.executeSql(query, [], function(transaction, results){            
                xurl = results.rows.item(0).urlBase; 

                var yurl = xurl+"/login/session/post";
                var array = {Pin: pin};

                $.ajax({
                url: yurl,
                type: 'POST',
                timeout: 15000,
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
                success: function(data, textStatus, XMLHttpRequest){
                    if(data.successful==1){
                        addConfiguration(check);
                    }else{
                        mostrarModalGeneral(MSG_INVALID_USER());
                    }
                },
                error:function (xhr, ajaxOptions, thrownError){
                    console.log(xhr.status);
                    console.log(xhr.statusText);
                    console.log(xhr.responseText);
                    hideLoading(); 
                    mostrarModalGeneral(MSG_CONNECTION_FAILURE());
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

function addConfiguration(remember){
    console.log("rem "+remember);
    var query = "INSERT INTO "+TABLE_CONFIGURATION +"("+KEY_REMEMBER+") VALUES (?);";
    
    try {
        localDB.transaction(function(transaction){
            transaction.executeSql(query, [remember], function(transaction, results){
                if (!results.rowsAffected) {
                    console.log("Error no se inserto Configuration");
                }else{
                    console.log("Insert realizado, id: " + results.insertId);
                    window.location.href = "stores.html";
                }
            }, errorHandler);
        });
    }catch (e) {
        console.log("Error addConfiguration " + e + ".");
    }
}

function getConfiguration(url){

    var config ="";
    var query = "SELECT COUNT("+KEY_REMEMBER+") AS cantidad FROM "+TABLE_CONFIGURATION;
    try {
        localDB.transaction(function(transaction){        
            transaction.executeSql(query, [], function(transaction, results){            
                config = results.rows.item(0).cantidad;    
                if(config>"0"){
                    window.location = "stores.html";
                }else{
                    window.location = "login.html";
                }  
                
            }, function(transaction, error){
                console.log("Error: " + error.code + "<br>Mensage: " + error.message);
            });
        });
    } 
    catch (e) {
        console.log("Error getConfiguration " + e + ".");
    }
   
   return config;
}

function getDataInUse(){
    
    var query = "SELECT "+KEY_IP+ ","+ KEY_ALIAS+ " FROM "+ TABLE_URL+" WHERE "+KEY_USE+" = '1'";
    try {
        localDB.transaction(function(transaction){        
            transaction.executeSql(query, [], function(transaction, results){            
                var ip = results.rows.item(0).ip;   
                var alias = results.rows.item(0).alias;   

                console.log("ip: "+ip+" - alias: "+alias);

                $("#txtIP").text("IP: "+ip); 
                $("#txtStore").text(alias);      
                
            }, function(transaction, error){
                console.log("Error: " + error.code + "<br>Mensage: " + error.message);
            });
        });
    } 
    catch (e) {
        console.log("Error getDataInUse " + e + ".");
    }  
}

function getAllData(){
    
    var query = "SELECT "+KEY_ID+", "+KEY_URLBASE + "," + KEY_ALIAS+ " FROM "+ TABLE_URL;
    try {
        localDB.transaction(function(transaction){        
            transaction.executeSql(query, [], function(transaction, results){   

                var mostrar = "";
                $("#divlistado").empty(); 

                for (var i = 0; i < results.rows.length; i++) {
                
                    var row = results.rows.item(i);
                    var _id = row['id'];   
                    var _alias = row['alias'];   
                    var _url = row['urlBase'];

                    //<div class="alias-item" id="alias-item">Cambiar de Alias 1 <button type="button" class="delete">×</button></div>

                    mostrar += "<div class='alias-item' id='alias-item'> ";
                    mostrar += "<span data-toggle='modal' data-target='#ModalConfirm' onclick=\"addID("+_id+")\">"+_alias+"</span> ";
                    mostrar += "<button type='button' class='delete' data-toggle='modal' data-target='#ModalConfirmDelete' ";
                    mostrar += "onclick=\"addIDDelete("+_id+")\">×</button></div>";

                }

                $("#divlistado").append(mostrar);  

                
            }, function(transaction, error){
                console.log("Error: " + error.code + "<br>Mensage: " + error.message);
            });
        });
    } 
    catch (e) {
        console.log("Error getAllData " + e + ".");
    }
}

function updateStateURL(id){

    var query = "UPDATE " + TABLE_URL+" SET "+KEY_USE+" = '0'";
    
    try {
            localDB.transaction(function(transaction){
                transaction.executeSql(query, [], function(transaction, results){
                    if (!results.rowsAffected) {
                        console.log("Error updateState");
                    }
                    else {
                        console.log("Update realizado:" + results.rowsAffected);
                    }
                }, errorHandler);
            });
    }catch (e) {
        console.log("Error updateState " + e + ".");
    }

    var query2 = "UPDATE " + TABLE_URL+" SET "+KEY_USE+" = '1' WHERE "+KEY_ID+" = ? ";
    console.log("query2 "+query2);
    
    try {
            localDB.transaction(function(transaction){
                transaction.executeSql(query2, [id], function(transaction, results){
                    if (!results.rowsAffected) {
                        console.log("Error updateState");
                    }
                    else {
                        console.log("Update realizado:" + results.rowsAffected);
                        location.reload();
                    }
                }, errorHandler);
            });
    }catch (e) {
        console.log("Error updateState " + e + ".");
    }
}

function deleteServer(id){

    var query1 = "SELECT "+KEY_USE+ " FROM "+ TABLE_URL+" WHERE "+KEY_ID+" = ?";
    
    try {
            localDB.transaction(function(transaction){
                transaction.executeSql(query1, [id], function(transaction, results){
                    var total = results.rows.item(0).use; 
                    console.log("total "+total);   

                    if(total==1){
                        mostrarModalMessage();
                    }else{
                        var query2 = "DELETE FROM " + TABLE_URL+" WHERE "+KEY_ID+" = ? ";
                        console.log("query2 "+query2);
                        
                        try {
                                localDB.transaction(function(transaction){
                                    transaction.executeSql(query2, [id], function(transaction, results){
                                        if (!results.rowsAffected) {
                                            console.log("Error eliminar servidor");
                                        }
                                        else {
                                            console.log("deleteServer realizado:" + results.rowsAffected);
                                            getDataInUse();  
                                            getAllData();
                                        }
                                    }, errorHandler);
                                });
                        }catch (e) {
                            console.log("Error updateState " + e + ".");
                        }
                    }

                }, errorHandler);
            });
    }catch (e) {
        console.log("Error deleteServer " + e + ".");
    }

    /*
    var query2 = "UPDATE " + TABLE_URL+" SET "+KEY_USE+" = '1' WHERE "+KEY_ID+" = ? ";
    console.log("query2 "+query2);
    
    try {
            localDB.transaction(function(transaction){
                transaction.executeSql(query2, [id], function(transaction, results){
                    if (!results.rowsAffected) {
                        console.log("Error updateState");
                    }
                    else {
                        console.log("Update realizado:" + results.rowsAffected);
                        location.reload();
                    }
                }, errorHandler);
            });
    }catch (e) {
        console.log("Error updateState " + e + ".");
    }
    */
}

function getRegionCode(){
    
    var query1 = "select count(*) as total from region";
    try {
            localDB.transaction(function(transaction){        
                transaction.executeSql(query1, [], function(transaction, results){   

                    var total = results.rows.item(0).total; 
                    console.log("total "+total);   

                    if(total>0){

                        var url ="";
                        var query = "SELECT "+KEY_REGIONCODE+" FROM "+ TABLE_REGION+" WHERE "+KEY_IDURL+" = (SELECT "+KEY_ID+" FROM "+TABLE_URL+" WHERE "+KEY_USE+" = 1) "
                                    + " ORDER BY "+KEY_ID+"  DESC LIMIT 1";
                        console.log("getRegionCode "+query);

                        try {
                            localDB.transaction(function(transaction){        
                                transaction.executeSql(query, [], function(transaction, results){   

                                    url = results.rows.item(0).regionCode; 
                                    console.log("getRegionCode "+url);   
                                    var regionCode = $("ul.select-region li:first-child()").attr("data-value");
                                    console.log("regionCode "+regionCode);   

                                    if(regionCode!=url){
                                        AddRegion(regionCode);
                                    }
                                    downloadGoalLoad(regionCode);
                                }, function(transaction, error){
                                    console.log("Error: " + error.code + "<br>Mensage: " + error.message);
                                });
                            });
                        } 
                        catch (e) {
                            console.log("Error getRegionCode " + e + ".");
                        }

                    }else{
                        var regionCode = $("ul.select-region li:first-child()").attr("data-value");
                        console.log("region seleccionada "+regionCode);
                        AddRegion(regionCode);
                        downloadGoal(); 
                    }


                }, function(transaction, error){
                    console.log("Error: " + error.code + "<br>Mensage: " + error.message);
                });
            });
        } 
        catch (e) {
            console.log("Error total " + e + ".");
        }
}

function loadRegionCode(){
    localDB.transaction(loadRegionCodeConsulta, errorDB);
}

function loadRegionCodeConsulta(tx){
    tx.executeSql("select count(*) as total from region", [], loadRegionCodeSuccess, errorDB);
}

function loadRegionCodeSuccess(tx, results){
    console.log("Recibidos de loadRegionCodeSuccess " + results.rows.length + " registros");
    if(results.rows.length == 0){
        console.log("No se han recibido registros loadRegionCodeSuccess");
    }
    
    //for(var i=0; i<results.rows.length; i++){
        var data = results.rows.item(0);
        var total = data.total;
        console.log("loadRegionCodeSuccess: "+total);

        if(total>0){                        
            loadRegionCode2();
        }else{
            downloadGoal();
        }
}

function loadRegionCode2(){
    localDB.transaction(loadRegionCode2Consulta, errorDB);
}

function loadRegionCode2Consulta(tx){
    tx.executeSql("SELECT "+KEY_REGIONCODE+" FROM "+ TABLE_REGION+" WHERE "+KEY_IDURL+" = (SELECT "+KEY_ID+" FROM "+TABLE_URL+" WHERE "+KEY_USE+" = 1) "
                    + " ORDER BY "+KEY_ID+"  DESC LIMIT 1", [], loadRegionCode2Success, errorDB);
}

function loadRegionCode2Success(tx, results){
    console.log("Recibidos de loadRegionCode2Success " + results.rows.length + " registros");
    if(results.rows.length == 0){
        console.log("No se han recibido registros loadRegionCode2Success");
    }
    
    //for(var i=0; i<results.rows.length; i++){
        var data = results.rows.item(0);
        var url = data.regionCode;

        console.log("loadRegionCode2Success: "+url);

        var allOptions2 = $("ul.select-region").children('li:not(.init)');
        allOptions2.removeClass('selected');
        $("ul.select-region li#"+url).addClass('selected');
        $("ul.select-region").children('.init').html($("ul.select-region li#"+url).html());
        downloadGoalLoad(url);
    //}  
}

function errorDB(err){
    console.log("Error procesando SQL " + err.code);
}

function AddRegion(regionCode){

    var query1 = "SELECT "+KEY_ID+" FROM "+TABLE_URL+" WHERE "+KEY_USE+" = 1";
    try {
        localDB.transaction(function(transaction){        
            transaction.executeSql(query1, [], function(transaction, results){            
                var idUrl = results.rows.item(0).id; 
                console.log("idUrl "+idUrl);
                var query = "INSERT INTO "+TABLE_REGION +"("+KEY_REGIONCODE+", "+KEY_IDURL+") VALUES (?, ?)";
    
                try {
                    localDB.transaction(function(transaction){
                        transaction.executeSql(query, [regionCode, idUrl], function(transaction, results){
                            if (!results.rowsAffected) {
                                console.log("Error no se inserto Region");
                            }else{
                                console.log("Insert realizado, id: " + results.insertId);
                            }
                        }, errorHandler);
                    });
                }catch (e) {
                    console.log("Error AddRegion " + e + ".");
                }
                
            }, function(transaction, error){
                console.log("Error: " + error.code + "<br>Mensage: " + error.message);
            });
        });
    } 
    catch (e) {
        console.log("Error AddRegion " + e + ".");
    }    
}

errorHandler = function(transaction, error){
    console.log("Error: " + error.message);
    return true;
}

nullDataHandler = function(transaction, results){
}

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
            hideLoading(); 
            mostrarModalGeneral(MSG_INVALID_IP());
        }
        /*
        ,
        statusCode: {
            404: function() {
              alert("page not found 404");
              mostrarModalGeneral("MSG_INVALID_IP()");
            },
            0: function() {
              mostrarModalGeneral("MSG_INVALID_IP()");
              alert("page not found 0");
            }
          }
        */
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
                success: function(data, textStatus, XMLHttpRequest){
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
                            hideLoading();                               
                            showCombo();
                    }else{
                        console.log("no entra");
                        hideLoading(); 
                        hideCombo();
                        //downloadGoal();
                    }
                },
                error:function (xhr, ajaxOptions, thrownError){
                    console.log(xhr.status);
                    console.log(xhr.statusText);
                    console.log(xhr.responseText);
                    hideLoading(); 
                    mostrarModalGeneral(MSG_CONNECTION_FAILURE());
                }
            });

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
                success: function(data, textStatus, XMLHttpRequest){
                    if(data.successful==1){
                        addConfiguration(check);
                    }else{
                        mostrarModalGeneral(MSG_INVALID_USER());
                    }
                },
                error:function (xhr, ajaxOptions, thrownError){
                    console.log(xhr.status);
                    console.log(xhr.statusText);
                    console.log(xhr.responseText);
                    hideLoading(); 
                    mostrarModalGeneral(MSG_CONNECTION_FAILURE());
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
        //balloonText: "[[category]]<br><b>[[value]]</b>",
        lineThickness: 2,
        bullet: "round",
        bulletBorderColor: "#f1f1f1",
        bulletBorderThickness: 2,
        bulletBorderAlpha: 1
        //dashLengthField: "dashLength",
        //animationPlayed: false
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