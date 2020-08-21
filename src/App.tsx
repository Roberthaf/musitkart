import React from "react";
import "./App.css";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import points from "./points";
import axios from "axios";
import norwayPoints from "./NorwayPoints";

type Coordinates = {
  lat: number;
  lng: number;
  zoom?: number;
  info?: [
    {
      label: string;
      value: string;
    }
  ];
};
type MapDefaults = {
  center: [number,number];
  zoom: number;
  mapUrl: string;
  mapAttr: string;
};

function App() {
  
  const [incomingData, setIncomingData] = React.useState<any>(norwayPoints);
  const [mapPosition, setMapPosition] = React.useState<[number, number]>([
    59.957449,
    10.7336042,
  ]);

  const statKart = {
    mapUrl:
      "https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}",
    mapAttr: '<a href="http://www.kartverket.no/">Kartverket</a>',
  };

  const openStreetMap = {
    mapUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    mapAttr:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
  };

  const zoom = {
    center: 5,
    point: 8,
  };

  /*   
Add later
    const addMarker = (e:any) => {
    const tempMark = {lat: e.latlng.lat, lng: e.latlng.lng}
    setMarkers([...markers, tempMark]);
  }; 
const [markers, setMarkers] = React.useState<any>([]);  
*/

  const [mapDefaults, setmapDefaults] = React.useState({
    center: [64.104845, 11.777344],
    zoom: zoom.center,
    mapUrl: statKart.mapUrl,
    mapAttr: statKart.mapAttr,
  });

  const checkIfNorway = (
    points: Coordinates,
    mapDefaults: any,
    statKart: any,
    openStreetMap: any
  ) => {
    let url = `https://ws.geonorge.no/kommuneinfo/v1/punkt?nord=${points.lat}&ost=${points.lng}&koordsys=4326`;
    axios
      .get(url)
      .then((response) => {
        console.log(response);
        const info = response;
        if (info.status === 200) {
          setmapDefaults({
            ...mapDefaults,
            mapAttr: statKart.mapAttr,
            mapUrl: statKart.mapUrl,
            center: [points.lat, points.lng],
            zoom: zoom.point,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        setmapDefaults({
          ...mapDefaults,
          mapAttr: openStreetMap.mapAttr,
          mapUrl: openStreetMap.mapUrl,
          center: [points.lat, points.lng],
          zoom: zoom.point,
        });
      });
  };

  React.useEffect(() => {
    setMapPosition([incomingData[0].lat, incomingData[0].lng]);
    checkIfNorway(incomingData, mapDefaults, statKart, openStreetMap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomingData]);

  function positionOne() {
    setMapPosition([incomingData[0].lat, incomingData[0].lng]);
  }

  function positionTwo() {
    setMapPosition([incomingData[1].lat, incomingData[1].lng]);
  }

  return (
    <div className="App margin">
      <div>
        <button onClick={() => setIncomingData(norwayPoints)}>
          Change data points to NO
        </button>
        <button onClick={() => setIncomingData(points)}>
          Change data points to IS
        </button>
      </div>

      <div className="pointList">
        list of points
        <button onClick={positionOne}>{incomingData[0].info[0].value}</button>
        <button onClick={positionTwo}>{incomingData[1].info[0].value}</button>
      </div>

      <Map center={[mapPosition[0], mapPosition[1]]} zoom={13}>
        <TileLayer url={mapDefaults.mapUrl} attribution={mapDefaults.mapAttr} />
        {incomingData.map((mark: any, index: number) => (
          <Marker position={mark} key={"mark" + index}>
            <Popup>
              {mark.info ? ` ${mark.info[0].label} ${mark.info[0].value}` : ""}
            </Popup>
          </Marker>
        ))}
      </Map>
    </div>
  );
}

export default App;
