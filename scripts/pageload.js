//start load screen when dom is ready
document.onreadystatechange = function(e)
{
    if (document.readyState == 'complete')
    {
        let elem = document.getElementById('loading');
      updateWindow();
      map.invalidateSize();
      if (!elem.style.opacity) {elem.style.opacity = 1;}
      //fade effect
      setTimeout(() => {
        let temp = setInterval(() => {
          if (elem.style.opacity > 0) {elem.style.opacity -= 0.02;}
          else {
            elem.remove(); 
            document.documentElement.style.overflowY = 'auto';
            document.body.style.overflowY = 'auto';
            document.getElementById("present").checked = true;
            tutorial();
            present();
            clearInterval(temp);
          }
        }, 20);
        
      }, 500);
    }
};
//adjust for mobile
window.isMobile = () => {
  const isMobileDevice = /Mobi/i.test(window.navigator.userAgent)
  return isMobileDevice;
};
window.addEventListener('resize', () => {
  updateWindow();
});
//update window on resize and load
function updateWindow(){
    if (window.innerWidth < 500 || window.isMobile()) {
    let navbar = document.getElementById('navbar');
    navbar.style.flexFlow = 'column';
    navbar.style.width = '100%';
    navbar.style.margin = '0px';
    navbar.style.height = 'auto';
    for (child of navbar.children) {
      child.style.width = '100%';
      child.style.margin = '0px';
    }
    let body = document.body;
    body.style = `
     overflow-y: auto;
     height: 100vmax;
     width: 100%;
     margin: 0;
    `;
    let mapStyle = document.getElementById('mapContainer').style;
    mapStyle.width= '90vw';
    mapStyle.height = '90vh';
    mapStyle.backgroundColor = 'darkslateblue';
    mapStyle.margin='auto';
    let leafletMap = document.getElementById('map').style;
    leafletMap.width = '100%';
    leafletMap.height = '100%';
    leafletMap.margin='auto';
    leafletMap.maxHeight = '90vh';
    leafletMap.minHeight = '90vh';
    document.getElementById('present').style.borderTop = '1px solid darkgrey';
  }
}