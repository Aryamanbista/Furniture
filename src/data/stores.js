// Mock store location data
export const stores = [
  {
    id: 1,
    name: "Downtown Modern Furniture",
    address: "123 Maple Ave",
    city: "Seattle",
    state: "WA",
    zip: "98104",
    phone: "(206) 555-0123",
    lat: 47.6062,
    lng: -122.3321,
    hours: {
      monday: "10:00 AM - 9:00 PM",
      tuesday: "10:00 AM - 9:00 PM",
      wednesday: "10:00 AM - 9:00 PM",
      thursday: "10:00 AM - 9:00 PM",
      friday: "10:00 AM - 9:00 PM",
      saturday: "10:00 AM - 8:00 PM",
      sunday: "11:00 AM - 6:00 PM",
    },
    features: ["Wheelchair Accessible", "Free Parking", "Design Consultation"],
    isOpen: true,
    closesAt: "9:00 PM",
  },
  {
    id: 2,
    name: "Westside Showroom",
    address: "4509 Westlake Ave N",
    city: "Seattle",
    state: "WA",
    zip: "98109",
    phone: "(206) 555-0456",
    lat: 47.6505,
    lng: -122.3471,
    hours: {
      monday: "10:00 AM - 8:00 PM",
      tuesday: "10:00 AM - 8:00 PM",
      wednesday: "10:00 AM - 8:00 PM",
      thursday: "10:00 AM - 8:00 PM",
      friday: "10:00 AM - 8:00 PM",
      saturday: "10:00 AM - 6:00 PM",
      sunday: "Closed",
    },
    features: ["Wheelchair Accessible", "Design Consultation"],
    isOpen: true,
    closesAt: "8:00 PM",
  },
  {
    id: 3,
    name: "North Hills Gallery",
    address: "892 NE Northgate Way",
    city: "Seattle",
    state: "WA",
    zip: "98125",
    phone: "(206) 555-0789",
    lat: 47.7085,
    lng: -122.3257,
    hours: {
      monday: "10:00 AM - 7:00 PM",
      tuesday: "10:00 AM - 7:00 PM",
      wednesday: "10:00 AM - 7:00 PM",
      thursday: "10:00 AM - 7:00 PM",
      friday: "10:00 AM - 7:00 PM",
      saturday: "10:00 AM - 6:00 PM",
      sunday: "11:00 AM - 5:00 PM",
    },
    features: ["Free Parking", "Wheelchair Accessible"],
    isOpen: false,
    opensAt: "10:00 AM",
  },
  {
    id: 4,
    name: "Capitol Hill Studio",
    address: "1122 E Pike St",
    city: "Seattle",
    state: "WA",
    zip: "98122",
    phone: "(206) 555-0321",
    lat: 47.6143,
    lng: -122.3172,
    hours: {
      monday: "11:00 AM - 7:00 PM",
      tuesday: "11:00 AM - 7:00 PM",
      wednesday: "11:00 AM - 7:00 PM",
      thursday: "11:00 AM - 7:00 PM",
      friday: "11:00 AM - 8:00 PM",
      saturday: "10:00 AM - 8:00 PM",
      sunday: "12:00 PM - 6:00 PM",
    },
    features: ["Wheelchair Accessible", "Design Consultation"],
    isOpen: true,
    closesAt: "7:00 PM",
  },
  {
    id: 5,
    name: "Bellevue Design Center",
    address: "500 Bellevue Way NE",
    city: "Bellevue",
    state: "WA",
    zip: "98004",
    phone: "(425) 555-0654",
    lat: 47.6101,
    lng: -122.2015,
    hours: {
      monday: "10:00 AM - 9:00 PM",
      tuesday: "10:00 AM - 9:00 PM",
      wednesday: "10:00 AM - 9:00 PM",
      thursday: "10:00 AM - 9:00 PM",
      friday: "10:00 AM - 9:00 PM",
      saturday: "10:00 AM - 8:00 PM",
      sunday: "11:00 AM - 6:00 PM",
    },
    features: [
      "Wheelchair Accessible",
      "Free Parking",
      "Design Consultation",
      "Delivery Service",
    ],
    isOpen: true,
    closesAt: "9:00 PM",
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
