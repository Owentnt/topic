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
    safetyStatus: string;
}

interface ModalProps {
    country: Country;
    onClose: () => void;
    onVisit: (country: Country) => void;
    onWish: (country: Country) => void;
    isVisited: boolean;
    isWishlisted: boolean;
}

const Modal: FC<ModalProps> = ({ country, onClose, onVisit, onWish, isVisited, isWishlisted }) => {
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

                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={() => onVisit(country)}
                            className={`px-4 py-2 rounded ${isVisited ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700"}`}
                        >
                            {isVisited ? "Visited" : "Mark as Visited"}
                        </button>
                        <button
                            onClick={() => onWish(country)}
                            className={`px-4 py-2 rounded ${isWishlisted ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"}`}
                        >
                            {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SafetyLegend = ({ showSafetyColors }: { showSafetyColors: boolean }) => {
    return (
        <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg z-[9999]">
            <h3 className="font-bold mb-2">{showSafetyColors ? "Safety Status" : "Default Colors"}</h3>
            {showSafetyColors ? (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        <span>Safe</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                        <span>Moderate</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                        <span>Risky</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                        <span>Dangerous</span>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
                        <span>Visited</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                        <span>Wishlisted</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                        <span>Default</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default function Home() {
    const [geoJsonData, setGeoJsonData] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
    const [visitedCountries, setVisitedCountries] = useState<Set<string>>(new Set());
    const [wishlistCountries, setWishlistCountries] = useState<Set<string>>(new Set());
    const [showLegend, setShowLegend] = useState(true);
    const [showSafetyColors, setShowSafetyColors] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            fetch("https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json")
                .then((response) => response.json())
                .then((data) => setGeoJsonData(data));
        }
    }, []);

    const handleVisit = (country: Country) => {
        setVisitedCountries((prev) => {
            const updated = new Set(prev);
            if (updated.has(country.name)) {
                updated.delete(country.name);
            } else {
                updated.add(country.name);
                wishlistCountries.delete(country.name);
            }
            return updated;
        });
    };

    const handleWish = (country: Country) => {
        setWishlistCountries((prev) => {
            const updated = new Set(prev);
            if (updated.has(country.name)) {
                updated.delete(country.name);
            } else {
                updated.add(country.name);
                visitedCountries.delete(country.name);
            }
            return updated;
        });
    };

    const getCountryColor = (countryName: string) => {
        const country = countryData.find((c) => c.name === countryName);
        if (!country) return "#DDD";

        if (showSafetyColors) {
            switch (country.safetyStatus) {
                case "green":
                    return "#4CAF50";
                case "yellow":
                    return "#FFEB3B";
                case "orange":
                    return "#FF9800";
                case "red":
                    return "#F44336";
                default:
                    return "#DDD";
            }
        } else {
            if (visitedCountries.has(countryName)) {
                return "pink";
            } else if (wishlistCountries.has(countryName)) {
                return "blue";
            } else {
                return "#DDD";
            }
        }
    };

    const center: LatLngExpression = [20, 0];

    return (
        <div className="flex flex-col items-end text-center p-6 me-20">
            {typeof window !== "undefined" && (
                <MapContainer center={center} zoom={2} style={{ height: "600px", width: "100%" }} className="z-[10]">
                    <TileLayer
                        url={`https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`}
                    />

                    {geoJsonData && (
                        <GeoJSON
                            data={geoJsonData}
                            style={(feature) => {
                                if (!feature) return {};
                                const countryName = feature.properties.name;
                                const fillColor = getCountryColor(countryName);
                                return {
                                    fillColor: fillColor,
                                    weight: 1,
                                    opacity: 0.7,
                                    fillOpacity: 0.6,
                                };
                            }}
                            onEachFeature={(feature, layer) => {
                                if (!feature) return;
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

                                layer.on("click", () => {
                                    if (country) {
                                        setSelectedCountry(country);
                                    }
                                });
                            }}
                        />
                    )}

                    <button
                        onClick={() => setShowLegend(!showLegend)}
                        className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow-lg z-[9999]"
                    >
                        {showLegend ? "Hide Legend" : "Show Legend"}
                    </button>

                    <button
                        onClick={() => setShowSafetyColors(!showSafetyColors)}
                        className="absolute top-16 right-4 bg-white p-2 rounded-lg shadow-lg z-[9999]"
                    >
                        {showSafetyColors ? "Show Default Colors" : "Show Safety Colors"}
                    </button>

                    {showLegend && <SafetyLegend showSafetyColors={showSafetyColors} />}
                </MapContainer>
            )}

            {selectedCountry && (
                <Modal
                    country={selectedCountry}
                    onClose={() => setSelectedCountry(null)}
                    onVisit={handleVisit}
                    onWish={handleWish}
                    isVisited={visitedCountries.has(selectedCountry.name)}
                    isWishlisted={wishlistCountries.has(selectedCountry.name)}
                />
            )}
        </div>
    );
}

