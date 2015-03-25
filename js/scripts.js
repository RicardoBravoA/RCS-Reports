$("ul.select-date").click(function(e) {
    $(this).closest("ul.select-date").children('li:not(.init)').slideToggle(100);
    e.stopPropagation();
});
$("ul.select-region").click(function(e) {
    $('ul.select-region').toggleClass("open");
    $(this).closest("ul.select-region").children('li:not(.init)').slideToggle(50);
    e.stopPropagation();
});

$(document).click(function(e){
    $("ul.select-region").removeClass('open');
    $('ul.select-date li:not(.init)').hide();
    $('ul.select-region li:not(.init)').hide();
});

var allOptions = $("ul.select-date").children('li:not(.init)');
var allOptions2 = $("ul.select-region").children('li:not(.init)');

$("ul.select-date").on("click", "li:not(.init)", function() {
    
    var value = $(this).attr("data-value");
    
    allOptions.removeClass('selected');
    $(this).addClass('selected');
    $("ul.select-date").children('.init').html($(this).html());
    $("ul.select-date").children('.init').attr("data-value",value);    

    downloadGoal();
});

$("ul.select-region").on("click", "li:not(.init)", function() {
    
    var regionCode = $(this).attr("data-value");

    allOptions2.removeClass('selected');
    $(this).addClass('selected');
    $("ul.select-region").children('.init').html($(this).html());
    $("ul.select-region").children('.init').attr("data-value",regionCode);
    getRegionCode();
});

function prueba(detalle){
    var altura = $('#graph'+detalle).height();
    
//    if(altura>0){
//        $('.panel').removeClass("open");
//        $('.back-item').removeClass("mostrar");
//    }else{
//        $('.panel').removeClass("open");
//        $('.back-item').removeClass("mostrar");
//        $('#panel'+detalle).toggleClass("open");
//        $('#detail'+detalle).toggleClass("mostrar");  
//    }     
    if(altura>0){
        $('#graph'+detalle).removeClass("toogleChart");
    }else{
        for(var i=0;i<=9999;i++){
            if("#graph-"+i+"".length){
                $('#graph-'+i).removeClass("toogleChart");
            }else{
                i = 9999;
            }
        }
        
        $('#graph'+detalle).toggleClass('toogleChart');  
    }   
}

function selectAlias(){    
    $('#load').addClass('in').css( "display", "block" ).attr("aria-hidden",false);
    $('body').addClass('modal-open');
    $('body').append('<div class="modal-backdrop fade in"></div>');
    
}

function mostrarModal(){    
    getDataInUse();  
    getAllData();
    $("#show_alias").on("show", function() {   
        $("#show_alias a.btn").on("click", function(e) {
            $("#show_alias").modal('hide');  
        });
    });
    $("#show_alias").on("show", function() {   
        $("#show_alias a.btn").on("click", function(e) {
            $("#show_alias").modal('hide');  
        });
    });

    $("#show_alias").on("hide", function() {    
        $("#show_alias a.btn").off("click");
    });

    $("#show_alias").on("hidden", function() {  // eliminar los elementos reales de la DOM cuando está completamente oculto
        $("#show_alias").remove();
    });

    $("#show_alias").modal({                    // cablear la funcionalidad real modal y mostrar el cuadro de diálogo
      "backdrop"  : "static",
      "keyboard"  : true,
      "show"      : true                     // garantizar el modal se muestra inmediatamente
    });
    
}

function mostrarModalMessage(){    
    $("#ModalMessage").on("show", function() {   
        $("#ModalMessage a.btn").on("click", function(e) {
            $("#ModalMessage").modal('hide');  
        });
    });
    $("#ModalMessage").on("show", function() {   
        $("#ModalMessage a.btn").on("click", function(e) {
            $("#ModalMessage").modal('hide');  
        });
    });

    $("#ModalMessage").on("hide", function() {    
        $("#ModalMessage a.btn").off("click");
    });

    $("#ModalMessage").on("hidden", function() {  // eliminar los elementos reales de la DOM cuando está completamente oculto
        $("#ModalMessage").remove();
    });

    $("#ModalMessage").modal({                    // cablear la funcionalidad real modal y mostrar el cuadro de diálogo
      "backdrop"  : "static",
      "keyboard"  : true,
      "show"      : true                     // garantizar el modal se muestra inmediatamente
    });
    
}

function showLoading(){    
    $("#show_loading").on("show", function() {   
        $("#show_loading a.btn").on("click", function(e) {
            $("#show_loading").modal('hide');  
        });
    });
    $("#show_loading").on("show", function() {   
        $("#show_loading a.btn").on("click", function(e) {
            $("#show_loading").modal('hide');  
        });
    });

    $("#show_loading").on("hide", function() {    
        $("#show_loading a.btn").off("click");
    });

    $("#show_loading").on("hidden", function() {  // eliminar los elementos reales de la DOM cuando está completamente oculto
        $("#show_loading").remove();
    });

    $("#show_loading").modal({                    // cablear la funcionalidad real modal y mostrar el cuadro de diálogo
      "backdrop"  : "static",
      "keyboard"  : true,
      "show"      : true                     // garantizar el modal se muestra inmediatamente
    });

    $("#txtloading").html(MSG_LOADING());
}

function hideLoading(){    
    $("#txtocultaloading").click();
    //$('.modal-backdrop').remove();    
}

function hideCombo(){
    $("#divRegion").hide();
    $('body').addClass('ocultarRegion');
}

function mostrarModalGeneral(contenido){    
    $("#modalgeneral").on("show", function() {   
        $("#modalgeneral a.btn").on("click", function(e) {
            $("#modalgeneral").modal('hide');  
        });
    });
    $("#modalgeneral").on("show", function() {   
        $("#modalgeneral a.btn").on("click", function(e) {
            $("#modalgeneral").modal('hide');  
        });
    });

    $("#modalgeneral").on("hide", function() {    
        $("#modalgeneral a.btn").off("click");
    });

    $("#modalgeneral").on("hidden", function() {  // eliminar los elementos reales de la DOM cuando está completamente oculto
        $("#modalgeneral").remove();
    });

    $("#modalgeneral").modal({                    // cablear la funcionalidad real modal y mostrar el cuadro de diálogo
      "backdrop"  : "static",
      "keyboard"  : true,
      "show"      : true                     // garantizar el modal se muestra inmediatamente
    });

    $("#textgeneral").html(contenido);
    $("#btngeneral").html(MSG_OK());
}

function moveToLeft(){    
    $('body').addClass('clean');
    $('.container').addClass('ocultar');
    $('.preferences').addClass('move');
}

//AQUI
function retornarStores(){        
    $('body').removeClass('clean');
    $('.container').removeClass('ocultar');
    $('.preferences').removeClass('move');
    downloadGoal();    
}

function cambiarTotal(){
    var valor = $('#mostrarTotalDA').is(':checked');   

    if(valor){
        var text = "Sales ↓";
        $('.checkbox_total span').text(text);
        $("#mostrarTotalDA").attr("checked",'');
        updateShowSales(1);
    }else{
        var text = "Sales ↑";
        $('.checkbox_total span').text(text); 
        $("#mostrarTotalDA").removeAttr("checked",'');
        updateShowSales(0);   
    }

    //downloadGoal();

}

function cambiarTotalNoLoad(){
    var valor = $('#mostrarTotalDA').is(':checked');   

    if(valor){
        var text = "Sales ↓";
        $('.checkbox_total span').text(text);
        $("#mostrarTotalDA").attr("checked",'');
    }else{
        var text = "Sales ↑";
        $('.checkbox_total span').text(text);  
        $("#mostrarTotalDA").removeAttr("checked",'');
    }
}

function cambiarMetas(){
    var valor2 = $('#mostrarMetasDA').is(':checked');
    
    if(valor2){
        var text2 = "Goals ↓";
        $('.checkbox_metas span').text(text2);
        $("#mostrarMetasDA").attr("checked",'');
        updateShowGoal(1);
    }else{
        var text2 = "Goals ↑";
        $('.checkbox_metas span').text(text2); 
        $("#mostrarMetasDA").removeAttr("checked",'');
        updateShowGoal(0);      
    }

    //downloadGoal();
}

function cambiarMetasNoLoad(){
    var valor2 = $('#mostrarMetasDA').is(':checked');
    
    if(valor2){
        var text2 = "Goals ↓";
        $('.checkbox_metas span').text(text2);
        $("#mostrarMetasDA").attr("checked",'');
    }else{
        var text2 = "Goals ↑";
        $('.checkbox_metas span').text(text2);  
        $("#mostrarMetasDA").removeAttr("checked",'');
    }
}