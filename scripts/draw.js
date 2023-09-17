var drawMode = "none";
let currentStyle = 'default';
//change draw mode
function changeMode(mode){
  document.getElementById(drawMode).innerHTML =
    drawMode.charAt(0).toUpperCase()+ drawMode.substring(1);
  drawMode = mode;
  document.getElementById(drawMode).innerHTML = 
  drawMode.charAt(0).toUpperCase()+ drawMode.substring(1)+" ✓";
  //disable buttons when not drawing
  let isDrawing = mode.toLowerCase() != 'none';
  let buttonList = ['redo','undo','reset','resetStart'];
  for(b of buttonList){
    document.getElementById(b).disabled = !isDrawing;
  }
  emptyDrawingLists();
}
//clear all polydrawings on screen
function clearDrawings(){
  bigUndoList.push([]);
  for(let i = 0; i < drawings.length; i++){
    bigUndoList[bigUndoList.length-1].push([]);
    for(let j = 0; j < drawings[i].length; j++){
      bigUndoList[bigUndoList.length-1][i].push(drawings[i][j]);
      map.removeLayer(drawings[i][j]);
    }
  }
  emptyDrawingLists();
  drawings = [];
}
//setInterval(()=>{console.log(drawings.length)},1000);
//undo last drawn polyline, store in undoList
    function undo(){
      if(drawings.length < 1){ return;}
      let l = drawings.length-1;
      undoList.push(drawings[l]);
      for(let i = 0; i < drawings[l].length;i++){
        map.removeLayer(drawings[l][i]);
      }
      console.log(drawings[l].length);
      drawings.pop();
      console.log("undone");
    }
//pulls polydrawings from undoList and displays them
    function redo(){
      if(undoList.length < 1 && bigUndoList.length < 1){ return;}
            //undo list of drawings
      if(bigUndoList.length > 0){
        for(let i = 0; i < bigUndoList[bigUndoList.length-1].length; i++){
          drawings.push([]);
          for(let j = 0; j < bigUndoList[bigUndoList.length-1][i].length; j++){
            let temp = bigUndoList[bigUndoList.length-1][i][j];
            //if(temp.length !=1)
            drawings[drawings.length-1].push(temp);
            map.addLayer(temp);
          }
        }
        bigUndoList.pop();
      }
        //undo singular drawing
      else{
      drawings.push([]);
      for(let i = 0; i < undoList[undoList.length-1].length; i++){
        drawings[drawings.length-1].push(undoList[undoList.length-1][i].addTo(map));
       }
       undoList.pop();
      }
      filterDrawings();
      console.log("redone");
    }
//reset polyline start position
function resetStart(){
      emptyDrawingLists();
    }
//remove empty items from drawings list
function filterDrawings(){
  for(let i = 0; i < drawings.length; i++)
    if(drawings[i].length == 0)
      drawings.splice(i,1);
}
//clear array of lists
function emptyDrawingLists(){
  points = [];
  lines = [];
}
//changing tilemap
function changeMap(style){
  // for(element of document.getElementsByClassName('dropdown-content')){
  //   element.style.display = 'none';
  // }
  map.removeLayer(tilemap);
  if(style == "dark"){
    tilemap = dark;
    currentStyle = style;
  }
  else if(style =="light"){
    tilemap = light;
    currentStyle = style;
  }
  else if(style == "sunny"){
    tilemap = sunny;
    currentStyle = style;
  }
  else if(style == "matrix"){
    tilemap = matrix;
    currentStyle = style;
  }
  else if(style == "highlight"){
    tilemap = highlight;
  }
  else{
    tilemap = def;
    currentStyle = style;
  }
  tilemap.addTo(map);
}