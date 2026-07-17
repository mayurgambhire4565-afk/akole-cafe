import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Navigation, MapPin, Layers, Compass, ZoomIn, ZoomOut, Maximize, RefreshCw } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTranslation } from '@/store/languageStore';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CAFE_LAT = 19.5446;
const CAFE_LNG = 74.0044;

export default function LocationModal({ isOpen, onClose }: LocationModalProps) {
  const { t } = useTranslation();
  const [mapType, setMapType] = useState<'normal' | 'satellite'>('satellite');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [routingInfo, setRoutingInfo] = useState<{
    distance: string;
    duration: string;
    eta: string;
  } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Café Logo Icon for the map marker
  const cafeIcon = L.divIcon({
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-10 h-10 rounded-full overflow-hidden border-2 border-[#D4AF37] bg-[#3D2015] shadow-lg animate-bounce flex items-center justify-center">
          <img src="/gold-logo.png" class="w-full h-full object-cover" />
        </div>
        <div class="w-3.5 h-3.5 bg-[#D4AF37] rounded-full mt-10 shadow-inner"></div>
      </div>
    `,
    className: 'custom-cafe-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  // User location icon (glowing blue beacon)
  const userIcon = L.divIcon({
    html: `
      <div class="relative flex items-center justify-center">
        <div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg z-10"></div>
        <div class="absolute w-8 h-8 bg-blue-400 rounded-full animate-ping opacity-60"></div>
      </div>
    `,
    className: 'custom-user-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  // Calculate route using OSRM API
  const getDirections = async (userLat: number, userLng: number) => {
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${userLng},${userLat};${CAFE_LNG},${CAFE_LAT}?overview=full&geometries=geojson`
      );
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const distanceKm = (route.distance / 1000).toFixed(1);
        const durationMins = Math.round(route.duration / 60);

        // Calculate ETA
        const etaDate = new Date();
        etaDate.setMinutes(etaDate.getMinutes() + durationMins);
        const etaStr = etaDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        setRoutingInfo({
          distance: `${distanceKm} km`,
          duration: `${durationMins} mins`,
          eta: etaStr,
        });

        // Draw polyline on the map
        if (mapRef.current) {
          if (routeLineRef.current) {
            mapRef.current.removeLayer(routeLineRef.current);
          }

          // GeoJSON coordinates are [lng, lat], Leaflet wants [lat, lng]
          const latLngs = route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);

          routeLineRef.current = L.polyline(latLngs, {
            color: '#D4AF37',
            weight: 5,
            opacity: 0.8,
            lineCap: 'round',
          }).addTo(mapRef.current);

          // Adjust camera to fit both positions
          mapRef.current.fitBounds(routeLineRef.current.getBounds(), {
            padding: [60, 60],
          });
        }
      }
    } catch (error) {
      console.error('Directions service failed', error);
    }
  };

  // Start watching geolocation
  const startTracking = () => {
    if (!('geolocation' in navigator)) {
      setLocationError('Geolocation not supported by this browser.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    // Initial query
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserLocation([lat, lng]);
        setIsLocating(false);

        if (mapRef.current) {
          if (userMarkerRef.current) {
            userMarkerRef.current.setLatLng([lat, lng]);
          } else {
            userMarkerRef.current = L.marker([lat, lng], { icon: userIcon }).addTo(mapRef.current);
          }
          getDirections(lat, lng);
        }
      },
      (err) => {
        console.error('Initial geoloc error', err);
        setIsLocating(false);
        if (err.code === 1) {
          setLocationError('Location permission denied. Please allow GPS access.');
        } else {
          setLocationError('Unable to retrieve GPS coordinates.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );

    // Continuous watch
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserLocation([lat, lng]);

        if (mapRef.current) {
          if (userMarkerRef.current) {
            userMarkerRef.current.setLatLng([lat, lng]);
          } else {
            userMarkerRef.current = L.marker([lat, lng], { icon: userIcon }).addTo(mapRef.current);
          }
          getDirections(lat, lng);
        }
      },
      (err) => {
        console.error('Continuous watch error', err);
      },
      { enableHighAccuracy: true }
    );
  };

  // Recenter map bounds
  const recenter = () => {
    if (!mapRef.current) return;
    if (userLocation) {
      const bounds = L.latLngBounds([userLocation, [CAFE_LAT, CAFE_LNG]]);
      mapRef.current.fitBounds(bounds, { padding: [60, 60] });
    } else {
      mapRef.current.setView([CAFE_LAT, CAFE_LNG], 15);
    }
  };

  const zoomIn = () => mapRef.current?.zoomIn();
  const zoomOut = () => mapRef.current?.zoomOut();

  const resetCompass = () => {
    if (mapRef.current) {
      mapRef.current.setView(mapRef.current.getCenter(), mapRef.current.getZoom());
    }
  };

  // Toggle tile styles between Google Maps Roads and Hybrid
  const toggleMapType = () => {
    if (!mapRef.current || !tileLayerRef.current) return;
    mapRef.current.removeLayer(tileLayerRef.current);

    const nextType = mapType === 'normal' ? 'satellite' : 'normal';
    setMapType(nextType);

    const url = nextType === 'satellite'
      ? 'https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
      : 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';

    tileLayerRef.current = L.tileLayer(url, {
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: 'Google Maps',
      noWrap: false,
    }).addTo(mapRef.current);
  };

  // Initialize Map Component
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
      minZoom: 1,
      worldCopyJump: true,
      bounceAtZoomLimits: false,
    }).setView([CAFE_LAT, CAFE_LNG], 2);

    mapRef.current = map;

    const tileLayerUrl = mapType === 'satellite'
      ? 'https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
      : 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';

    tileLayerRef.current = L.tileLayer(tileLayerUrl, {
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: 'Google Maps',
      noWrap: false,
    }).addTo(map);

    // Add Cafe Marker with custom Cafe Logo
    L.marker([CAFE_LAT, CAFE_LNG], { icon: cafeIcon }).addTo(map)
      .bindPopup('<b class="text-forest-900 font-bold text-sm">Akole Café</b><br/><span class="text-xs text-[#3C2415]/70">Brewing Connections, Serving Memories</span>')
      .openPopup();

    // Invalidate size after animation completes
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 450);

    startTracking();

    return () => {
      clearTimeout(timer);
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isOpen]);

  const startNavigation = () => {
    if (userLocation) {
      recenter();
    } else {
      startTracking();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-5xl h-[85vh] bg-[#FDFBF7] dark:bg-[#0B150F] rounded-[32px] shadow-2xl border border-white/20 dark:border-white/5 flex flex-col md:flex-row overflow-hidden transition-colors duration-300"
          >
            {/* Sidebar Details Panel */}
            <div className="w-full md:w-80 bg-[#F5F3E9] dark:bg-[#112017] p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#3C2415]/10 dark:border-white/5 transition-colors duration-300">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold font-display text-[#1A3324] dark:text-[#FDFBF7]">Live Directions</h3>
                  <button onClick={onClose} className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-[#3C2415]/60 dark:text-cream-200/60 md:hidden">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Destination Info */}
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-[#1A3324] text-[#D4AF37] rounded-xl shadow-sm">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-[#3C2415]/60 dark:text-cream-200/60 font-semibold uppercase tracking-wider">{t('destination')}</p>
                      <p className="text-sm font-bold text-[#1A3324] dark:text-[#FDFBF7]">Akole Café, Akole</p>
                      <p className="text-[11px] text-[#3C2415]/50 dark:text-cream-200/40">Shop No 1, Akole, Maharashtra</p>
                    </div>
                  </div>

                  {/* User Live Location Info */}
                  <div className="flex items-start gap-3 border-t border-[#3C2415]/5 dark:border-white/5 pt-4">
                    <div className={`p-2.5 rounded-xl shadow-sm ${userLocation ? 'bg-blue-500 text-white' : 'bg-amber-500/10 text-amber-500'}`}>
                      <Navigation className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <p className="text-xs text-[#3C2415]/60 dark:text-cream-200/60 font-semibold uppercase tracking-wider">{t('yourPosition')}</p>
                      {userLocation ? (
                        <>
                          <p className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span> {t('liveTrackingActive')}
                          </p>
                          <p className="text-[10px] text-[#3C2415]/50 dark:text-cream-200/40">Lat: {userLocation[0].toFixed(4)}, Lng: {userLocation[1].toFixed(4)}</p>
                        </>
                      ) : (
                        <div>
                          <p className="text-sm font-bold text-amber-600 dark:text-amber-400">
                            {isLocating ? t('connectingGps') : t('gpsInactive')}
                          </p>
                          {locationError && (
                            <p className="text-[11px] text-red-500 font-medium leading-tight mt-1">{locationError}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Routing calculations */}
                  {routingInfo ? (
                    <div className="bg-white dark:bg-white/5 border border-[#3C2415]/5 dark:border-white/5 rounded-2xl p-4 space-y-3 mt-4 shadow-sm">
                      <div>
                        <p className="text-xs text-[#3C2415]/60 dark:text-cream-200/60 font-medium">{t('drivingDistance')}</p>
                        <p className="text-2xl font-black text-[#1A3324] dark:text-[#D4AF37] tracking-tight">{routingInfo.distance}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 border-t border-[#3C2415]/5 dark:border-white/5 pt-2">
                        <div>
                          <p className="text-xs text-[#3C2415]/60 dark:text-cream-200/60 font-medium">{t('estDrive')}</p>
                          <p className="text-base font-bold text-[#1A3324] dark:text-[#FDFBF7]">{routingInfo.duration}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#3C2415]/60 dark:text-cream-200/60 font-medium">ETA</p>
                          <p className="text-base font-bold text-[#1A3324] dark:text-[#FDFBF7]">{routingInfo.eta}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    !userLocation && !isLocating && (
                      <button
                        onClick={startTracking}
                        className="w-full flex items-center justify-center gap-1.5 border border-dashed border-[#3C2415]/30 dark:border-white/20 text-xs py-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-medium mt-4"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> {t('enableGps')}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="space-y-3 mt-6">
                <button
                  onClick={startNavigation}
                  className="w-full flex items-center justify-center gap-2 bg-[#1A3324] dark:bg-[#D4AF37] text-white dark:text-[#112017] font-bold text-sm uppercase tracking-wider py-3.5 rounded-xl shadow-lg hover:opacity-95 transition-opacity"
                >
                  <Navigation className="w-4 h-4 fill-current" /> {t('startNavigation')}
                </button>
                <button
                  onClick={recenter}
                  className="w-full flex items-center justify-center gap-2 border border-[#3C2415]/15 dark:border-white/10 text-[#3C2415] dark:text-cream-100 font-semibold text-sm py-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <Maximize className="w-4 h-4" /> {t('recenterMap')}
                </button>
              </div>
            </div>

            {/* Live Interactive Map Area */}
            <div className="flex-1 relative h-full">
              <div ref={mapContainerRef} className="w-full h-full z-0" />

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2.5 bg-[#FDFBF7] dark:bg-[#112017] border border-[#3C2415]/10 dark:border-white/10 rounded-full shadow-lg text-[#3C2415] dark:text-cream-100 hover:bg-cream-100 dark:hover:bg-[#1A3324] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Map Floating Controls */}
              <div className="absolute right-4 bottom-4 z-10 flex flex-col gap-2">
                <button
                  onClick={toggleMapType}
                  className="p-2.5 bg-white dark:bg-[#112017] border border-[#3C2415]/10 dark:border-white/10 rounded-xl shadow-lg text-[#3C2415] dark:text-cream-100 hover:bg-[#1A3324] dark:hover:bg-[#1A3324] hover:text-white transition-colors flex items-center gap-1.5 font-bold text-xs"
                >
                  <Layers className="w-4 h-4" /> {mapType === 'normal' ? t('satellite') : t('normal')}
                </button>
                <div className="flex flex-col rounded-xl overflow-hidden shadow-lg border border-[#3C2415]/10 dark:border-white/10 bg-white dark:bg-[#112017]">
                  <button onClick={zoomIn} className="p-2.5 border-b border-[#3C2415]/10 dark:border-white/10 text-[#3C2415] dark:text-cream-100 hover:bg-cream-50 dark:hover:bg-white/5">
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button onClick={zoomOut} className="p-2.5 text-[#3C2415] dark:text-cream-100 hover:bg-cream-50 dark:hover:bg-white/5">
                    <ZoomOut className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={resetCompass}
                  className="p-2.5 bg-white dark:bg-[#112017] border border-[#3C2415]/10 dark:border-white/10 rounded-xl shadow-lg text-[#3C2415] dark:text-cream-100 hover:bg-cream-50 dark:hover:bg-white/5 transition-colors"
                  title="Compass"
                >
                  <Compass className="w-4 h-4 animate-spin-slow" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
