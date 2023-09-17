//parse collected map data 
//TODO: add map data to presentation as data file
let dataList = [];
let dataDisplayList = [];
setInterval(()=>{
  if(!localStorage.getItem('mapdata')){
    console.log('No data is stored');
  }
},1000);
document.getElementById('resetStart').addEventListener('click',
  ()=>{
    if(localStorage.getItem('mapdata')){
    let blob = new Blob([localStorage.getItem('mapdata')], {
      type: 'text/plain'});
    document.getElementById('download').href = URL.createObjectURL(blob);
    }
    localStorage.clear(); 
    console.log('a');
  });
//display gathered data
function displayData(){
  if(!localStorage.getItem('mapdata')){ return;}
  let data = JSON.parse(
      localStorage.getItem('mapdata')
  );
  //get each polyline,display it and store it in list
  // for(line of data){
  //   dataDisplayList.push(L.polyline(JSON.parse(line), 
  //       {color: 'rgb('+randInt(0,256)+','+randInt(0,256)+','+randInt(0,256)+')'}
  //     ).addTo(map));
        
  // }
//L.polygon(dataList,{color: 'red'}).addTo(map);
}
//random integer, max excluded
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}