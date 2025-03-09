"use client";
import { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import countryData from "@/lib/data.json";
import { useEffect, useState, FC } from "react";
import { X } from "lucide-react";
import Flag from "react-world-flags";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const MAPBOX_TOKEN = "pk.eyJ1Ijoib3dlbnRudCIsImEiOiJjbTc0cm1vZnYwZTQ4MmpzYzc4dmlmbGI4In0.lejKLmn87SfgbIbaQJ0v8w";

interface Country {
    name: string;
    flag: string;
    timezone: string;
    images: string[];
    capital: string;
    region: string;
    population: number;
    area: number;
    languages: string[];
    borders: string[];
    currency: string;
    gdp: number;
    callingCode: string;
    dangerExplanation: string;
}

interface ModalProps {
    country: Country;
    onClose: () => void;
}

const Modal: FC<ModalProps> = ({ country, onClose }) => {



    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-[9999]">
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-xl w-full relative max-h-[80vh] z-[99999]">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition">
                    <X size={20} />
                </button>
                <div className="modal-content max-h-[75vh] overflow-y-auto p-2">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <h2 className="text-2xl font-bold flex items-center">
                            {country.name}
                            <Flag code={country.flag} className="ml-2" style={{ width: "30px", height: "20px" }} />
                        </h2>
                    </div>

                    <div className="space-y-2 text-gray-700">
                        <p><strong>Capital:</strong> {country.capital}</p>
                        <p><strong>Region:</strong> {country.region}</p>
                        <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
                        <p><strong>Area:</strong> {country.area.toLocaleString()} km²</p>
                        <p><strong>Languages:</strong> {country.languages.join(", ")}</p>
                        <p><strong>Borders:</strong> {country.borders.length ? country.borders.join(", ") : "None"}</p>
                        <p><strong>Currency:</strong> {country.currency}</p>
                        <p><strong>GDP:</strong> ${country.gdp.toLocaleString()} billion</p>
                        <p><strong>Calling Code:</strong> {country.callingCode}</p>
                        <p>{country.dangerExplanation}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Home() {
    const [geoJsonData, setGeoJsonData] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null); // State for the selected country

    // Fetch GeoJSON data
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

                    {/* Render GeoJSON data */}
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

                                // Bind tooltip with country name and flag
                                if (country) {
                                    layer.bindTooltip(
                                        `<div class="flex items-center gap-2">
                                            <Image src="${country.flag}" alt="${country.name}" class="w-6 h-4" />
                                            <span>${country.name}</span>
                                        </div>`,
                                        { permanent: false, direction: "auto" }
                                    );
                                } else {
                                    layer.bindTooltip(countryName, { permanent: false, direction: "auto" });
                                }

                                // Open modal when a country is clicked
                                layer.on("click", () => {
                                    if (country) {
                                        setSelectedCountry(country);
                                    }
                                });
                            }}
                        />
                    )}
                </MapContainer>
            )}

            {selectedCountry && (
                <Modal
                    country={selectedCountry}
                    onClose={() => setSelectedCountry(null)} // Close the modal
                />
            )}
        </div>
    );
}