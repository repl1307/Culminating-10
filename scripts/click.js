let sliderContainer = document.getElementById('yearSliderContainer');
let sliderToggle = document.getElementById('minimize');
let sliderHeight = sliderContainer.clientHeight;
let sliderToggled = false;
let decreaseInterval, increaseInterval;
//slider minimize
sliderToggle.addEventListener('click', () => {
  // document.getElementById('map').style.gridRow = '1 /span 19';
  //sliderContainer.style.height = "1em";
  sliderToggle.style.visibility = "visible";
  sliderToggled = !sliderToggled;
  if (sliderToggled) {
    sliderContainer.style.height = "0%";
    //sliderContainer.style.display = 'none';
    for (child of sliderContainer.children) {
      if (child.id != 'minimize')
        child.style.display = 'none';
    }
  } else {
    sliderContainer.style.height = sliderHeight + "px";
    sliderContainer.style.display = 'block';
    for (child of sliderContainer.children) {
      if(child.id != 'yearInputDiv'){
      child.style.display = 'block';
      }
      else{
        child.style.display = 'flex';
      }
    }
  }
  setTimeout(function() {
    map.invalidateSize()
  }, 400);
});
//present button toggle
document.getElementById('present').addEventListener('click', () => {
 present();
});
//yearInput click
document.getElementById('year').addEventListener('click',()=>{
  let yearInput = document.getElementById('year');
  yearInput.select();
  yearInput.setSelectionRange(0, yearInput.value.length);
});
//yearInput input
document.getElementById('year').addEventListener('input', () => {
  let slider = document.getElementById('yearSlider');
  let yearInput = document.getElementById('year');
  let popups = document.getElementsByClassName('popup');
  prevYear = currYear;
  currYear = Number(yearInput.value);
  slider.value = currYear;
  //delete all popups
  while (popups[0]) {
    popups[0].parentNode.removeChild(popups[0]);
  }
});
//year input change
document.getElementById('year').addEventListener('change', () => {
  let yearInput = document.getElementById('year');
  if (yearInput.value < 1916) {
    yearInput.value = 1916;
  } else if (yearInput.value > 2022) {
    yearInput.value = 2022;
  }
  prevYear = currYear;
  currYear = Number(yearInput.value);
});
//minus button click
document.getElementById('minusButton').addEventListener('click', () => {
  let yearInput = document.getElementById('year');
  let slider = document.getElementById('yearSlider');
  let popups = document.getElementsByClassName('popup');
  if (yearInput.value > 1916) {
    yearInput.value--;
    slider.value = yearInput.value;
    prevYear = currYear;
    currYear = Number(slider.value);
    //delete all popups
    while (popups[0]) {
      popups[0].parentNode.removeChild(popups[0]);
    }
  }
});
//plus button click
document.getElementById('plusButton').addEventListener('click', () => {
  let yearInput = document.getElementById('year');
  let slider = document.getElementById('yearSlider');
  let popups = document.getElementsByClassName('popup');
  if (yearInput.value < 2022) {
    yearInput.value++;
    slider.value = yearInput.value;
    prevYear = currYear;
    currYear = Number(slider.value);
    //delete all popups
    while (popups[0]) {
      popups[0].parentNode.removeChild(popups[0]);
    }
  }
});
window.addEventListener('load',dropdownFunc());
function dropdownFunc(){
//tilemap dropdown
if(window.isMobile() || innerWidth < 500){
  document.getElementById("tilemap").addEventListener('click',()=>{
  document.getElementById('tilemapDropdown').classList.toggle('active');
  console.log('tile');
});
//draw dropdown
document.getElementById("drawMode").addEventListener('click',()=>{
  document.getElementById('drawDropdown').classList.toggle('active');
  console.log('draw');
});
  // Close the dropdown menu if  user clicks outside of it
window.onclick = function(e) {
  if (!e.target.matches('.dropbtn')) {
    let dropdowns = document.getElementsByClassName("dropdown-content");
    for (let i = 0; i < dropdowns.length; i++) {
      let openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('active')) {
        openDropdown.classList.remove('active');
      }
    }
  }
}
}
  //not mobile
else{
  for(dropdown of document.getElementsByClassName('dropdown')){
    dropdown.addEventListener('mouseover',function(){
      for(child of this.children){
        if(child.classList.contains('dropdown-content')){
          child.style.display = 'block';
          console.log('hover');
        }
      }
    });
    dropdown.addEventListener('mouseout',function(){
      for(child of this.children){
        if(child.classList.contains('dropdown-content')){
          child.style.display = 'none';
          console.log('mouseout');
        }
      }
    });
  }
}
}
function present(){
   let slider = document.getElementById('yearSlider');
  slider.disabled = !slider.disabled;
  if (document.getElementById('present').checked) {
    let slider = document.getElementById('yearSlider');
    slideshowLoop = setInterval(presentation, 1);
    startSlideShow(); // in script.js
    showLayer(layers[layerIndex].markers);
    showLayer(layers[layerIndex].polygons);
    showLayer([layers[layerIndex].base]);
    setTimeout(() => {
      orderLayers()
    }, 10); //in mapData.js
    lockMap(); // in script.js
  } else {
    exitPresentation();
  }
}

