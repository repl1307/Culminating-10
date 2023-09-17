/*TODO: polygons for --> 
- key years(1918,1947,1967,1995,presentday)
- outcomes
*/
let blueBasePolygon;
let basePolygon;
//lists where polygons are stored
let markers1917 = [];
let countryTooltips = [];
let layers = [];
let layerIndex = 0;
//create and store polygons
window.addEventListener('load', () => {
    basePolygon = L.polygon(
        baseMap, {
            color: '#207d28', // dark green
            fillOpacity: '1',
            fillColor: '#207d28' // dark green
        }
    );
    blueBasePolygon = L.polygon(
        baseMap, {
            color: '#2b9aab', //  blue
            fillOpacity: '1',
            fillColor: '#2b9aab' // blue 
        }
    );
    //1917 markers
    //tel aviv marker
    markers1917.push(
        L.circleMarker([32.129105, 34.782715], {
            color: 'red',
            radius: 5
        }).bindPopup('Tel Aviv')
    );
    //haifa marker
    markers1917.push(
        L.circleMarker([32.787275, 35.046387], {
            color: 'red',
            radius: 5
        }).bindPopup('Haifa')
    );
    //jerusalem marker
    markers1917.push(
        L.circleMarker([31.770208, 35.222168], {
            color: 'red',
            radius: 5
        }).bindPopup('Jerusalem')
    );
    //adding map layers for each year
    layers.push({
        layer: '1916',
        base: basePolygon,
        polygons: dataToPolygons(polygonData1917),
        markers: markers1917
    });
    layers.push({
        layer: '1917',
        base: basePolygon,
        polygons: dataToPolygons(polygonData1917),
        markers: markers1917
    });
    //temporary filling with 1917 data
    for (let i = 1918; i < 1931; i++) {
        layers.push({
            layer: (i).toString(),
            base: basePolygon,
            polygons: dataToPolygons(polygonData1917),
            markers: markers1917
        });
    }
    //1946 polygons
    layers.push({
        layer: '1931',
        base: basePolygon,
        polygons: dataToPolygons(polygonData1946),
        markers: markers1917
    });
    for (let i = 1932; i <= 1947; i++) {
        layers.push({
            layer: (i).toString(),
            base: basePolygon,
            polygons: dataToPolygons(polygonData1946),
            markers: markers1917
        });
    }
    //1947 partion plan polygons
    layers.push({
        layer: '1947',
        base: basePolygon,
        polygons: dataToPolygons(polygonData1947),
        markers: markers1917
    });
    for (let i = 1948; i <= 1965; i++) {
        layers.push({
            layer: (i).toString(),
            base: basePolygon,
            polygons: dataToPolygons(polygonData1947),
            markers: markers1917
        });
    }
    //occupation of sinai peninsula & golan heights
    for (let i = 1967; i <= 1982; i++) {
        layers.push({
            layer: (i).toString(),
            base: blueBasePolygon,
            polygons: dataToPolygons(polygonData1949, '#207d28'),
            markers: markers1917
        });
        layers[layers.length - 1].polygons.push(
            createMapPolygon(golanHeightsPolygonData, '#175c66'),
            createMapPolygon(sinaiPeninsulaPolygonData, '#175c66')
        );
    }
    //after peace treaty between egypt and israel
    for (let i = 1982; i < 1995; i++) {
        layers.push({
            layer: (i).toString(),
            base: blueBasePolygon,
            polygons: dataToPolygons(polygonData1949, '#207d28'),
            markers: markers1917
        });
        layers[layers.length - 1].polygons.push(
            createMapPolygon(golanHeightsPolygonData, '#175c66'),
        );
    }
    //after oslo accords
    for (let i = 1995; i <= 2023; i++) {
        let tempList = [];
        //add west bank poly for area c
        tempList.push(
            createMapPolygon(polygonData1949[1], '#175c66'),
        );
        //add annexed territory to layer
        for (polygon of annexedPolygonData1995) {
            tempList.push(
                L.polygon(polygon, {
                    fillColor: '#175c66',
                    color: '#175c66',
                    fillOpacity: '1',
                    weight: 1.5
                })
            );
        }
        //add west bank palestinian polygons to layer
        for (polygon of polygonData1995) {
            tempList.push(
                createMapPolygon(polygon, '#207d28')
            );
        }
        //add golan heights
        tempList.push(
            createMapPolygon(golanHeightsPolygonData, '#175c66')
        );
        //add gaza strip
        tempList.push(
            createMapPolygon(polygonData1949[0], '#207d28')
        );
        layers.push({
            layer: (i).toString(),
            base: blueBasePolygon,
            polygons: tempList,
            markers: markers1917
        });
    }
    //map legend

    let legend = L.control({
        position: 'topleft'
    });
    legend.onAdd = () => {
        let div = L.DomUtil.create('div');
        div.innerHTML =
            `<div style = 'display: inline-block;background-color:green; width: 2vmin; height: 2vmin;'></div> Palestinian Territory<br>
    <div style = 'display: inline-block;background-color:#2b9aab; width: 2vmin; height: 2vmin;'></div> Israeli Territory<br>
    <div style = 'display: inline-block;background-color: #175c66; width: 2vmin; height: 2vmin;'></div> Occupied Territory<br>
    `;
        div.style = `
     background-color: white;
     padding: 5px;
     border: 1px solid grey;
     clear: none;
    `;
        disablePropagation(div);
        return div;
    }
    legend.addTo(map);
});
//disable event propagation
const disablePropagation = element => {
    const events = ["click", "contextmenu", "dblclick", "mousedown", "mouseenter", "mouseleave", "mousemove",
        "mouseover", "mouseout", "mouseup", "keydown", "keypress", "keyup", "blur", "change", "focus", "focusin",
        "focusout", "input", "invalid", "reset", "search", "select", "submit", "drag", "dragend", "dragenter",
        "dragleave", "dragover", "dragstart", "drop", "copy", "cut", "paste", "mousewheel", "wheel", "touchcancel",
        "touchend", "touchmove", "touchstart"
    ];
    const handler = event => {
        event.stopPropagation();
        return false;
    };
    for (let i = 0; i < events.length; i++) {
        element.addEventListener(events[i], handler, true);
    }
};
//create map polygon, default color is dark green
function createMapPolygon(data, color = '#207d28') {
    return L.polygon(
        data, {
            color: color.toString(),
            fillOpacity: '1',
            fillColor: color.toString(),
            weight: 2
        });
}
//convert data to polygons, default color is blue
function dataToPolygons(data, color = '#2b9aab') {
    let polygonList = [];
    for (polygon of data) {
        polygonList.push(
            L.polygon(polygon, {
                color: color.toString(),
                fillOpacity: '1',
                fillColor: color.toString(),
                weight: 2
            })
        );
    }
    return polygonList;
}
//order layers
/* Order:
basemap polygons
country hover polygons
markers
*/
function orderLayers() {
    if (!layers[layerIndex]) {
        return;
    }
    layers[layerIndex].base.bringToBack();
    for (marker of layers[layerIndex].markers) {
        marker.bringToFront();
    }
}
//update slide order only when needed
let sliderValue = document.getElementById('yearSlider').value;
setInterval(() => {
    if (sliderValue != document.getElementById('yearSlider').value) {
        orderLayers();
        sliderValue = document.getElementById('yearSlider').value;
    }
}, 15);
//hide layer
function hideLayer(layer) {
    for (obj of layer) {
        obj.remove();
    }
}
//show layer
function showLayer(layer) {
    for (obj of layer) {
        obj.addTo(map);
    }
}
//make leaflet polygon larger
function expandPolygon(polygon) {
    let x = 0,
        y = 0,
        total = 0;
    //getting centroid
    for (point of polygon) {
        x += point[0];
        y += point[1];
        total++;
    }
    x /= total;
    y /= total;

    let tempMarker = L.marker([x, y]).addTo(map);
    //getting leftmost point(W)
    let a = polygon[0][0];
    let b = polygon[0][1];
    for (point of polygon) {
        //stretch down
        if (point[0] > b) {
            //a = point[0];
            b = point[1];
        }
    }
    y = b;
    //y = b;
    let tempPoly = L.polygon(polygon, {
        color: 'blue',
        fillOpacity: 1
    }).addTo(map);
    //expanding shape
    polygon.forEach(point => {
        let px = point[0];
        let py = point[1];
        let dist = {
            x: px - x,
            y: py - y
        };
        let newDist = {
            x: dist.x * 1.1,
            y: dist.y * 1.1
        };
        //double distance from center
        let increment = 0.0000001;
        //recalculate x
        while (Math.abs(px - x) < Math.abs(newDist.x)) {
            if (px - x < 0) {
                px -= increment
            } else {
                px += increment;
            }
        }
        //recalculate y
        while (Math.abs(py - y) < Math.abs(newDist.y)) {
            if (py - y < 0) {
                py -= increment;
            } else {
                py += increment;
            }
        }
        //update coordinates
        point[0] = px;
        point[1] = py;
    });
    L.polygon(polygon, {
        color: 'red',
        fillOpacity: 1
    }).addTo(map);
    tempPoly.bringToFront();
    let x2 = 0,
        y2 = 0,
        total2 = 0;
    for (point of polygon) {
        x2 += point[0];
        y2 += point[1];
        total2++;
    }
    x2 /= total2;
    y2 /= total2;
    console.log('x: ' + x2 + ' y:' + y2);
    let marker = L.marker([x2, y2]).addTo(map);
    marker._icon.style.filter = "hue-rotate(120deg)";
}