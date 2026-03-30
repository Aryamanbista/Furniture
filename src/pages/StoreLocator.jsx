import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { storesAPI } from "../services/api";
import { calculateDistance, filterStores } from "../data/stores";
import { useTheme } from "../context/ThemeContext";
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  ClockIcon,
  ChevronRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

// Custom hook to update map view when center changes
const MapController = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, {
        duration: 1.5,
      });
    }
  }, [center, zoom, map]);
  return null;
};

// Custom marker icon to match the theme
const createCustomIcon = (isSelected) => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div class="relative w-12 h-12 flex items-center justify-center">
        <div class="absolute inset-0 bg-primary/20 rounded-full animate-ping ${isSelected ? "block" : "hidden"}"></div>
        <div class="${
          isSelected
            ? "bg-primary text-primary-foreground shadow-2xl scale-125 ring-4 ring-primary/20"
            : "bg-background text-primary shadow-lg border-2 border-primary"
        } w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 transform-gpu z-10">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        </div>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 48],
    popupAnchor: [0, -48],
  });
};

const StoreLocator = () => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [allStores, setAllStores] = useState([]);
  const [storeList, setStoreList] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [filters, setFilters] = useState({
    openNow: false,
    wheelchairAccessible: false,
    freeParking: false,
  });
  const [selectedStore, setSelectedStore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState([27.7172, 85.324]); // Default Kathmandu
  const [mapZoom, setMapZoom] = useState(13);

  // Load stores from API on mount
  useEffect(() => {
    storesAPI
      .getAll()
      .then((data) => {
        setAllStores(data);
        setStoreList(data.map((s) => ({ ...s, distance: "--" })));
      })
      .catch((err) => console.error("Failed to load stores:", err));
  }, []);

  useEffect(() => {
    let result = userLocation
      ? allStores
          .map((store) => ({
            ...store,
            distance: calculateDistance(
              userLocation.lat,
              userLocation.lng,
              store.lat,
              store.lng,
            ),
          }))
          .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
      : allStores.map((s) => ({ ...s, distance: "--" }));
    result = filterStores(result, filters);
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.zip.toLowerCase().includes(query) ||
          s.city.toLowerCase().includes(query),
      );
    }
    setStoreList(result);
  }, [allStores, userLocation, filters, searchQuery]);

  useEffect(() => {
    if (selectedStore) {
      setMapCenter([selectedStore.lat, selectedStore.lng]);
      setMapZoom(16);
    }
  }, [selectedStore]);

  const handleUseMyLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newLocation = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setUserLocation(newLocation);
          setMapCenter([newLocation.lat, newLocation.lng]);
          setMapZoom(14);
          setIsLoading(false);
        },
        () => {
          setIsLoading(false);
        },
        { timeout: 10000 }
      );
    } else {
      setIsLoading(false);
    }
  };

  const toggleFilter = (filterName) =>
    setFilters((prev) => ({ ...prev, [filterName]: !prev[filterName] }));

  const filterButtons = [
    { id: "openNow", label: "Open Now", icon: <ClockIcon className="w-4 h-4" /> },
    { id: "wheelchairAccessible", label: "Accessible", icon: <CheckCircleIcon className="w-4 h-4" /> },
    { id: "freeParking", label: "Parking", icon: <MapPinIcon className="w-4 h-4" /> },
  ];

  const mapTileUrl = theme === "dark" 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  return (
    <div className="pt-20 h-screen bg-background overflow-hidden">
      <div className="flex flex-col lg:flex-row h-full">
        {/* Left Search Side */}
        <div className="w-full lg:w-[440px] flex flex-col bg-card border-r border-border h-full z-10 shadow-2xl">
          <div className="p-8 pb-4">
            <h1 className="text-4xl font-display font-medium text-foreground mb-2">Showrooms</h1>
            <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
              Find the nearest FurniHome showroom to experience our collections in person.
            </p>

            <div className="space-y-4">
              <div className="relative group">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Street, City, or Zip Code"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-2xl py-4 pl-12 pr-4 text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-background outline-none transition-all duration-300 shadow-sm"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleUseMyLocation}
                disabled={isLoading}
                className="w-full h-14 flex items-center justify-center gap-3 rounded-2xl bg-primary/5 border border-primary/20 text-primary font-semibold hover:bg-primary/10 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <MapPinIcon className="w-5 h-5" />
                )}
                <span>See stores near me</span>
              </motion.button>
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              {filterButtons.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => toggleFilter(filter.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-300 ${
                    filters[filter.id]
                      ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "bg-secondary/50 border-border text-muted-foreground hover:border-muted-foreground/30"
                  }`}
                >
                  {filter.icon}
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pt-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                {storeList.length} Showrooms Found
              </span>
            </div>

            <div className="space-y-4 pb-8">
              <AnimatePresence mode="popLayout">
                {storeList.map((store, i) => (
                  <motion.div
                    key={store.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedStore(store)}
                    id={`store-card-${store.id}`}
                    className={`group p-6 rounded-3xl border cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md ${
                      selectedStore?.id === store.id
                        ? "bg-primary/5 border-primary shadow-primary/10"
                        : "bg-card border-border hover:border-primary/30 hover:bg-secondary/20"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                            {store.name}
                        </h3>
                        <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                            store.distance === "--" ? "bg-secondary text-muted-foreground" : "bg-primary/10 text-primary"
                        }`}>
                             {store.distance} km
                        </span>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2">
                        {store.address}, {store.city}, {store.state} {store.zip}
                    </p>

                    <div className="flex items-center gap-4 text-xs">
                        <div className={`flex items-center gap-1.5 ${store.isOpen ? "text-emerald-500" : "text-red-500"}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${store.isOpen ? "bg-emerald-500" : "bg-red-500"} animate-pulse`} />
                            {store.isOpen ? `Open • Closes ${store.closesAt}` : `Closed • Opens ${store.opensAt}`}
                        </div>
                    </div>

                    <AnimatePresence>
                      {selectedStore?.id === store.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pt-6 mt-6 border-t border-primary/20 space-y-4"
                        >
                          <div className="flex gap-2">
                            <motion.a
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                href={`https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 h-12 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20"
                            >
                                <MapPinIcon className="w-4 h-4" />
                                Get Directions
                            </motion.a>
                            <button className="w-12 h-12 flex items-center justify-center bg-secondary rounded-xl text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                                <PhoneIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>

              {storeList.length === 0 && (
                <div className="text-center py-20 px-8">
                    <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                        <XMarkIcon className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <p className="text-foreground font-bold mb-1">No showrooms found</p>
                    <p className="text-muted-foreground text-sm">Try expanding your search or clearing filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Map - Interactive Section */}
        <div className="flex-1 relative bg-secondary/20">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            className="w-full h-full"
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url={mapTileUrl}
            />

            <MapController center={mapCenter} zoom={mapZoom} />

            {storeList.map((store) => (
              <Marker
                key={store.id}
                position={[store.lat, store.lng]}
                icon={createCustomIcon(selectedStore?.id === store.id)}
                eventHandlers={{
                  click: () => {
                    setSelectedStore(store);
                    const element = document.getElementById(`store-card-${store.id}`);
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                  },
                }}
              >
                <Popup
                  className="theme-popup"
                  closeButton={false}
                  offset={[0, -20]}
                >
                  <div className="p-4 min-w-[200px] rounded-2xl bg-card border border-border shadow-xl">
                    <h3 className="font-bold text-foreground mb-1 font-display">{store.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{store.address}</p>
                    <div className="flex items-center justify-between mt-2 pt-3 border-t border-border">
                        <div className={`text-[10px] font-bold uppercase inline-flex items-center gap-1.5 px-2 py-1 rounded-md ${
                            store.isOpen ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                        }`}>
                            {store.isOpen ? "Open" : "Closed"}
                        </div>
                        <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-bold text-primary uppercase hover:underline"
                        >
                            Get Directions
                        </a>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Map UI Elements */}
          <div className="absolute top-8 right-8 flex flex-col gap-2 z-50">
              <p className="bg-card/80 backdrop-blur-md border border-border px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-foreground shadow-lg">
                  Katmandu Region
              </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreLocator;
