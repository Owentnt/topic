"use client";
import { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import countryData from "@/lib/data.json";
import { useEffect, useState } from "react";
const MAPBOX_TOKEN = "pk.eyJ1Ijoib3dlbnRudCIsImEiOiJjbTc0cm1vZnYwZTQ4MmpzYzc4dmlmbGI4In0.lejKLmn87SfgbIbaQJ0v8w";

export default function Home() {
    const [geoJsonData, setGeoJsonData] = useState(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            fetch("https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json")
                .then((response) => response.json())
                .then((data) => setGeoJsonData(data));
        }
    }, []);

    const center: LatLngExpression = [20, 0];

    return (
        <div className="flex flex-col items-end text-center p-6 me-20">
            {typeof window !== "undefined" && (
                <MapContainer center={center} zoom={2} style={{ height: "600px", width: "100%" }} className="z-[10]">
                    <TileLayer
                        url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`}
                    />

                    {geoJsonData && (
                        <GeoJSON
                            data={geoJsonData}
                            style={() => {
                                return {
                                    fillColor: "#DDD",
                                    weight: 1,
                                    opacity: 0.7,
                                    fillOpacity: 0.6,
                                };
                            }}
                            onEachFeature={(feature, layer) => {
                                const countryName = feature.properties.name;
                                const country = countryData.find((c) => c.name === countryName);

                                if (country) {
                                    layer.bindTooltip(
                                        `<div class="flex items-center gap-2">
                                            <img src="${country.flag}" alt="${country.name}" class="w-6 h-4" />
                                            <span>${country.name}</span>
                                        </div>`,
                                        { permanent: false, direction: "auto" }
                                    );
                                } else {
                                    layer.bindTooltip(countryName, { permanent: false, direction: "auto" });
                                }
                            }}
                        />
                    )}
                </MapContainer>
            )}
        </div>
    );
}