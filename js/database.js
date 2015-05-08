var localDB = 'RCS';

var TABLE_URL = "URLSTORE";
var TABLE_CONFIGURATION = "CONFIGURATION";
var TABLE_PREFERENCES = "PREFERENCES";
var TABLE_REGION = "REGION";
var KEY_ID = "id";
var KEY_IP = "ip";
var KEY_PORT = "port";
var KEY_URLBASE= "urlBase";
var KEY_ALIAS = "alias";
var KEY_USE="use";
var KEY_SITE="site";
var KEY_REMEMBER="site";
var KEY_ACTUAL="actual";
var KEY_GLOBAL="global";
var KEY_TOTAL="total";
var KEY_GOALS="sales";
var KEY_REGIONCODE="regionCode";
var KEY_IDURL="idUrl";

function onInit(){ //funcion para inicializar su base de datos
    try {
        if (!window.openDatabase) {
            console.log("No soporta BD");
        }
        else {
            initDB();//abre la la base de datos
            createTables();//y creamos nuestras tablas
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

function initDB(){ // definimos las variables para abrir la base de datos
    var shortName = 'RCS';
    var version = '2.0';
    var displayName = 'RCS Reports';
    var maxSize = 10240; // Em bytes
    localDB = window.openDatabase(shortName, version, displayName, maxSize);
}

function createTables(){//creo mis 4 tablas

    var tableURL = "CREATE TABLE " + TABLE_URL + " ( "
                + KEY_ID + " INTEGER PRIMARY KEY, " + KEY_IP + " TEXT, " + KEY_PORT + " TEXT, " +KEY_URLBASE + " TEXT, "
                + KEY_ALIAS + " TEXT, "  + KEY_USE + " TEXT, "+KEY_SITE+" TEXT ) ";
        
    var tableConfiguration = "CREATE TABLE "+TABLE_CONFIGURATION+" ("+KEY_REMEMBER+" TEXT)"; 

    var tablePreferences = "CREATE TABLE "+TABLE_PREFERENCES+" ("+KEY_ACTUAL+" TEXT, "+KEY_GLOBAL+" TEXT, "
                +KEY_TOTAL+" TEXT, "+KEY_GOALS+" TEXT)";      
        
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

    try {
            localDB.transaction(function(transaction){
            transaction.executeSql(tablePreferences, [], nullDataHandler, errorHandler);
            console.log("Tabla TABLE_PREFERENCES status: OK.");
        });
    } 
    catch (e) {
        console.log("Error creando Tabla PREFERENCES " + e + ".");
        return;
    }

    addPreferences();
}

function addData(ip, port, url, alias, use, site){//aqui se hace uin insert
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

function addPreferences(){
    
    var query1 = "select count(*) as total from "+TABLE_PREFERENCES;
    try {
            localDB.transaction(function(transaction){        
                transaction.executeSql(query1, [], function(transaction, results){   

                    var total = results.rows.item(0).total; 
                    console.log("total "+total);   

                    if(total==0){

                        var query = "INSERT INTO "+TABLE_PREFERENCES + " ( " + KEY_ACTUAL + " , " + KEY_GLOBAL 
                                    + " , " + KEY_TOTAL + ", " + KEY_GOALS +") VALUES (1.0, 0.0, 1.0, 0.0);";
                        try {
                            localDB.transaction(function(transaction){
                                transaction.executeSql(query, [], function(transaction, results){
                                    if (!results.rowsAffected) {
                                        console.log("Error no se inserto addPreferences");
                                    }else{
                                        console.log("Insert realizado, id: " + results.insertId);
                                    }
                                }, errorHandler);
                            });
                        }catch (e) {
                            console.log("Error addPreferences " + e + ".");
                        }

                    }else{
                        console.log("Ya se inserto addPreferences");
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

    var actual = "";
    var global = "";
    var _sales = "";
    var _goal = "";

    if($('#check_actual').is(':checked')){
        actual = 1;
    }else{
        actual = 0;
    }

    if($('#check_global').is(':checked')){
        global = 1;
    }else{
        global = 0;
    }

    if($('#check_sales').is(':checked')){
        _sales = 1;
    }else{
        _sales = 0;
    }

    if($('#check_goals').is(':checked')){
        _goal = 1;
    }else{
        _goal = 0;
    }
    
    //for(var i=0; i<results.rows.length; i++){
        var data = results.rows.item(0);
        var url_ = data.urlBase;                
        var xurl = url_+'/reportgoal/post';
        console.log("url downloadGoal "+xurl);
        var array = {option: optionCode, regionCode: regionCode, goal: _goal, total: _sales};
        console.log("array : optionCode"+optionCode+" - regionCode1: "+regionCode+" - goal: "+_goal+" - total: "+_sales);


        console.log("downloadGoalSuccess: "+url_);

            $.ajax({
                    url: xurl,
                    type: 'POST',
                    data: JSON.stringify(array),
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    async: true,
                    crossdomain: true,
                    beforeSend: function() { //alert("before");
                        showLoading(); 
                    },        
                    complete: function() { //alert("cmplete");
                        
                    },            
                    success: function(data){
                        $("#items").empty();
                        $('.modal-backdrop').remove();  

                        if(data.quantity>0){                            
                            var mostrar = "";
                            var indice = 0;   
                            
                            $(data.report).each(function(index, value){

                                value.goalAmount = value.goalAmount.replace(",",".");    
                                value.goalAmountGlobal = value.goalAmountGlobal.replace(",",".");  
                                value.payTotal = value.payTotal.replace(",",".");  
                                value.payTotalGlobal = value.payTotalGlobal.replace(",",".");  

                                var goalAmount = value.goalAmount;
                                var goalAmountGlobal = value.goalAmountGlobal;
                                var payTotal = value.payTotal;
                                var payTotalGlobal = value.payTotalGlobal;  
                                var storeName = value.storeName;
                                var color = "";
                                var colorGlobal = "";
                                var percent = (payTotal * 100)/goalAmount;
                                
                                var percentGlobal = (payTotalGlobal * 100)/goalAmountGlobal;

                                goalAmount = goalAmount.replace(",",".");
                                goalAmountGlobal = goalAmountGlobal.replace(",",".");
                                payTotal = payTotal.replace(",",".");
                                payTotalGlobal = payTotalGlobal.replace(",",".");


                                if(payTotal=="0.00000" || goalAmount=="0.00000"){
                                    percent = "0.00";
                                }

                               

                                if(payTotalGlobal=="0.00000" || goalAmountGlobal=="0.00000"){
                                    percentGlobal = "0.00";
                                }

                                if(percent < 75.00){
                                    color = " red";
                                }

                                if(percent > 74.00 && percent < 100.00){
                                    color = " ambar";
                                }

                                if(percent > 99.00){
                                    color = " green";
                                }

                                if(goalAmount=="0.00000" && payTotal>"0.00000"){
                                    color = " green";
                                }

                                if(percentGlobal < 75){
                                    colorGlobal = " red";
                                }

                                if(percentGlobal > 74 && percentGlobal < 100){
                                    colorGlobal = " ambar";
                                }

                                if(percentGlobal > 99){
                                    colorGlobal = " green";
                                }

                                if(goalAmountGlobal=="0.00000" && payTotalGlobal>"0.00000"){
                                    colorGlobal = " green";
                                }

                                percent = parseFloat(percent).toFixed();
                                percentGlobal = parseFloat(percentGlobal).toFixed();

                                mostrar += "<ul class='col-xs-12' onclick=\"prueba('-"+indice+"')\">";

                                    mostrar += "<li>";

                                        mostrar += "<h1 class='store-name'>"+storeName+"</h1>";

                                        if(actual==1){ //

                                        mostrar += "<div class='actual'>";

                                            mostrar += "<p class='type'>A:</p>";
                                            mostrar += "<p class='gol-number'>"+parseFloat(goalAmount).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")+"</p>";
                                            mostrar += "<p class='sale-number'>"+parseFloat(payTotal).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")+"</p>";
                                            mostrar += "<p class=' percentage "+color+"'> "+percent+" %</p>";

                                        mostrar += "</div>";

                                        }

                                        if(global==1){

                                        mostrar += "<div class='global'>";

                                            mostrar += "<p class='type'>G:</p>";
                                            mostrar += "<p class='gol-number'>"+parseFloat(goalAmountGlobal).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")+"</p>";
                                            mostrar += "<p class='sale-number'>"+parseFloat(payTotalGlobal).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")+"</p>";
                                            mostrar += "<p class='percentage "+colorGlobal+"'>"+percentGlobal+" %</p>";

                                        mostrar += "</div>";

                                        }
                                
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

                                    
                                    mostrar += "<div id='graph-"+indice+"' class='graphic-"+indice+"'><div id='chartdiv-"+indice+"' class='chartdiv-"+indice+"'></div>";

                                        mostrar += "<div class='detalle-"+indice+"'>";

                                            mostrar += "<div class='year'>Año</div><div class='quantity'>Cantidad</div>";
                                            mostrar += "<span>"+array_description[0]+"</span><span>"+parseFloat(array_total[0]).toFixed()+"</span>";
                                            mostrar += "<span>"+array_description[1]+"</span><span>"+parseFloat(array_total[1]).toFixed()+"</span>";
                                            mostrar += "<span>"+array_description[2]+"</span><span>"+parseFloat(array_total[2]).toFixed()+"</span>";

                                        mostrar += "</div></div>";
                                    
                                    mostrar += "</li>";

                                mostrar += "</ul>"; 
                                

                                $("#items").append(mostrar); 
                                
                                drawGraphic(array_description[0], array_description[1], array_description[2], 
                                    array_total[0], array_total[1], array_total[2], indice);
                                
                                mostrar="";
                                indice++; 
                              });
                        }
                        hideLoading(); 
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

    var actual = "";
    var global = "";
    var _sales = "";
    var _goal = "";

    if($('#check_actual').is(':checked')){
        actual = 1;
    }else{
        actual = 0;
    }

    if($('#check_global').is(':checked')){
        global = 1;
    }else{
        global = 0;
    }

    if($('#check_sales').is(':checked')){
        _sales = 1;
    }else{
        _sales = 0;
    }

    if($('#check_goals').is(':checked')){
        _goal = 1;
    }else{
        _goal = 0;
    }

    try {
        localDB.transaction(function(transaction){        
            transaction.executeSql(query, [], function(transaction, results){            
                var url_ = results.rows.item(0).urlBase;
                
                var xurl = url_+'/reportgoal/post';
                console.log("url downloadGoalLoad "+xurl);

                var array = {option: 1, regionCode: regionCode, goal: _goal, total: _sales};
                console.log("array : optionCode"+1+" - regionCode1: "+regionCode+" - goal: "+_goal+" - total: "+_sales);

                $.ajax({
                    url: xurl,
                    type: 'POST',
                    data: JSON.stringify(array),
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    async: true,
                    crossdomain: true,
                    beforeSend: function() { //alert("before");
                        showLoading(); 
                    },        
                    complete: function() { //alert("cmplete");
                        
                    },                   
                    success: function(data){
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

                                        if(actual==1){

                                        mostrar += "<div class='actual'>";

                                            mostrar += "<p class='type'>A:</p>";
                                            mostrar += "<p class='gol-number'>"+parseFloat(goalAmount).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")+"</p>";
                                            mostrar += "<p class='sale-number'>"+parseFloat(payTotal).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")+"</p>";
                                            mostrar += "<p class='"+color+"'>"+percent+" %</p>";

                                        mostrar += "</div>";

                                        }

                                        if(global==1){

                                        mostrar += "<div class='global'>";

                                            mostrar += "<p class='type'>G:</p>";
                                            mostrar += "<p class='gol-number'>"+parseFloat(goalAmountGlobal).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")+"</p>";
                                            mostrar += "<p class='sale-number'>"+parseFloat(payTotalGlobal).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")+"</p>";
                                            mostrar += "<p class='"+colorGlobal+"'>"+percentGlobal+" %</p>";

                                        mostrar += "</div>";

                                        }
                                
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

                                    
                                    mostrar += "<div id='graph-"+indice+"' class='graphic-"+indice+"'><div id='chartdiv-"+indice+"' class='chartdiv-"+indice+"'></div>";

                                        mostrar += "<div class='detalle-"+indice+"'>";

                                            mostrar += "<div class='year'>Año</div><div class='quantity'>Cantidad</div>";
                                            mostrar += "<span>"+array_description[0]+"</span><span>"+parseFloat(array_total[0]).toFixed()+"</span>";
                                            mostrar += "<span>"+array_description[1]+"</span><span>"+parseFloat(array_total[1]).toFixed()+"</span>";
                                            mostrar += "<span>"+array_description[2]+"</span><span>"+parseFloat(array_total[2]).toFixed()+"</span>";

                                        mostrar += "</div></div>";
                                    
                                    mostrar += "</li>";

                                mostrar += "</ul>"; 
                                

                                $("#items").append(mostrar); 
                                
                                drawGraphic(array_description[0], array_description[1], array_description[2], 
                                    array_total[0], array_total[1], array_total[2], indice);
                                
                                mostrar="";
                                indice++; 
                              });
                        }
                        hideLoading(); 
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

function existsData(){/*contamos la cantidad de URL que tenemos solo donde USE(uso ) sea igual a 1 el uso significa que se esta usando*/
    
    var url ="";
    var query = "SELECT COUNT("+KEY_URLBASE+") AS urlBase FROM "+ TABLE_URL + " WHERE " + KEY_USE + " = '1';";

    console.log("query..." + query);
    try {
        localDB.transaction(function(transaction){        
            transaction.executeSql(query, [], function(transaction, results){            
                url = results.rows.item(0).urlBase;/*el query devuelve un campo (posicion 0) y me devuelve un entero + si hay datos y 0 si no hay*/
                
                console.log("url..." + url);
                if(url>0){/*si hay url con use = 1*/
                   getConfiguration(url); /*virifica a que pantalla dirigirse al login o a store*/   
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


function getConfiguration(url){/*cuenta si la pagina ha sido recordada anteriormente y decide a donde pasar lo mas defrente a login */

    var config ="";
    var query = "SELECT COUNT("+KEY_REMEMBER+") AS cantidad FROM "+TABLE_CONFIGURATION;
    try {
        localDB.transaction(function(transaction){        
            transaction.executeSql(query, [], function(transaction, results){            
                config = results.rows.item(0).cantidad;    
                if(config>"0"){/*si por ejemplo minimizamos y volvimos a abrir se quedo en stores.hmtl*/
                    window.location = "stores.html";
                }else{/*si no se ha recordado pues pasa al login*/
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

function updateCheckActual(variable){

    var query = "UPDATE " + TABLE_PREFERENCES+" SET "+KEY_ACTUAL+" = ?";
    
    try {
        localDB.transaction(function(transaction){
            transaction.executeSql(query, [variable], function(transaction, results){
                if (!results.rowsAffected) {
                    console.log("Error updateCheckActual");
                }
                else{
                    console.log("updateCheckActual realizado:" + results.rowsAffected);
                    //$("#actual").val(variable);
                    //downloadGoal();
                }
            }, errorHandler);
        });
    }catch (e) {
        console.log("Error updateCheckActual " + e + ".");
    }
}

function updateCheckGlobal(variable){

    var query = "UPDATE " + TABLE_PREFERENCES+" SET "+KEY_GLOBAL+" = ?";
    
    try {
        localDB.transaction(function(transaction){
            transaction.executeSql(query, [variable], function(transaction, results){
                if (!results.rowsAffected) {
                    console.log("Error updateCheckGlobal");
                }
                else{
                    console.log("updateCheckGlobal realizado:" + results.rowsAffected);
                    //$("#global").val(variable);
                    //downloadGoal();
                }
            }, errorHandler);
        });
    }catch (e) {
        console.log("Error updateCheckGlobal " + e + ".");
    }
}

function updateActual(variable){

    var query = "UPDATE " + TABLE_PREFERENCES+" SET "+KEY_ACTUAL+" = "+variable;
    
    try {
        localDB.transaction(function(transaction){
            transaction.executeSql(query, [], function(transaction, results){
                if (!results.rowsAffected) {
                    console.log("Error updateActual");
                }
                else {
                    console.log("Update realizado:" + results.rowsAffected);
                    //$("#actual").val(variable);
                }
            }, errorHandler);
        });
    }catch (e) {
        console.log("Error updateActual " + e + ".");
    }
}

function updateGlobal(variable){

    var query = "UPDATE " + TABLE_PREFERENCES+" SET "+KEY_GLOBAL+" = "+variable;
    
    try {
        localDB.transaction(function(transaction){
            transaction.executeSql(query, [], function(transaction, results){
                if (!results.rowsAffected) {
                    console.log("Error updateGlobal");
                }
                else {
                    console.log("Update realizado:" + results.rowsAffected);
                    //$("#global").val(variable);
                }
            }, errorHandler);
        });
    }catch (e) {
        console.log("Error updateGlobal " + e + ".");
    }
}

function updateShowSales(variable){

    var query = "UPDATE " + TABLE_PREFERENCES+" SET "+KEY_TOTAL+" = "+variable;
    
    try {
        localDB.transaction(function(transaction){
            transaction.executeSql(query, [], function(transaction, results){
                if (!results.rowsAffected) {
                    console.log("Error updateShowSales");
                }
                else {
                    console.log("updateShowSales realizado:" + results.rowsAffected);
                    //$("#global").val(variable);
                }
            }, errorHandler);
        });
    }catch (e) {
        console.log("Error updateShowSales " + e + ".");
    }
}

function updateShowGoal(variable){

    var query = "UPDATE " + TABLE_PREFERENCES+" SET "+KEY_GOALS+" = "+variable;
    
    try {
        localDB.transaction(function(transaction){
            transaction.executeSql(query, [], function(transaction, results){
                if (!results.rowsAffected) {
                    console.log("Error updateShowGoal");
                }
                else {
                    console.log("updateShowGoal realizado:" + results.rowsAffected);
                    //$("#global").val(variable);
                }
            }, errorHandler);
        });
    }catch (e) {
        console.log("Error updateShowGoal " + e + ".");
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

function validPreferences(){
    
    var query = "SELECT "+KEY_ACTUAL+", "+KEY_GLOBAL + "," + KEY_TOTAL+ ", "+KEY_GOALS+" FROM "+ TABLE_PREFERENCES;

    try {
        localDB.transaction(function(transaction){        
            transaction.executeSql(query, [], function(transaction, results){   

                for (var i = 0; i < results.rows.length; i++) {
                
                    var row = results.rows.item(i);
                    var actual = row['actual'];   
                    var global = row['global'];   
                    var total = row['total'];
                    var sales = row['sales'];
                    var variable = 0;
                    var _actual = "";
                    var _global = "";
                    var _sales = "";
                    var _goal = "";


                    if($('#check_actual').is(':checked')){
                        _actual = 1;
                    }else{
                        _actual = 0;
                    }

                    if($('#check_global').is(':checked')){
                        _global = 1;
                    }else{
                        _global = 0;
                    }

                    if($('#check_sales').is(':checked')){
                        _sales = 1;
                    }else{
                        _sales = 0;
                    }

                    if($('#check_goals').is(':checked')){
                        _goal = 1;
                    }else{
                        _goal = 0;
                    }

                    console.log("actual: "+actual+" - _actual: "+_actual);
                    console.log("global: "+global+" - _global: "+_global);
                    console.log("total: "+total+" - _sales: "+_sales);
                    console.log("sales: "+sales+" - _goal: "+_goal);


                    if(parseInt(actual)!=parseInt(_actual)){
                        variable++;
                    }

                    if(parseInt(global)!=parseInt(_global)){
                        variable++;
                    }

                    if(parseInt(total)!=parseInt(_sales)){
                        variable++;
                    }

                    if(parseInt(sales)!=parseInt(_goal)){
                        variable++;
                    }

                    updateActual(_actual);
                    updateGlobal(_global);
                    updateShowSales(_sales);
                    updateShowGoal(_goal);

                    if(variable>0){
                        downloadGoal();
                    }


                }
                
            }, function(transaction, error){
                console.log("Error: " + error.code + "<br>Mensage: " + error.message);
            });
        });
    } 
    catch (e) {
        console.log("Error getAllData " + e + ".");
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
                                    downloadGoal();
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

function getPreferences(){
    
    var query1 = "SELECT "+KEY_ACTUAL+", "+KEY_GLOBAL+", "+KEY_TOTAL+", "+KEY_GOALS+" FROM "+TABLE_PREFERENCES;

    try {
        localDB.transaction(function(transaction){        
            transaction.executeSql(query1, [], function(transaction, results){   

            var actual = results.rows.item(0).actual;
            var global = results.rows.item(0).global;
            var total = results.rows.item(0).total;
            var sales = results.rows.item(0).sales; 

            if(actual=="1.0" || actual=="1"){
                $("#check_actual").prop("checked", "checked");
            }else{
                $("#check_actual").prop("checked", "");
            }

            if(global=="1.0" || global=="1"){
                $("#check_global").prop("checked", "checked");
            }else{
                $("#check_global").prop("checked", "");
            }

            //alert("total: "+total);
            if(total=="1.0" || total=="1"){
               $("#check_sales").attr("checked",'');
            }

            if(sales=="1.0" || sales=="1"){
                $("#check_goals").attr("checked", '');
            }
            
            cambiarTotal();
            cambiarMetas();
            
            //$("#actual").val(actual);
            //$("#global").val(global);
            //$("#total").val(total);
            //$("#sales").val(sales);
            

            },function(transaction, error){
                console.log("Error getActualPreferences: " + error.code + "<br>Mensage: " + error.message);
            });
        });
    } 
    catch (e) {
        console.log("Error getActualPreferences " + e + ".");
    }

    //return actual;
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
        $("ul.select-region").children('.init').attr("data-value",url);
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

function obtenerVariables(name){/*esta funcion obtiene los valores de las variables que aparecen en la url*/
    var regexS = "[\\?&]"+name+"=([^&#]*)"; /*expresion generica captura de toda la url la parte de la variable ?=variable=1 o quizas &=variable =1*/
    var regex = new RegExp ( regexS );
    var tmpURL = window.location.href;/*te indica la ubicacion actual URL del navegador*/
    console.log("tempURL..." + tmpURL);
    var results = regex.exec( tmpURL );
    console.log("results..." + results);
    //console.log("results..." + results[1]);
    if(results == null){
        return "-1";
    }else{
        return results[1];/*de mi valor capturado que puede ser variable=1 , obtengo 1 si hay conincidencia entre la cadena y la url en este caso  devuelve 1*/
    }
}

function checkNetConnection(){/*metodo simple pero importante true o false si */
    var status = navigator.onLine;/*checkea si el navegador esta online*/
    if(status){
        return true;
    }else{
        return false;
    }
}

function validIP(ip, port, _url, alias, use, site){/*esta funcion es muy importante para no tener problemas de no poder ingresar a datos de servidores*/
    console.log("validando ip");
    var xurl = _url+'/region/';
    console.log("xurl...." + xurl);
    var valor = obtenerVariables('variable');
    console.log("valor...." + valor);
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
                        downloadGoal();
                    }
                },
                error:function (xhr, ajaxOptions, thrownError){
                    mostrarModalGeneral("asasas");
                    console.log(xhr.status);
                    console.log(xhr.statusText);
                    console.log(xhr.responseText);
                    mostrarModalGeneral(MSG_CONNECTION_FAILURE());
                    //hideLoading(); 
                    
                    //alert("sasa");
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