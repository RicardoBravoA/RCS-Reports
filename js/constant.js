
function MSG_CONNECTION_FAILURE(){
	var msg = "";
	var idioma = "";

	if (navigator.appName == 'Netscape' || 'Microsoft Internet Explorer' || 'Opera'){
		idioma = navigator.language;
	}else{
		idioma = navigator.browserLanguage;
	}	

	if (idioma.indexOf('es') > -1){
	  	msg = "Conexión Fallida";
	}else{
		msg = "Connection Failure";
	}
	return msg;
};

function MSG_INSERT_IP(){
	var msg = "";
	var idioma = "";

	if (navigator.appName == 'Netscape' || 'Microsoft Internet Explorer' || 'Opera'){
		idioma = navigator.language;
	}else{
		idioma = navigator.browserLanguage;
	}	

	if (idioma.indexOf('es') > -1){
	  	msg = "Ingrese IP";
	}else{
		msg = "Insert IP";
	}
	return msg;
};

function MSG_INSERT_PORT(){
	var msg = "";
	var idioma = "";

	if (navigator.appName == 'Netscape' || 'Microsoft Internet Explorer' || 'Opera'){
		idioma = navigator.language;
	}else{
		idioma = navigator.browserLanguage;
	}	

	if (idioma.indexOf('es') > -1){
	  	msg = "Ingrese Puerto";
	}else{
		msg = "Insert Port";
	}
	return msg;
};

function MSG_INSERT_SITE(){
	var msg = "";
	var idioma = "";

	if (navigator.appName == 'Netscape' || 'Microsoft Internet Explorer' || 'Opera'){
		idioma = navigator.language;
	}else{
		idioma = navigator.browserLanguage;
	}	

	if (idioma.indexOf('es') > -1){
	  	msg = "Ingrese Sitio";
	}else{
		msg = "Insert Site";
	}
	return msg;
};

function MSG_INSERT_ALIAS(){
	var msg = "";
	var idioma = "";

	if (navigator.appName == 'Netscape' || 'Microsoft Internet Explorer' || 'Opera'){
		idioma = navigator.language;
	}else{
		idioma = navigator.browserLanguage;
	}	

	if (idioma.indexOf('es') > -1){
	  	msg = "Ingrese Alias";
	}else{
		msg = "Insert Alias";
	}
	return msg;
};

function MSG_INSERT_ADDRESS_SERVER(){
	var msg = "";
	var idioma = "";

	if (navigator.appName == 'Netscape' || 'Microsoft Internet Explorer' || 'Opera'){
		idioma = navigator.language;
	}else{
		idioma = navigator.browserLanguage;
	}	

	if (idioma.indexOf('es') > -1){
	  	msg = "Ingrese la dirección IP del Servidor";
	}else{
		msg = "Enter the IP address of the server";
	}

	$("#lblmsg1").html(msg);
};

function MSG_PORT(){
	var msg = "";
	var idioma = "";

	if (navigator.appName == 'Netscape' || 'Microsoft Internet Explorer' || 'Opera'){
		idioma = navigator.language;
	}else{
		idioma = navigator.browserLanguage;
	}	

	if (idioma.indexOf('es') > -1){
	  	msg = "Puerto: ";
	}else{
		msg = "Port: ";
	}
	
	$("#lblmsg2").html(msg);
};

function MSG_ALIAS(){
	var msg = "";
	var idioma = "";

	if (navigator.appName == 'Netscape' || 'Microsoft Internet Explorer' || 'Opera'){
		idioma = navigator.language;
	}else{
		idioma = navigator.browserLanguage;
	}	

	if (idioma.indexOf('es') > -1){
	  	msg = "Alias: ";
	}else{
		msg = "Alias: ";
	}
	
	$("#lblmsg3").html(msg);
};

function MSG_SITE(){
	var msg = "";
	var idioma = "";

	if (navigator.appName == 'Netscape' || 'Microsoft Internet Explorer' || 'Opera'){
		idioma = navigator.language;
	}else{
		idioma = navigator.browserLanguage;
	}	

	if (idioma.indexOf('es') > -1){
	  	msg = "Sitio: ";
	}else{
		msg = "Site: ";
	}
	
	$("#lblmsg4").html(msg);
};

function MSG_SIGN_IN(){
	var msg = "";
	var idioma = "";

	if (navigator.appName == 'Netscape' || 'Microsoft Internet Explorer' || 'Opera'){
		idioma = navigator.language;
	}else{
		idioma = navigator.browserLanguage;
	}	

	if (idioma.indexOf('es') > -1){
	  	msg = "INGRESAR";
	}else{
		msg = "SIGN IN";
	}
	
	$("#btnenter").html(msg);
};

function MSG_INSERT_PIN(){
	var msg = "";
	var idioma = "";

	if (navigator.appName == 'Netscape' || 'Microsoft Internet Explorer' || 'Opera'){
		idioma = navigator.language;
	}else{
		idioma = navigator.browserLanguage;
	}	

	if (idioma.indexOf('es') > -1){
	  	msg = "Ingrese su número Pin";
	}else{
		msg = "Insert Pin Number";
	}
	return msg;
};

function MSG_OK(){
	var msg = "";
	var idioma = "";

	if (navigator.appName == 'Netscape' || 'Microsoft Internet Explorer' || 'Opera'){
		idioma = navigator.language;
	}else{
		idioma = navigator.browserLanguage;
	}	

	if (idioma.indexOf('es') > -1){
	  	msg = "ACEPTAR";
	}else{
		msg = "OK";
	}
	
	return msg;
};

function MSG_LOADING(){
	var msg = "";
	var idioma = "";

	if (navigator.appName == 'Netscape' || 'Microsoft Internet Explorer' || 'Opera'){
		idioma = navigator.language;
	}else{
		idioma = navigator.browserLanguage;
	}	

	if (idioma.indexOf('es') > -1){
	  	msg = "Cargando...";
	}else{
		msg = "Loading...";
	}
	
	return msg;
};

function MSG_NUMBER_PIN(){
	var msg = "";
	var idioma = "";

	if (navigator.appName == 'Netscape' || 'Microsoft Internet Explorer' || 'Opera'){
		idioma = navigator.language;
	}else{
		idioma = navigator.browserLanguage;
	}	

	console.log("idioma "+idioma);

	if (idioma.indexOf('es') > -1){
	  	msg = "Ingrese su número Pin de Empleado";
	}else{
		msg = "Enter your Pin Employee number";
	}
	
	$("#lbllmsg1").html(msg);
};

function MSG_PIN(){
	var msg = "";
	var idioma = "";

	if (navigator.appName == 'Netscape' || 'Microsoft Internet Explorer' || 'Opera'){
		idioma = navigator.language;
	}else{
		idioma = navigator.browserLanguage;
	}	

	if (idioma.indexOf('es') > -1){
	  	msg = "Pin: ";
	}else{
		msg = "Pin: ";
	}
	
	$("#lbllmsg2").html(msg);
};

function BTN_ENTER_LOGIN(){
	$("#btnlogin").val(MSG_OK());
}

function BTN_ENTER_IP(){
	$("#btnenter").val(MSG_OK());
}

