import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { stores, getStoresByDistance, filterStores } from "../data/stores";

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
      <div class="relative w-10 h-10">
        <div class="${
          isSelected
            ? "bg-linear-to-br from-blue-500 to-purple-600 shadow-blue-500/50 scale-125"
            : "bg-blue-600 shadow-blue-500/30"
        } w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </div>
        ${
          isSelected
            ? '<div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-500 rotate-45"></div>'
            : ""
        }
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 45], // Center bottom anchor roughly
    popupAnchor: [0, -45],
  });
};

const StoreLocator = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [storeList, setStoreList] = useState(stores);
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

  useEffect(() => {
    let result = userLocation
      ? getStoresByDistance(userLocation.lat, userLocation.lng)
      : stores.map((s) => ({ ...s, distance: "--" }));
    result = filterStores(result, filters);
    // Simple search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.zip.includes(query) ||
          s.city.toLowerCase().includes(query),
      );
    }
    setStoreList(result);
  }, [userLocation, filters, searchQuery]);

  // Update map center when a store is selected
  useEffect(() => {
    if (selectedStore) {
      setMapCenter([selectedStore.lat, selectedStore.lng]);
      setMapZoom(15);
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
          // Fallback if denied
          const fallback = { lat: 27.7172, lng: 85.324 };
          setUserLocation(fallback);
          setMapCenter([fallback.lat, fallback.lng]);
          setIsLoading(false);
        },
      );
    } else {
      const fallback = { lat: 27.7172, lng: 85.324 };
      setUserLocation(fallback);
      setMapCenter([fallback.lat, fallback.lng]);
      setIsLoading(false);
    }
  };

  const toggleFilter = (filterName) =>
    setFilters((prev) => ({ ...prev, [filterName]: !prev[filterName] }));

  const filterButtons = [
    { id: "openNow", label: "Open Now", icon: "🕐" },
    { id: "wheelchairAccessible", label: "Accessible", icon: "♿" },
    { id: "freeParking", label: "Free Parking", icon: "🅿️" },
  ];

  return (
    <div className="min-h-screen hero-gradient">
      <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)]">
        {/* Left Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-[420px] flex-shrink-0 overflow-y-auto border-r border-border bg-background z-10"
        >
          <div className="p-6">
            <h1 className="text-3xl font-bold text-foreground font-display mb-8">
              Find a Showroom
            </h1>

            {/* Search */}
            <div className="relative mb-4">
              <svg
                className="w-5 h-5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Enter zip code or city"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-modern bg-secondary border-border text-foreground placeholder-muted-foreground pl-12"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUseMyLocation}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-xl border-2 border-blue-500/30 text-blue-400 font-medium hover:bg-blue-500/10 transition-all mb-6 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
              Use my location
            </motion.button>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              {filterButtons.map((filter) => (
                <motion.button
                  key={filter.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleFilter(filter.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    filters[filter.id]
                      ? "bg-linear-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25"
                      : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 border border-border"
                  }`}
                >
                  <span>{filter.icon}</span>
                  {filter.label}
                </motion.button>
              ))}
            </div>

            {/* Results Count */}
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
              {storeList.length} Locations Nearby
            </p>

            {/* Store List */}
            <div className="space-y-3">
              <AnimatePresence>
                {storeList.map((store, index) => (
                  <motion.div
                    key={store.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedStore(store)}
                    id={`store-card-${store.id}`}
                    className={`p-5 rounded-2xl cursor-pointer transition-all ${
                      selectedStore?.id === store.id
                        ? "glass-card border-blue-500/50 shadow-lg shadow-blue-500/10"
                        : "bg-secondary/50 border border-transparent hover:bg-secondary"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-foreground">
                        {store.name}
                      </h3>
                      <span className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-medium">
                        {store.distance} mi
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {store.address}, {store.city}, {store.state} {store.zip}
                    </p>
                    <p
                      className={`text-sm ${store.isOpen ? "text-emerald-500" : "text-red-500"}`}
                    >
                      {store.isOpen ? (
                        <>
                          <span className="font-medium">Open</span> • Closes{" "}
                          {store.closesAt}
                        </>
                      ) : (
                        <>
                          <span className="font-medium">Closed</span> • Opens{" "}
                          {store.opensAt}
                        </>
                      )}
                    </p>

                    <AnimatePresence>
                      {selectedStore?.id === store.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 flex gap-2"
                        >
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            className="flex-1 py-3 bg-linear-to-r from-blue-600 to-blue-500 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25"
                          >
                            View Details
                          </motion.button>
                          <motion.a
                            whileHover={{ scale: 1.05 }}
                            href={`https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-xl bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                            </svg>
                          </motion.a>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Right Panel - Real Map */}
        <div className="flex-1 relative z-0">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            className="w-full h-full"
            zoomControl={false}
          >
            {/* Dark theme tiles to match the app aesthetic */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            <MapController center={mapCenter} zoom={mapZoom} />

            {/* Store Markers */}
            {storeList.map((store) => (
              <Marker
                key={store.id}
                position={[store.lat, store.lng]}
                icon={createCustomIcon(selectedStore?.id === store.id)}
                eventHandlers={{
                  click: () => {
                    setSelectedStore(store);
                    const element = document.getElementById(
                      `store-card-${store.id}`,
                    );
                    if (element) {
                      element.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }
                  },
                }}
              >
                <Popup
                  className="custom-popup"
                  closeButton={false}
                  offset={[0, -20]}
                >
                  <div className="p-2 min-w-[150px]">
                    <h3 className="font-bold text-gray-900">{store.name}</h3>
                    <p className="text-xs text-gray-600">{store.address}</p>
                    <p
                      className={`text-xs font-medium mt-1 ${
                        store.isOpen ? "text-emerald-600" : "text-red-500"
                      }`}
                    >
                      {store.isOpen ? "Open Now" : "Closed"}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default StoreLocator;
