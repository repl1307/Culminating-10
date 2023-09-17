//base layer variables
var map = L.map('map', {
    fullscreenControl: {
        pseudoFullscreen: true
    }
}).setView([31.7683, 35.2137], 7);
map.scrollWheelZoom.disable();
map.on('zoomstart', () => {
    for (tooltip of countryTooltips) {}
});
var tilemap = def.addTo(map);
// //add geojson data
var countryLayer = L.geoJSON(countryData, {
    style: function(feature) {
        let temp = {
            fillColor: "rgb(200,50,50)",
            color: "rgb(50,50,50)",
            opacity: 0.25,
            fillOpacity: 1,
            stroke: true
        };
        let name = feature.properties.ADMIN.toLowerCase();
        switch (name) {
            case 'israel':
            case 'palestine':
                temp.fillColor = 'rgb(50,50,200)';
                temp.fillOpacity = 0;
                break;
            case 'egypt':
                temp.fillColor = 'yellow';
                break;
            case 'jordan':
                temp.fillColor = 'orange';
                break;
            case 'syria':
                temp.fillColor = 'pink';
                break;
            case 'lebanon':
                temp.fillColor = 'purple'
                break;
            default:
                temp.fillOpacity = 0;
                temp.stroke = false;
                break;
        }
        return temp;
    },
    //apply setting to each feature before it is added
    onEachFeature(feature, layer) {
        for (let i = 0; i < countryDensity.length; i++) {
            let country = countryDensity[i];
            let name = country.country.toLowerCase();
            let currName = feature.properties.ADMIN.toLowerCase();
            if (name == currName) {
                switch (name) {
                    case 'israel':
                    case 'jordan':
                    case 'syria':
                    case 'egypt':
                    case 'lebanon':
                    case 'palestine':
                        countryTooltips.push(
                            layer.bindTooltip(country.country, {
                                permanent: false,
                                direction: 'center',
                                sticky: true
                            }));
                        break;
                }

                //   layer.bindPopup(
                //   "Population Density:"+ country.density+"<br>Population:"+countryPopulation[i].population);
            }
        }
    }
});
//drawing variables
var draw = false;
var points = []; //stores coordinates of scribbles and lines
var lines = []; //stores polylines until full line is made
var drawings = []; //list of scribbles and lines
var undoList = []; //list of scribbles and lines after they have been removed
var bigUndoList = []; //for when clear is pressed
//map extension variables
var popup = L.popup({
    autoPan: false
});
var scale = L.control.scale().addTo(map);
//previous year on slider
var prevYear = Number(document.getElementById('yearSlider').value);
var currYear = prevYear;
//tooltip list
var tooltips = [];
//event listeners for pen
//if not a mobile device, use leaflet listeners
if (true) {
    map.on('mousedown', () => {
        if (drawMode != 'none') {
            draw = true;
            drawings.push([]);
        }
    })
    map.on('mousemove', onMapDrag);
    map.on('mouseup', () => {
        draw = false;
        //reset pen path
        if (drawMode == 'pen') {
            points = [];
        }
        filterDrawings();
    });
}
//use DOM eventlisteners


map.on('click', onMapClick);
//map click function
function onMapClick(e) {
    if (drawMode == "line") {
        points.push({
            lat: e.latlng.lat,
            lng: e.latlng.lng
        });
        lines.push(e.latlng);
        //if both points in line have been set
        if (lines.length == 2) {
            //data collection
            dataList.push([e.latlng.lat, e.latlng.lng]);
            localStorage.setItem('mapdata', JSON.stringify(dataList));
            for (line of dataDisplayList) {
                map.removeLayer(line);
                dataDisplayList.splice(dataDisplayList.indexOf(line), 1);
            }
            displayData();
            //display line
            drawings.push([L.polyline(lines, {
                color: "red"
            }).addTo(map)]);
            lines.splice(0, 1);
        }
        filterDrawings();
    }

    if (drawMode != "none") {
        return;
    }
    // popup
    //  .setLatLng(e.latlng)
    //  .setContent("You clicked the map at " + e.latlng.toString())
    //  .openOn(map);
}
//map drag function
function onMapDrag(e) {
    //if drawing is enabled and pen is selected
    if (draw && drawMode == "pen") {
        map.dragging.disable();
        points.push({
            lat: e.latlng.lat,
            lng: e.latlng.lng
        });
        drawings[drawings.length - 1].push(L.polyline(points, {
            color: "green"
        }).addTo(map));
    }
    if (!document.getElementById('present').checked || true) {
        map.dragging.enable();
    }

}
//presentation function
function presentation() {
    let slidecontainer = document.getElementById('slidecontainer');
    let year = Number(document.getElementById('yearSlider').value);
    let popups = document.getElementsByClassName('popup');
    //lockMap();
    //show popups by default
    for (let i = 0; i < popups.length; i++) {
        popups[i].style.display = "block";
    }
    //hide layers on layer change
    if (layerIndex != year - 1916) {
        if (layers[layerIndex]) {
            hideLayer(layers[layerIndex].markers);
            hideLayer(layers[layerIndex].polygons);
            hideLayer([layers[layerIndex].base]);
        }
        //update layer index and show current layer
        layerIndex = year - 1916;
        if (layers[layerIndex]) {
            showLayer([layers[layerIndex].base]);
            showLayer(layers[layerIndex].polygons);
            showLayer(layers[layerIndex].markers);
        }
    }

    //changing presentation based off of yearSlider value
    // gets all textboxes that match the year of the slider
    if (popups.length == 0) {
      let currSlides = [];
        for (slide of slideList) {
            if (slide.year == year) {
                currSlides.push(slide);
                addPopup(slideList[slideList.indexOf(slide)]);
            }
        }
    }
}
//exit presentation
function exitPresentation() {
    clearInterval(slideshowLoop);
    unlockMap();
    map.setMaxBounds(null);
    let popups = document.getElementsByClassName('popup');
    //delete all popups
    while (popups[0]) {
        popups[0].parentNode.removeChild(popups[0]);
    }
    hideLayer(layers[layerIndex].markers);
    hideLayer(layers[layerIndex].polygons);
    hideLayer([layers[layerIndex].base]);
}
//add popup from slide object
function addPopup(slide) {
    let temp = document.createElement('div');
    temp.innerHTML = slide.text;
    if(slide.id){temp.id = slide.id;}
  //if popups are stacked
    if(typeof(slide.top) == 'function'){
      slide.top = slide.top();
    }
    if(typeof(slide.bottom) == 'function'){
      slide.bottom = slide.bottom();
    }
    temp.classList.add('popup');
    if (slide.top) {
        temp.style.top = slide.top;
    }
    if (slide.right) {
        temp.style.right = slide.right;
    }
    if (slide.left) {
        temp.style.left = slide.left;
    }
    if (slide.bottom) {
        temp.style.bottom = slide.bottom;
    }
    if (slide.width) {
        temp.style.width = slide.width;
    }
  //default text size
    temp.style.fontSize = '2vmin';
  //update width when in landscape orientation
  if(window.isMobile() && innerWidth > innerHeight){
    temp.style.fontSize = '1.5vmax';
    //update width of mobile device is landscape oriented
    if(slide.width){
    let str = slide.width.replace('vmin','');
    console.log(str);
    let w = Number(str)/100*80;
    temp.style.width = w+'vmax';
    }
  }
    if (slide.height) {
        temp.style.height = slide.height;
    }
  
    document.getElementById('map').appendChild(temp)
    //add tooltips to children in 'tippy' class
    //tooltip content is from custom data-text attribute
    for (child of document.getElementsByClassName('tippy')) {
        tooltips.push(tippy(child, {
            content: child.getAttribute("data-text"),
            allowHTML: true,
        }));
    }
}
//lock map position, prevent moving
function lockMap() {
    console.log('locked');
    map.setView([31.7683, 35.2137]);
    map.setMinZoom(6);
    map.setMaxZoom(13);
    /*map.dragging.disable();
  map.scrollWheelZoom.disable();
 map.doubleClickZoom.disable();
 map.touchZoom.disable();*/
}
//unlock map, enable movement
function unlockMap() {
    map.dragging.enable();
   // map.scrollWheelZoom.enable();
    map.doubleClickZoom.enable();
    map.touchZoom.enable();
    map.setMinZoom(0);
    map.setMaxZoom(13);
}
//start slideshow
function startSlideShow() {
    let a = L.latLng(33.779147, 32.651367);
    let b = L.latLng(29.05617, 37.353516);
    L.rectangle(L.latLngBounds(a, b), {
        color: 'pink',
        fillOpacity: 0
    }).addTo(map);
    map.setMaxBounds(L.latLngBounds(a, b))
}
//slide list storage
let slideList = [
  {
        year: 1916,
        text: 'The <b class = "tippy" data-text = "A secret treaty between Great Britain and France regarding' +
            ' how to split up the Ottoman Empire after the war."> ' +
            'Sykes-Picot Agreement </b> is formed.  ',
    id:'1916SykesPicot',
        top: '0.25rem',
        right: '0.25rem',
        bottom: false,
        left: false,
        width: '50vmin',
        height: false
    },
    {
      year: 1916,
      text: 'Britain and France attempt to sweep through the Western Front in the'
        +'<b class = "tippy" data-text="Arguably the bloodiest and most violent battle of the entire war. '
      +'It was a joint operation intended to achieve a decisive victory on the Western Front.'
      +' However, the Allied Forces only advanced 7 kilometers, and suffered '
      +'over half a million casualties."> Battle of Somme </b>.',
        top: false,
        right: false,
        bottom: '0.25rem',
        left: '0.25rem',
        width: '50vmin',
        height: false
    },
    {
      year: 1916,
      text: 'The <b class = "tippy" data-text = "A series of letters between British'
        +' representative McMahon and Arab representative Hussein.'
        +' In exchange for the Arab\'s assistance against the Ottoman Empire in WWI,'
        +' Britain promised to recognize their independence."'
        +'>McMahon-Hussein Correspondence</b> reaches it\'s conclusion.',
      top: ()=>{return Number(document.getElementById('1916SykesPicot').clientHeight)/16+0.5+'rem'},
      right: '0.25rem',
      bottom: false,
      left: false,
      width: '50vmin',
      height: false
    },
    {
        year: 1917,
        text: 'The <b class = "tippy" data-text = \'Statement made by British government in 1917,' +
            ' stating their support for " the establishment of a national home for the Jewish' +
            ' people in <b>Palestine.</b>"\'>Balfour Declaration</b> is made in a letter from <b>Arthur Balfour</b> to <b>Walter Rothschild.</b>'
            +' It is deemed by many Arabs as a violation of the promises made in the <b>McMahon-Hussein Correspondence</b>.',
        top: '0.25rem',
        right: '0.25rem',
        bottom: false,
        left: false,
        width: '30vmin',
        height: false
    },
    {
        year: 1917,
        text: 'The <b>Sykes-Picot Agreement</b> is leaked to the public, severely worsening Anglo-Arab relations.',
        right: false,
        bottom: '0.25rem',
        left: '0.25rem',
        width: '40vmin',
        height: false
    },
    {
        year: 1918,
        text: '<b>WWI</b> ends on November 11th of this year. The <b>Ottoman Empire</b> collapses due to pressure from the Allied Forces as well as an internal revolt.',
        id: '1918WWI',
        top: '0.25rem',
        right: '0.25rem',
        bottom: false,
        left: false,
        width: '50vmin',
        height: false
    },
  {
        year: 1918,
        text: ' The <b>Sykes-Picot Agreement</b> takes effect.',
        top: ()=>{return (Number(document.getElementById('1918WWI').clientHeight)/16+0.5)+'rem'},
        right: '0.25rem',
        bottom: false,
        left: false,
        width: '50vmin',
        height: false
    },
      {
        year: 1919,
        text: 'Jewish immigration to Palestine begins to rapidly increase due to <b>international pressure</b> and the impacts of the <b class = "tippy" data-text ="The systematic persecution and murder of 6 million Jews during WWI">Holocaust</b>.',
        top: '0.25rem',
        right: '0.25rem',
        bottom: false,
        left: false,
        width: '50vmin',
        height: false
    },
    {
        year: 1920,
        text: 'On April 25th of this year, the <b class = "tippy" data-text="A legal document given to Britain by the League of Nations, authorizing their administration of both <b>Palestine</b> and <b>Transjordan </b>"> British Mandate</b> is granted at the San Remo Conference in Italy. This event further bolsters the mass exodus of Jewish immigrants to Palestine.',
        top: false,
        right: false,
        bottom: '0.25rem',
        left: '0.25rem',
        width: '45vmin',
        height: false
    },
    {
        year: 1921,
        text: 'The <b class ="tippy" data-text="A series of riots which intially began between two groups of Jews. However, Arabs nearby mistook the sounds of gunshots as a a surprise attack, and quickly got involved.">Jaffa Riots</b> begin on May 1st, and end on the 7th.',
        top: '0.25rem',
        right: '0.25rem',
        bottom: false,
        left: false,
        width: false,
        height: false
    },
      {
        year: 1922,
        text: 'Great Britain attempts to partially fulfill the <b>McMahon-Hussein Correspondence</b> by giving the land east of the Jordan River to the <b>Emirate of Jordan, Abdullah</b>. However, this region was still heavily influenced by and reliant upon Britain.',
        top: '0.25rem',
        right: '0.25rem',
        bottom: false,
        left: false,
        width: '50vmin',
        height: false
    },
        {
        year: 1923,
        text: 'From this year until <b>1928</b>, the presence of <b>British authorities</b> keeps the conflict and Israeli-Palestinian tensions controlled for the most part.',
        top: false,
        right: '0.25rem',
        bottom: '0.25rem',
        left: false,
        width: '50vmin',
        height: false
    },
  {
    year: 1929,
    text:'Israeli-Palestinian tensions result in the <b class = "tippy" data-text="A series of violent riots involving Israelis and Palestinians. Most of the casualties were caused by British officers. ">Buraq Uprising</b>. This would later lead to the 1930 <b>Passfield White Paper</b>.',
        top: false,
        right: false,
        bottom: '0.25rem',
        left: '0.25rem',
        width: '50vmin',
        height: false
  },
  {
     year: 1930,
      text: 'The <b class = "tippy" data-text="An official statement regarding British policy in Palestine. Jewish immigration was to be slowed down and implemented in a more controlled manner.">Passfield White Paper </b> is issued in order to placate native Palestinians. Zionists interpreted it as a violation of the <b> Balfour Declaration </b>',
      top: '0.25rem',
      right: '0.25rem',
      bottom: false,
      left: false,
      width: '50vmin',
      height: false
  },
  {
     year: 1931,
      text: 'Due to fierce <b> Zionist opposition</b>, British Prime Minister Ramsay MacDonald nullifies the <b>Passfield White Paper</b>.',
      top: '0.25rem',
      right: '0.25rem',
      bottom: false,
      left: false,
      width: '50vmin',
      height: false
  },
  {
     year: 1933,
      text: '<b> Nazi ascension </b> to power in Germany causes Jewish immigration to increase by <b>30,000</b>.',
      id: '1933NaziAscension',
      top: '0.25rem',
      right: '0.25rem',
      bottom: false,
      left: false,
      width: '50vmin',
      height: false
  },
    {
     year: 1933,
      text: 'The large influx of immigrants increases tensions and causes the <b class = "tippy" data-text="Palestinians lost confidence in Great Britain due to the repealing of the <b> Passfield White Paper</b>, increasing tensions to a bursting point.">1933 Palestine Riots</b>.',
      top: ()=>{ return document.getElementById('1933NaziAscension').clientHeight/16+0.5+'rem'},
      right: '0.25rem',
      bottom: false,
      left: false,
      width: '50vmin',
      height: false
  },
  {
     year: 1934,
      text: '<b>Nazi influence</b> began to spread across all aspects of German life, causing Jewish immmigration to increase by an additional <b>12,000</b>.',
      top: '0.25rem',
      right: '0.25rem',
      bottom: false,
      left: false,
      width: '50vmin',
      height: false
  },
    {
     year: 1935,
      text: '<b>19,000</b> more Jewish immigrants make their way to Palestine as tensions in Europe <b>increase</b>.',
      top: '0.25rem',
      right: '0.25rem',
      bottom: false,
      left: false,
      width: '50vmin',
      height: false
  },
      {
     year: 1936,
      text: '<b class ="tippy" data-text="Roughly 400,000 Jewish immigrants live in Palestine at this point in time.">Jewish immigrants</b> now make up one-third of the total population of <b>Palestine</b>.',
      id: '1936Immigration',
      top: '0.25rem',
      right: '0.25rem',
      bottom: false,
      left: false,
      width: '50vmin',
      height: false
  },
  {
     year: 1936,
      text: ' The <b class ="tippy" data-text="A nationalist Palestinian uprising against Mandate administrators. Protesters demanded independence and an end to uncontrolled Jewish immigration.">1936-39 Arab Revolt</b> begins as tensions escalate between Palestinians and Jewish immigrants.',
      top: ()=>{return document.getElementById('1936Immigration').clientHeight/16+0.5+'rem'},
      right: '0.25rem',
      bottom: false,
      left: false,
      width: '50vmin',
      height: false
  },
   {
     year: 1937,
      text: ' The British government, taken aback by the intensity of the revolt, brought in <b> 20,000 </b> troops to control the situation.',
      id:'1937Troops',
        top: false,
        right: false,
        bottom: '0.25rem',
        left: '0.25rem',
        width: '50vmin',
        height: false
  },
  {
     year: 1937,
     text:'The <b class = "tippy" data-text="An investigation led by British Lord Robert Peel. It was concluded that the mandate was ineffective and that a two state solution should be implemented.">Peel Commission</b> looks into the causes of the conflict.',
        top: false,
        right: false,
        bottom: ()=>{return document.getElementById('1937Troops').clientHeight/16+0.5+'rem'},
        left: '0.25rem',
        width: '50vmin',
        height: false
  },
  {
    year: 1938,
    text:'<b class="tippy"data-text="Zionism is a nationalist movement that is centered around the belief that Jews need and have the rights for the establishment of a Jewish homeland in the land of Palestine.">Zionists</b> takes advantage of the situation, by arming <b class = "tippy" data-text= "Radical Zionists took advantage of the uncertainty and fear Jewish immigrants possessed in order to essentially indoctrinate them.">15,000</b> Jewish immigrants and strengthening their own radical movement.',
        top: false,
        right: false,
        bottom: '0.25rem',
        left: '0.25rem',
        width: '50vmin',
        height: false
  },
    {
    year: 1939,
    text:'The <b class = "tippy" data-text="Although the revolt was largely unsuccessful, the existence of the Palestinian identity had finally been acknowledged.">1936-39 Arab Revolt</b> reaches its conclusion. The Palestinians had exhausted their strength, and were vulnerable to attacks by <b class = "tippy" data-text="A large organized Zionist militia that formed after the revolt. Along with Irgun Zvai Leumi, the two extremist groups committed countless terrorist acts against Palestinians.">Haganah</b>',
        top: false,
        right: false,
        bottom: '0.25rem',
        left: '0.25rem',
        width: '50vmin',
        height: false
  },
  {
    year: 1940,
    text:'Jewish ownership of land rises to <b class = "tippy" data-text="Roughly 1/7 of Mandatory Palestine">385,000 acres</b>',
    id: '1940Ownership',  
        top: false,
        right: false,
        bottom: '0.25rem',
        left: '0.25rem',
        width: '50vmin',
        height: false
  },
    {
    year: 1940,
    text:'Irgun Zvai Leumi, alogn with several splinter groups begin attacking the British.',
        top: false,
        right: false,
        bottom: ()=>{return document.getElementById('1940Ownership').clientHeight/16+0.5+'rem'},
        left: '0.25rem',
        width: '50vmin',
        height: false
  },
  {
     year: 1942,
      text: 'Ben Gurion, the leader of the Zionist movement, holds a <b class="tippy" data-text="The conference resulted in Gurion gaining the support of American Zionists.">press conference</b> in New York City.',
      top: '0.25rem',
      right: '0.25rem',
      bottom: false,
      left: false,
      width: '50vmin',
      height: false
  },
    {
     year: 1944,
      text: 'The <b class = "tippy" data-text="A declaration stating that the solution for the Jewish survivors of the Holocaust should not be Zionism.">Alexandria Protocol</b> is issued by the heads of several Arab governments.',
      top: '0.25rem',
      right: '0.25rem',
      bottom: false,
      left: false,
      width: '50vmin',
      height: false
  },
  {
     year: 1945,
      text: '<b>WWII</b> reaches its conclusion. Jewish immigration once again spikes. ',
      id: '1945WWII',
      top: '0.25rem',
      right: '0.25rem',
      bottom: false,
      left: false,
      width: '50vmin',
      height: false
  },
    {
     year: 1945,
      text: 'With the increase in immigration, the strength of military organizations such as <b>Haganah</b> grows.',
      top: ()=>{ return document.getElementById('1945WWII').clientHeight/16+0.5+'rem'},
      right: '0.25rem',
      bottom: false,
      left: false,
      width: '50vmin',
      height: false
  },
  {
     year: 1946,
      text: 'The <b>Arab States</b> hold a secret meeting in Syria, and pledge to assist <b>Palestine</b>.',
      top: '0.25rem',
      right: '0.25rem',
      bottom: false,
      left: false,
      width: '50vmin',
      height: false
  },
    {
        year: 1947,
        text: 'Palestine is now comprised of <b>1,269,000 Palestinians</b> and <b>678,000 Jews</b>',
        id:'1947Population',
        top: '0.25rem',
        right: '0.25rem',
        bottom: false,
        left: false,
        width: '55vmin',
        height: false
    },
      {
        year: 1947,
        text: '<b>Britain</b> announces that it will terminate the <b>British Mandate</b> the next year. This causes civil war to break out.',
        top: ()=>{return document.getElementById('1947Population').clientHeight/16+0.5+'rem'},
        right: '0.25rem',
        bottom: false,
        left: false,
        width: '55vmin',
        height: false
    },
      {
        year: 1948,
        text: 'The <b>British Mandate</b> expires on May 14th, and <b>David Ben-Gurion</b> declares the existence of the state of <b>Israel</b>. President Truman immediately recognizes it, making the <b>USA</b> the first country to do so.',
        id:'1948Mandate',
        top: '0.25rem',
        right: '0.25rem',
        bottom: false,
        left: false,
        width: '50vmin',
        height: false
    },
   {
        year: 1948,
        text: '<b>700,000 Palestinians</b> fled or were expelled from their homes because of the war. This event became known to Palestinians as <b>&quot;The Nakba&quot;</b>, or <b>&quot;The Catastrophe&quot;</b>.',
        id:'1948Mandate',
        top: false,
        right: false,
        bottom: '0.25rem',
        left: '0.25rem',
        width: '50vmin',
        height: false
    },
        {
        year: 1948,
        text: 'The neighboring Arab countries invade, marking the beginning of the first <b>Arab-Israeli War</b>.',
        top: ()=>{return document.getElementById('1948Mandate').clientHeight/16+0.5+'rem'},
        right: '0.25rem',
        bottom: false,
        left: false,
        width: '50vmin',
        height: false
    },
    {
        year: 1949,
        text: '<b>Israel</b> establishes its control over the majority of <b>Palestine</b> and is recognized by over 50 countries.',
        id:'1949WarEnd',
        top: '0.25rem',
        right: '0.25rem',
        bottom: false,
        left: false,
        width: '45vmin',
        height: false
    },
  {
        year: 1949,
        text: 'The war ends with <b>Israel</b> agreeing to let <b>Egypt</b> and <b>Jordan</b> control the remaining Palestinian territory.',
        top: ()=>{return document.getElementById('1949WarEnd').clientHeight/16+0.5+'rem'},
        right: '0.25rem',
        bottom: false,
        left: false,
        width: '45vmin',
        height: false
    },
    {
        year: 1950,
        text: 'In response to the almost one million displaced <b>Palestinians</b> the UN creates 53 refugee camps.',
        top: '0.25rem',
        right: '0.25rem',
        bottom: false,
        left: false,
        width: '45vmin',
        height: false
    },
    {
        year: 1952,
        text: 'At this point in time, only <b>150,000</b> Palestinians reside in <b>Israel</b>. The majority of them became <b class = "tippy" data-text = "Palestinians that stayed in Israel supposedly had equal rights. However, they were faced with an abundance of restrictions. ">unskilled laborers</b>.',
        top: '0.25rem',
        right: '0.25rem',
        bottom: false,
        left: false,
        width: '45vmin',
        height: false
    },
    {
    year: 1956,
    text:'The <b class = "tippy" data-text="A conflict in which Britain, France and Israel attempted to take control of the Suez Canal from Egypt.">Suez Crisis</b> occurs, and <b>Egypt</b> emerges as the victor, strengthing Arab nationalism.',  
        top: false,
        right: false,
        bottom: '0.25rem',
        left: '0.25rem',
        width: '55vmin',
        height: false
  },
   {
    year: 1958,
    text:'Refugee camps began to become more <b class = "tippy" data-text="Improvements in refugee camp living conditions were mostly funded by Lebanon and Syria.">permanent establishments</b>, and tents were replaced by concrete blocks with iron sheet roofs.',  
        top: false,
        right: false,
        bottom: '0.25rem',
        left: '0.25rem',
        width: '55vmin',
        height: false
  },
     {
    year: 1958,
    text:'Refugee camps began to become more <b class = "tippy" data-text="Improvements in refugee camp living conditions were mostly funded by Lebanon and Syria.">permanent establishments</b>, and tents were replaced by concrete blocks with iron sheet roofs.',  
        top: false,
        right: false,
        bottom: '0.25rem',
        left: '0.25rem',
        width: '55vmin',
        height: false
  },
     {
    year: 1960,
    text:'<b>Israel</b> attempts to suppress the Palestinian identity by harassing and isolating Palestinians. However, the <b>Palestinian youth</b> still developed a strong sense of <b>nationalism</b>.',  
        top: false,
        right: false,
        bottom: '0.25rem',
        left: '0.25rem',
        width: '55vmin',
        height: false
  },
    {
    year: 1964,
    text:'The <b class = "tippy" data-text="Palestinian Liberation Organization">PLO</b> was created as the governing body and representative for Palestine. ',  
        top: false,
        right: false,
        bottom: '0.25rem',
        left: '0.25rem',
        width: '55vmin',
        height: false
  },
    {
    year: 1967,
    text:'The <b class ="tippy" data-text ="The war began after Israel surprise attacked Egypt, causing Jordan and Syria to come to its aid. ">Six Day War</b> results in Israel\'s victory, and conquering of the <b>Sinai Peninsula</b> and <b>Golan Heights</b>. From this point onwards, <b>Israel</b> militarily occupies the <b>West Bank</b> and <b>Gaza Strip</b>.',  
        top: false,
        right: false,
        bottom: '0.25rem',
        left: '0.25rem',
        width: '70vmin',
        height: false
  },
    {
    year: 1979,
    text:'The <b class ="tippy" data-text ="Egypt recognized the existence of Israel and promised to establish peaceful relations. In exchange Israel was to return the Sinai Peninsula.">Camp David Accords</b> leads to the end of hostile Israeli-Egypt relations.',  
        top: false,
        right: false,
        bottom: '0.25rem',
        left: '0.25rem',
        width: '50vmin',
        height: false
  },
   {
    year: 1982,
    text:'Egypt regains control of the <b >Sinai Peninsula</b>, three years after the <b>Camp David Accords</b>. The <b>West Bank</b> and <b>Gaza Strip</b> remain militarily occupied.',  
        top: false,
        right: false,
        bottom: '0.25rem',
        left: '0.25rem',
        width: '50vmin',
        height: false
  },
  {
    year: 1987,
    text:'<b>Palestinian unrest</b> leads to the <b class = "tippy" data-text ="A series of violent riots and protests caused by frustration resulting from the <b>Six Day War</b> and the conquering of much of the <b>West Bank</b>">First Intifada</b>, which lasts until <b>1993</b>.',  
        top: false,
        right: false,
        bottom: '0.25rem',
        left: '0.25rem',
        width: '60vmin',
        height: false
  },
  {
    year: 1987,
    text:'<b class = "tippy" data-text="A military organization born during the chaos of the intifada. It would later become one of Israel\'s biggest enemies.">Hamas</b> is founded.',  
        top: '0.25rem',
        right: '0.25rem',
        bottom: false,
        left: false,
        width: '25vmin',
        height: false
  },
    {
        year: 1993,
        text: 'The <b class="tippy" data-text="An agreement signed by the leader of the PLO and Israel. It outlined a peace process that both sides were not opposed to. ">Oslo Accord I</b> is signed, causing the <b>First Intifada</b> to end.',
        top: '0.25rem',
        right: '0.25rem',
        bottom: false,
        left: false,
        width: '55vmin',
        height: false
    },
   {
        year: 1994,
        text: 'The <b class="tippy" data-text="Palestinian Authority ">PA</b> is created as a temporary governing body for Palestine, while the <b>Oslo Accord I</b> was being implemented.',
        top: '0.25rem',
        right: '0.25rem',
        bottom: false,
        left: false,
        width: '55vmin',
        height: false
    },
    {
        year: 1995,
        text: 'The <b class="tippy" data-text="An agreement that elaborated upon the first Oslo Accord. In parallel to its predecessor, it was signed by both the leader of the the PLO and Prime Minister of Israel">Oslo Accord II</b> is signed, further bolstering Palestinians\' hopes for independence and peace. The West Bank was split into Area\'s A, B, and C. A and B were mostly under Palestinian control, while C was supposed to slowly become overseen by the <b>PLO</b>',
        top: false,
        right: false,
        bottom: '0.25rem',
        left: '0.25rem',
        width: '75vmin',
        height: false
    },
    {
        year: 2000,
        text: 'The <b class = "tippy" data-text="A series of violent riots and protests caused by the failure of the Camp David Summit."> Second Intifada</b> begins, as Palestinian frustrations once more reach a breaking point. ',
        id:'2000Summit',
        top: false,
        right: false,
        bottom: '0.25rem',
        left: '0.25rem',
        width: '75vmin',
        height: false
    },
  {
        year: 2000,
        text: 'The <b class="tippy" data-text="An &quot;all or nothing&quot; resolution to the Israeli-Palestinian conflict. Agreements failed to be reached, and the summit ended without anything being done.">Camp David Summit</b> ends in absolute failure, setting back the peace process and frustrating <b>Palestinans</b>.',
        top: false,
        right: false,
        bottom: ()=>{return document.getElementById('2000Summit').clientHeight/16+0.5+'rem'},
        left: '0.25rem',
        width: '75vmin',
        height: false
    },
     {
        year: 2005, 
        text: 'The <b class = "tippy" data-text="An agreement between the PLO and Israel. The PLO agreed to stop the riots, in exchange for <b>Israel</b> ceasing their advancements in the <b>West Bank</b>. "> Sharm El Sheikh Summit</b> causes the <b>Second Intifada</b> to end. ',
        top: false,
        right: false,
        bottom: '0.25rem',
        left: '0.25rem',
        width: '50vmin',
        height: false
    },
    {
        year: 2006,
        text: '<b class="tippy"data-text="A Palestinian military organization that opposes Israel.">Hamas</b> wins the Palestinian elections, and takes control of the <b class = "tippy" data-text="Palestinian Authority">PA</b>',
        top: '0.25rem',
        right: '0.25rem',
        bottom: false,
        left: false,
        width: '55vmin',
        height: false
    },
    {
        year: 2008,
        text: '<b>Israel</b> invades the Gaza Strip, causing the <b class = "tippy" data-text="The war concluded with Hamas repelling the Israeli offensive, however, they suffered heavy losses.">2008 Gaza War</b>.',
        top: '0.25rem',
        right: '0.25rem',
        bottom: false,
        left: false,
        width: '55vmin',
        height: false
    },
    {
        year: 2014,
        text: '<b>Israel</b> once again invades the Gaza Strip, causing the <b class = "tippy" data-text="Both sides claimed victory in the conflict, however there wasn\'t a clear cut victor, as both sides suffered.">2014 Gaza War</b>.',
        top: '0.25rem',
        right: '0.25rem',
        bottom: false,
        left: false,
        width: '55vmin',
        height: false
    },
   {
        year: 2017,
        text: 'Trump recognizes <b class = "tippy" data-text ="A site of religious importance for many Israelis and Palestinians">Jerusalem</b> as the capital of Israel, earning international criticism.',
        top: '0.25rem',
        right: '0.25rem',
        bottom: false,
        left: false,
        width: '55vmin',
        height: false
    },
  {
    year: 2020,
    text:'Israel establishes diplomatic relations with the United Arab Emirates, Bahrain, Sudan, and Morocco.',
    top: '0.25rem',
    right: '0.25rem',
    bottom: false,
    left: false,
    width: '55vmin',
    height: false
  },
  {
        year: 2021, 
        text: 'A series of skirmishes between <b>Hamas</b> and the <b class = "tippy" data-text="Israel Defense Forces">IDF</b> in Gaza causes damage to infrastructure and civilian casualties.',
        top: false,
        right: false,
        bottom: '0.25rem',
        left: '0.25rem',
        width: '50vmin',
        height: false
    },
  {
        year: 2022, 
        text:'<b>Benjamin Netanyahu</b> is replaced by </b>Naftali Bennet</b> as Israeli Prime Minister. This is the first time <b>Israel</b> has changed Prime Ministers in over 12 years. ',
        top: false,
        right: false,
        bottom: '0.25rem',
        left: '0.25rem',
        width: '50vmin',
        height: false
    }

];