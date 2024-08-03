"use client"
import React from "react";
import styles from "./map.module.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function Map({ center, position, children }) {
  return (
    <>
      <MapContainer
        className={styles.map}
        center={center}
        zoom={15}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker styles={{ color : "red"}} position={position}>
          <Popup>set coffee</Popup>
        </Marker>
      </MapContainer>
      <div className={styles.details}>{children}</div>
    </>
  );
}

export default Map;
