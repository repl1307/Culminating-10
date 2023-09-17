//all tilemaps (def = default)
//dark mode
const dark =
   L.tileLayer('https://{s}.tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=5I4VF5uK5VwpVn8TyVEla8YfhEY6Y0TRuYhuceprdvPbw1OfeVbRgT8VYebGunKO', {
	attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	maxZoom: 13,
	accessToken: '5I4VF5uK5VwpVn8TyVEla8YfhEY6Y0TRuYhuceprdvPbw1OfeVbRgT8VYebGunKO'
});
//light mode
const light =
   L.tileLayer('https://{s}.tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token=5I4VF5uK5VwpVn8TyVEla8YfhEY6Y0TRuYhuceprdvPbw1OfeVbRgT8VYebGunKO', {
	attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	maxZoom: 13,
	accessToken: '5I4VF5uK5VwpVn8TyVEla8YfhEY6Y0TRuYhuceprdvPbw1OfeVbRgT8VYebGunKO'
});
//sunny
const sunny =
   L.tileLayer('https://{s}.tile.jawg.io/jawg-sunny/{z}/{x}/{y}{r}.png?access-token=5I4VF5uK5VwpVn8TyVEla8YfhEY6Y0TRuYhuceprdvPbw1OfeVbRgT8VYebGunKO', {
	attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 13,
	accessToken: '5I4VF5uK5VwpVn8TyVEla8YfhEY6Y0TRuYhuceprdvPbw1OfeVbRgT8VYebGunKO'
});
//matrix
const matrix = 
  L.tileLayer('https://{s}.tile.jawg.io/jawg-matrix/{z}/{x}/{y}{r}.png?access-token=5I4VF5uK5VwpVn8TyVEla8YfhEY6Y0TRuYhuceprdvPbw1OfeVbRgT8VYebGunKO', {
	attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 13,
	accessToken: '5I4VF5uK5VwpVn8TyVEla8YfhEY6Y0TRuYhuceprdvPbw1OfeVbRgT8VYebGunKO'
});
//default
const def =
L.tileLayer('https://{s}.tile.jawg.io/jawg-terrain/{z}/{x}/{y}{r}.png?access-token=5I4VF5uK5VwpVn8TyVEla8YfhEY6Y0TRuYhuceprdvPbw1OfeVbRgT8VYebGunKO', {
  attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 13,
	accessToken: '5I4VF5uK5VwpVn8TyVEla8YfhEY6Y0TRuYhuceprdvPbw1OfeVbRgT8VYebGunKO'
});
const highlight = L.tileLayer('http://tile.mtbmap.cz/mtbmap_tiles/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &amp; USGS',
  maxZoom: 13
});
