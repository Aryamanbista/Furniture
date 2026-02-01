// Mock store location data
export const stores = [
  {
    id: 1,
    name: "Durbar Marg Premium",
    address: "Kings Way, Durbar Marg",
    city: "Kathmandu",
    state: "Bagmati",
    zip: "44600",
    phone: "+977 1-4220000",
    lat: 27.712,
    lng: 85.3155,
    hours: {
      monday: "10:00 AM - 8:00 PM",
      tuesday: "10:00 AM - 8:00 PM",
      wednesday: "10:00 AM - 8:00 PM",
      thursday: "10:00 AM - 8:00 PM",
      friday: "10:00 AM - 9:00 PM",
      saturday: "10:00 AM - 8:00 PM",
      sunday: "11:00 AM - 7:00 PM",
    },
    features: ["Wheelchair Accessible", "Valet Parking", "Design Consultation"],
    isOpen: true,
    closesAt: "8:00 PM",
  },
  {
    id: 2,
    name: "Jhamsikhel Design Studio",
    address: "Jhamsikhel Road, Lalitpur",
    city: "Lalitpur",
    state: "Bagmati",
    zip: "44700",
    phone: "+977 1-5520000",
    lat: 27.674,
    lng: 85.3055,
    hours: {
      monday: "10:00 AM - 7:00 PM",
      tuesday: "10:00 AM - 7:00 PM",
      wednesday: "10:00 AM - 7:00 PM",
      thursday: "10:00 AM - 7:00 PM",
      friday: "10:00 AM - 7:00 PM",
      saturday: "Closed",
      sunday: "10:00 AM - 5:00 PM",
    },
    features: ["Wheelchair Accessible", "Design Consultation"],
    isOpen: true,
    closesAt: "7:00 PM",
  },
  {
    id: 3,
    name: "Lazimpat Modern",
    address: "Lazimpat, Embassy Road",
    city: "Kathmandu",
    state: "Bagmati",
    zip: "44600",
    phone: "+977 1-4410000",
    lat: 27.725,
    lng: 85.321,
    hours: {
      monday: "09:00 AM - 8:00 PM",
      tuesday: "09:00 AM - 8:00 PM",
      wednesday: "09:00 AM - 8:00 PM",
      thursday: "09:00 AM - 8:00 PM",
      friday: "09:00 AM - 8:00 PM",
      saturday: "10:00 AM - 6:00 PM",
      sunday: "10:00 AM - 6:00 PM",
    },
    features: ["Free Parking", "Wheelchair Accessible"],
    isOpen: true,
    closesAt: "8:00 PM",
  },
  {
    id: 4,
    name: "New Baneshwor Gallery",
    address: "Baneshwor Heights",
    city: "Kathmandu",
    state: "Bagmati",
    zip: "44600",
    phone: "+977 1-4780000",
    lat: 27.6915,
    lng: 85.34,
    hours: {
      monday: "10:00 AM - 8:00 PM",
      tuesday: "10:00 AM - 8:00 PM",
      wednesday: "10:00 AM - 8:00 PM",
      thursday: "10:00 AM - 8:00 PM",
      friday: "10:00 AM - 8:00 PM",
      saturday: "10:00 AM - 8:00 PM",
      sunday: "10:00 AM - 8:00 PM",
    },
    features: [
      "Wheelchair Accessible",
      "Design Consultation",
      "Delivery Service",
    ],
    isOpen: true,
    closesAt: "8:00 PM",
  },
  {
    id: 5,
    name: "Bhatbhateni Collection",
    address: "Bhatbhateni, Naxal",
    city: "Kathmandu",
    state: "Bagmati",
    zip: "44600",
    phone: "+977 1-4430000",
    lat: 27.72,
    lng: 85.335,
    hours: {
      monday: "09:30 AM - 8:30 PM",
      tuesday: "09:30 AM - 8:30 PM",
      wednesday: "09:30 AM - 8:30 PM",
      thursday: "09:30 AM - 8:30 PM",
      friday: "09:30 AM - 8:30 PM",
      saturday: "09:30 AM - 8:30 PM",
      sunday: "09:30 AM - 8:30 PM",
    },
    features: ["Wheelchair Accessible", "Free Parking", "Delivery Service"],
    isOpen: true,
    closesAt: "8:30 PM",
  },
];

// Calculate distance between two points using Haversine formula
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 3959; // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
};

// Sort stores by distance from user location
export const getStoresByDistance = (userLat, userLng) => {
  return stores
    .map((store) => ({
      ...store,
      distance: calculateDistance(userLat, userLng, store.lat, store.lng),
    }))
    .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
};

// Filter stores by features
export const filterStores = (storeList, filters) => {
  return storeList.filter((store) => {
    if (filters.openNow && !store.isOpen) return false;
    if (
      filters.wheelchairAccessible &&
      !store.features.includes("Wheelchair Accessible")
    )
      return false;
    if (filters.freeParking && !store.features.includes("Free Parking"))
      return false;
    return true;
  });
};
