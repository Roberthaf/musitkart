import React from "react";
import "./App.css";
//import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
//import { LatLngLiteral } from 'leaflet';
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
//import { Icon } from "leaflet";
//import * as parkData from "./data/skateboard-parks.json";
import points from "./points";

type Mark = {
  lat: number;
  lng: number;
  zoom?: number;
  info?: any;
};

type Markers = Array<[Mark]>

function App() {

/*    const startPosition: Mark = {
    lat: 51.505,
    lng: 0.09,
    zoom: 13
  }; */

/*   const marker: any = [
    {lat: 51.505,lng: 0.09} 
  ]; */

  const [markers, setMarkers] = React.useState<any>([])
  const addMarker = (e:any) => {
    const tempMark = {lat: e.latlng.lat, lng: e.latlng.lng}
    setMarkers([...markers, tempMark]);

  };

  function fetchData(data:any){
    data.forEach( (point:any) => {
      const tempMark = {lat: point.lat, lng: point.lng, info: point.info}
      setMarkers([...markers, tempMark])
    });
  }

/*   React.useEffect(() => {
    
  }, [markers]) */

  console.log(markers)  ;
  return (
    <div className="App margin">
      <button onClick={() => fetchData(points)}>fetch Data</button>
      <Map center={[58.128600587758164, 7.60631561279297]} zoom={16} onclick={(e)=> addMarker(e)}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {
        markers.map( (mark:any, index:number) => 
        <Marker position={mark} key={"mark"+index} > 
          <Popup>{mark.info[0] ? ` ${mark.info[0].label} ${mark.info[0].value}`: ''}</Popup> 
        </Marker>)
        }
        
      </Map>
    </div>
  );
}

export default App;



