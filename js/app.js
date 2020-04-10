
    
    var timeout = 1000;
    var timer;
    var timer2=0;
    var contador=0;
    var contador_reinicio=0;

    var timeout_pro=0; 
    var aux_minutos=0;
    var aux_noterminado=0;
  
    /*Construccion de Banner con Cambio de Color*/
    timer = $.timer(timeout, function() {

          contador = contador + 1;
          
          if(contador % 2 == 0){
            $(".main-titulo").css("color","red");
          }else{
            $(".main-titulo").css("color","yellow");
          } 

    }); 

  $(".btn-reinicio").click(function(){

    if(contador_reinicio==1){
      contador_reinicio=0;
       $(".panel-tablero").show();
        $(".panel-score").css("width","25%");
        $(".time").show();  
    }
   
    i=0;
    score=0;
    mov=0;
    $(".panel-score").css("width","25%");
    $("#score-text").html("0");
    $("#movimientos-text").html("0");
    $(this).html("REINICIAR");
    
    /*Contador Horario*/  
    timer2 = $.timer(timeout, function() {
        funcionando(this);
    }); 
  });


  /*Cronometro*/
    function funcionando(elemento)
    {

      // obteneos la fecha actual
      var minutos=0;
      var segundos=0;
      
      timeout_pro = timeout_pro+1;
      
      if(timeout_pro < 59 && timeout_pro >0){

      if(timeout_pro == 10){
        $("#seg").text("");
      }

      $("#segundo").text(timeout_pro);

      }
      else{
        $("#seg").text("0");
        timeout_pro=0;
        aux_minutos = aux_minutos+1;

        if(aux_minutos == 2){
          $("#minuto").text("");
          /*Logica si se termina los dos minutos*/
          contador_reinicio=1;
          aux_minutos=0;
          timer2.stop = function() {
          }
          $(".panel-tablero" ).hide();
          $(".panel-score").css("width","100%");
          $(".time").hide();  
        }
        $("#minuto").text(aux_minutos);
        $("#segundo").text(timeout_pro);

        aux_noterminado=1;
      }
    }
  

// inicio armando tablero
  var rows=7; 
  var cols = 7; 
  var grid = []; 
  var validFigures=0;
  var score = 0;
  var moves = 0;


  function candy(r,c,obj,src) {
    return {
    r: r, // fila
    c: c,  // columna
    src:src, // imagen
    locked:false, 
    isInCombo:false, 
    o:obj 
    }
  }

  // arreglo con imagenes para cada tipo de caramelo
  var candyType=[];
  candyType[0]="image/1.png";
  candyType[1]="image/2.png";
  candyType[2]="image/3.png";
  candyType[3]="image/4.png";  
            
  // función que devuelve un caramelo aleatorio.
  function pickRandomCandy() {
    var pickInt = Math.floor((Math.random()*4));
    return candyType[pickInt];
  }

  // preparando el tablero
  for (var r = 0; r < rows; r++) {
   grid[r]=[];
   for (var c =0; c< cols; c++) {
      grid[r][c]= new candy(r,c,null,pickRandomCandy());
   }
  }
    
  // Coordenadas iniciales:
  var width = $('.panel-tablero').width();
  var height = $('.panel-tablero').height(); 
  var cellWidth = width / 7;
  var cellHeight = height / 7;
  var marginWidth = cellWidth/7;
  var marginHeight = cellHeight/7;

  // creando imagenes en el tablero
  for (var r = 0; r < rows; r++) {
    for (var c =0; c< cols; c++) {
      var cell = $("<img class='candy' id='candy_"+r+"_"+c+"' r='"+r+"' c='"+c+
        "'ondrop='_onDrop(event)' ondragover='_onDragOverEnabled(event)'src='"+
        grid[r][c].src+"' style='height:"+cellHeight+"px'/>");
      cell.attr("ondragstart","_ondragstart(event)");
      $(".col-"+(c+1)).append(cell);
      grid[r][c].o = cell;
    }
  }

reponer();
reponer();

// el boton iniciar va a llevar a cero estos valores, asi q dsps lo tengo que borrar:
score= 0 ;
moves= 0 ;
 $("#score-text").html("0");
  $("#movimientos-text").html("0");


 // -------------------------------------------------------------------------------------- ETAPA 2

   // cuando se hace click sobre un candy
  function _ondragstart(a)
  {
    a.dataTransfer.setData("text/plain", a.target.id);
   }
   
   // cuando se mueve una gema por encima de otra sin soltarla 
   function _onDragOverEnabled(e)
    {
     e.preventDefault();
    }
           
    
    function _onDrop(e)
    {
      //Validacion Firefox
      var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
      if (isFirefox) {
        e.preventDefault();
      }
 
     // obtener origen del candy
     var src = e.dataTransfer.getData("text");
     var sr = src.split("_")[1];
     var sc = src.split("_")[2];

     // obtener destino del candy
     var dst = e.target.id;
     var dr = dst.split("_")[1];
     var dc = dst.split("_")[2];

     // si la distancia es mayor a 1, no permitir el movimiento y alertar
     var ddx = Math.abs(parseInt(sr)-parseInt(dr));
     var ddy = Math.abs(parseInt(sc)-parseInt(dc));
     if (ddx > 1 || ddy > 1)
     {
       alert("No se puede hacer un movimiento de dos espacios");
       return;
     }
     else{
        // intercambio de gemas
        var tmp = grid[sr][sc].src;
        grid[sr][sc].src = grid[dr][dc].src;
        grid[sr][sc].o.attr("src",grid[sr][sc].src);
        grid[dr][dc].src = tmp;
        grid[dr][dc].o.attr("src",grid[dr][dc].src);

        // sumar un movimiento a mi cantidad
        moves+=1;
        $("#movimientos-text").html(moves);

        //buscar combinaciones
        destruirCombos(); 
        
     }
    
    
}

      // buscar combinaciones horizontales y verticales para destruirlas
      function destruirCombos()
      {    
      
       // busqueda horizontal
    
        for (var r = 0; r < rows; r++)
        {           
        
          var prevCell = null;
          var figureLen = 0;
          var figureStart = null;
          var figureStop = null;
          
          for (var c=0; c< cols; c++)
          {
          
            // saltear candys locked o que estan en combo.    
            if (grid[r][c].locked || grid[r][c].isInCombo)
            {
              figureStart = null;
              figureStop = null;
              prevCell = null;  
              figureLen = 1;
              continue;
            }
            
            // primer objeto del combo
            if (prevCell==null) 
            {
              prevCell = grid[r][c].src;
              figureStart = c;
              figureLen = 1;
              figureStop = null;
              continue;
            }
            else
            {
              // segundo o posterior objeto del combo
              var curCell = grid[r][c].src;
              if (!(prevCell==curCell))
              {
                prevCell = grid[r][c].src;
                figureStart = c;
                figureStop=null;
                figureLen = 1;
                continue;
              }
              else
              {
                // incrementar combo
                figureLen+=1;
                if (figureLen==3)
                {
                  validFigures+=1;
                  score+=10;
                  $("#score-text").html(score);
                  figureStop = c;
                  
                  for (var ci=figureStart;ci<=figureStop;ci++)
                  {
                     
                    grid[r][ci].isInCombo=true;
                    grid[r][ci].src=null;                     
                  }
                  prevCell=null;
                  figureStart = null;
                  figureStop = null;
                  figureLen = 1;
                  continue;
                }
              }
            }
                  
          }
        }
        
       // busqueda vertical
      
      
        for (var c=0; c< cols; c++)
        {              
          var prevCell = null;
          var figureLen = 0;
          var figureStart = null;
          var figureStop = null;
          
          for (var r = 0; r < rows; r++)
          {
            
            if (grid[r][c].locked || grid[r][c].isInCombo)
            {
              figureStart = null;
              figureStop = null;
              prevCell = null;  
              figureLen = 1;
              continue;
            }
            
            if (prevCell==null) 
            {
              prevCell = grid[r][c].src;
              figureStart = r;
              figureLen = 1;
              figureStop = null;
              continue;
            }
            else
            {
              var curCell = grid[r][c].src;
              if (!(prevCell==curCell))
              {
                prevCell = grid[r][c].src;
                figureStart = r;
                figureStop=null;
                figureLen = 1;
                continue;
              }
              else
              {
                figureLen+=1;
                if (figureLen==3)
                {
                  validFigures+=1;
                  score+=10;
                  $("#score-text").html(score);
                  figureStop = r;
                  
                  for (var ci=figureStart;ci<=figureStop;ci++)
                  {
                     
                    grid[ci][c].isInCombo=true;
                    grid[ci][c].src=null;         
                  }
                  prevCell=null;
                  figureStart = null;
                  figureStop = null;
                  figureLen = 1;
                  continue;
                }
              }
            }
                  
          }
        }
        
        
        // destruir combos
        
         var isCombo=false;
         for (var r = 0;r<rows;r++)
          for (var c=0;c<cols;c++)
            if (grid[r][c].isInCombo)
            { 
             
              isCombo=true; 
              // ACÁ FALTA LA ANIMACIÓN NADA MÁS, Y ESTARIA BIEN
               reponer() // aca funciona bien 
            }
            
        if (isCombo)  // Acá no entra nunca, el metodo lo termina llamando al final del reponer
          desaparecerCombos();
        
      }
    
      //desaparecer candys borrados
      function desaparecerCombos()
      {
         for (var r=0;r<rows;r++)  { 
          for (var c=0;c<cols;c++){
            if (grid[r][c].isInCombo)  // celda vacia
            {
              grid[r][c].o.animate({
                opacity:0
              },slow);
            } 
          }   
        }   
      
      }
      
   
      
      function reponer() {
          // mover celdas vacias hacia arriba
         for (var r=0;r<rows;r++)
         {           
          for (var c=0;c<cols;c++)
          {  
            if (grid[r][c].isInCombo)  // celda vacia
            {
              grid[r][c].o.attr("src","");
                // deshabilitar cerlda del combo               
              grid[r][c].isInCombo=false;
               
              for (var sr=r;sr>=0;sr--)
              {
                if (sr==0) break; 
                if (grid[sr-1][c].locked) break;       
                var tmp = grid[sr][c].src;
                grid[sr][c].src=grid[sr-1][c].src;
                grid[sr-1][c].src=tmp;
              }
            } 
          }  
        }   
                          
          // reordenando y reponiendo celdas
          for (var r=0;r<rows;r++)
          { for (var c = 0;c<cols;c++)
            {
              grid[r][c].o.attr("src",grid[r][c].src);
              grid[r][c].o.css("opacity","1"); // acá podria meter animate
              grid[r][c].isInCombo=false;
              if (grid[r][c].src==null) 
                grid[r][c].respawn=true;
              if (grid[r][c].respawn==true)
              {  
                grid[r][c].o.off("ondragover");
                grid[r][c].o.off("ondrop");
                grid[r][c].o.off("ondragstart"); 
                grid[r][c].respawn=false; 
               
                grid[r][c].src=pickRandomCandy();
                grid[r][c].locked=false;
                grid[r][c].o.attr("src",grid[r][c].src);
                grid[r][c].o.attr("ondragstart","_ondragstart(event)");
                grid[r][c].o.attr("ondrop","_onDrop(event)");
                grid[r][c].o.attr("ondragover","_onDragOverEnabled(event)");
              }
            }
          }

          destruirCombos();
         
      }              
