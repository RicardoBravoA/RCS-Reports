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

    downloadData();
});

$("ul.select-region").on("click", "li:not(.init)", function() {
    
    var value = $(this).attr("data-value");
    
    allOptions2.removeClass('selected');
    $(this).addClass('selected');
    $("ul.select-region").children('.init').html($(this).html());
    $("ul.select-region").children('.init').attr("data-value",value);
    downloadData();
});

function prueba(detalle){
    var altura = $('#detail'+detalle).height();
    
    if(altura>0){
        $('.panel').removeClass("open");
        $('.back-item').removeClass("mostrar");
    }else{
        $('.panel').removeClass("open");
        $('.back-item').removeClass("mostrar");
        $('#panel'+detalle).toggleClass("open");
        $('#detail'+detalle).toggleClass("mostrar");  
    }   
    
}

$("#show_opt").click(function(e) {
        $().html();        
        alert('probando');
    }
);