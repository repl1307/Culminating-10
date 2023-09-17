let popupCount = 0;

if(!localStorage.getItem('firstVisit')){
  localStorage.setItem('firstVisit','true');
}
else{
    localStorage.setItem('firstVisit','true');
}
//page tutorial
function tutorial(){
  if(localStorage.getItem('firstVisit') == 'true'){
    localStorage.setItem('firstVisit', 'false');
  }
  else{
    return;
  }
  //disable page
  var disableDiv = document.createElement('div');
  disableDiv.id = 'tutorialDiv';
  disableDiv.style = `
    position: absolute;
    margin: 0; padding: 0;
    top: 0; left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 5000;
  `;
  document.body.appendChild(disableDiv);
  //elements in tutorial
  const buttons = {
    present: document.getElementById('presentDiv'),
    highlightCountries: document.getElementById('storeDrawingDiv'),
    drawMode: document.getElementById('drawingDropdown'),
    slider: document.getElementById('yearSlider'),
    themes: document.getElementById('themeDropdown'),
    reset: document.getElementById('resetWrapper'),
    undo: document.getElementById('undoWrapper'),
    redo: document.getElementById('redoWrapper'),
    resetStart: document.getElementById('resetStartWrapper'),
  };
  //popups for each element
  const popups = {};
  const welcomeDiv = document.createElement('div');
  welcomeDiv.style = `
    position: absolute;
    padding: 5px;
    margin: 0;
    top: 50%;
    left: 50%;
    z-index: 10000;
  `;
  document.body.appendChild(welcomeDiv);
  popups.welcome = tippy(welcomeDiv, {
    content: '<div style="text-align: center; font-size: 1rem;">Welcome! Before you can access the site, a brief introduction will be provided. This is a webmap that shows a timeline of the Palestinian-Israeli Conflict. </div>',
    showOnCreate: true,
    delay: 1000,
    trigger: 'manual',
    arrow: false,
    allowHTML: true,
    hideOnClick: false,
  });
  popups.welcome.show();
  popups.themes = tippy(buttons.themes ,{
    content: 'This is the themes dropdown. The map\'s theme can be changed here. ',
    delay: 1000,
    trigger: 'manual',
    hideOnClick: false,
  });
  popups.drawMode = tippy(buttons.drawMode, {
    content: 'This is the drawing options dropdown. There are two drawing modes: pen, and line. Pen Mode doesn\'t work on mobile.',
    delay: 1000,
    trigger: 'manual',
    hideOnClick: false,
  });
  popups.reset = tippy(buttons.reset, {
    content: 'This is the clear button. Any drawings made on the map will be cleared.',
    delay: 1000,
    trigger: 'manual',
    hideOnClick: false,
  });
  popups.undo = tippy(buttons.undo, {
    content: 'This is the undo button. The last drawing related action on the map will be undone. This includes clearing the map.',
    delay: 1000,
    trigger: 'manual',
    hideOnClick: false,
  });
  popups.redo = tippy(buttons.redo, {
    content: 'This is the redo button. The last drawing related action on the map will be redone.',
    delay: 1000,
    trigger: 'manual',
    hideOnClick: false,
  });
  popups.resetStart = tippy(buttons.resetStart, {
    content: 'This is the reset points button. The starting point for Line Mode will be set to the mouse position. Also, any lines on the map will be saved as JSON data. This is useful if you wish to create your own map polygon data. The download link will be at the the top of the webpage.',
    delay: 1000,
    trigger: 'manual',
    hideOnClick: false,
  });
  popups.highlightCountries = tippy(buttons.highlightCountries, {
    content: 'This is the highlight countries checkbox. If checked, the countries bordering Palestine will be displayed as colorful polygons.',
    delay: 1000,
    trigger: 'manual',
    hideOnClick: false,
  });
  popups.present = tippy(buttons.present, {
    content: 'This is the present checkbox. If checked, an interactive timeline of the Israeli-Palestinian conflict will be displayed. If not checked, the map functions as a regular webmap.',
    delay: 1000,
    trigger: 'manual',
    hideOnClick: false,
  });
  popups.slider = tippy(buttons.slider, {
    content: 'This is the timeline slider. It can be dragged, or a specific year can be typed in by selecting the year #. The buttons on the left and right of the year change the year value by one. This slider is only useful in Present Mode.',
    delay: 1000,
    trigger: 'manual',
    hideOnClick: false,
  });
  //update popupCount on click
  document.addEventListener('click', e => popupCount++);
  //tutorial loop
  const tutorialLoop = setInterval(()=>{
    switch(popupCount){
      case 1:
        if(popups.welcome){
          popups.welcome.destroy();
          delete popups.welcome;
          popups.themes.show();
        }
        break;
      case 2:
        if(popups.themes){
          popups.themes.destroy();
          delete popups.themes;
          popups.drawMode.show();
        }
        break;
      case 3:
        if(popups.drawMode){
          popups.drawMode.destroy();
          delete popups.drawMode;
          popups.reset.show();
        }
        break;
      case 4:
        if(popups.reset){
          popups.reset.destroy();
          delete popups.reset;
          popups.undo.show();
        }
        break;
      case 5:
        if(popups.undo){
          popups.undo.destroy();
          delete popups.undo;
          popups.redo.show();
        }
        break;
      case 6:
        if(popups.redo){
          popups.redo.destroy();
          delete popups.redo;
          popups.resetStart.show();
        }
        break;
      case 7:
        if(popups.resetStart){
          popups.resetStart.destroy();
          delete popups.resetStart;
          popups.highlightCountries.show();
        }
        break;
      case 8:
        if(popups.highlightCountries){
          popups.highlightCountries.destroy();
          delete popups.highlightCountries;
          popups.present.show();
        }
        break;
      case 9:
        if(popups.present){
          popups.present.destroy();
          delete popups.present;
          buttons.slider.scrollIntoView();
          popups.slider.show();
        }
        break;
      case 10:
        if(popups.slider){
          popups.slider.destroy();
          delete popups.slider;
          popups.end = tippy(welcomeDiv,{
            content: '<div style="text-align: center; font-size: 1rem;">This is the end of the tutorial. Click anywhere to continue. </div>',
            hideOnClick: false,
            delay: 1000,
            trigger: 'manual',
            allowHTML: true,
            arrow: false,
          });
          popups.end.show();
        }
        break;
      case 11:
        if(popups.end){
          popups.end.destroy();
          delete popups.end;
          document.body.removeChild(welcomeDiv);
          document.body.removeChild(disableDiv);
          document.body.scrollTo({top: 0, left: 0, behavior: 'smooth'});
          clearInterval(tutorialLoop);
        }
        break;
    }
  }, 50);
}