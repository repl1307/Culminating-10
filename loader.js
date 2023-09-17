//geojson data
// loadScript('data/country-by-population-density.js')
// loadScript('data/country-by-life-expectancy.js');
// loadScript('data/country-by-population.js');
//map polygon data
loadScript('mapData/baseMapData.js');
loadScript('mapData/data1946.js');
loadScript('mapData/data1917.js');
loadScript('mapData/data1947.js');
loadScript('mapData/data1949.js');
loadScript('mapData/data1967.js');
loadScript('mapData/data1995.js');
//load script and append to body
function loadScript(src){
  let script = document.createElement('script');
  script.src = src;
  document.body.appendChild(script);
  console.log('Loaded script from '+src);
}