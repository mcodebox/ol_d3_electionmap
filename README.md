# OpenLayers / D3 Election Map

A map that shows animated charts of election results of the Bundestagswahl 2013 (German federal election). Click on a state to see the results.
Charts and animations made with D3.js. Map made with OpenLayers.

(Wahlergebnisse der Bundestagswahl in Openlayers.)

## Used libraries and CSS

OpenLayers (4.1.1)
https://github.com/openlayers/openlayers

D3.js (4.8.0)
https://github.com/d3/d3

deutschlandGeoJSON
https://github.com/isellsoap/deutschlandGeoJSON
edited and fixed with http://mapshaper.org/

Election-Results/Wahlergebnisse
https://www.bundestag.de/blob/196098/15da5f046c74291b68e524afdf59d884/kapitel_01_08_wahlergebnis_nach_l__ndern__sitzverteilung_-data.pdf

Normalize.css (by necolas)
https://github.com/necolas/normalize.css

## To Do

- [x] Basic map
- [x] Add geoJSON
- [x] make geoJSON clickable
- [x] Create JSON with data
- [x] link JSON to geoJSON
- [x] add D3 Data
- [x] add labels
- [x] add animation
- [x] add change function
- [x] integrate chart in the map (overlay)


## Build
- run npm install
- run grunt create
- run grunt server
