import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { MapPin, Plus, Trash2, Edit2, Check, MapPinOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/api/axios';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';

type AddressFormData = {
  label: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
};

export default function AddressesPage() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any | null>(null);
  const [detecting, setDetecting] = useState(false);
  
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchingSuggestions, setSearchingSuggestions] = useState(false);
  const debounceTimer = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<AddressFormData>();
  const watchLabel = watch('label', 'Home');

  const [mapLoaded, setMapLoaded] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [satelliteMode, setSatelliteMode] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<any>(null);
  const leafletMarkerRef = useRef<any>(null);
  const streetLayerRef = useRef<any>(null);
  const satelliteLayerRef = useRef<any>(null);

  const toggleMapType = () => {
    if (!leafletMapRef.current || !streetLayerRef.current || !satelliteLayerRef.current) return;
    if (satelliteMode) {
      leafletMapRef.current.removeLayer(satelliteLayerRef.current);
      streetLayerRef.current.addTo(leafletMapRef.current);
      setSatelliteMode(false);
    } else {
      leafletMapRef.current.removeLayer(streetLayerRef.current);
      satelliteLayerRef.current.addTo(leafletMapRef.current);
      setSatelliteMode(true);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleOutsideClick = () => {
      if (showSuggestions) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [showSuggestions]);

  // Load Leaflet dynamically
  useEffect(() => {
    if (!showMap) return;
    if ((window as any).L) {
      setMapLoaded(true);
      return;
    }

    // Add CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // Add JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      setMapLoaded(true);
    };
    document.head.appendChild(script);
  }, [showMap]);

  const reverseGeocode = async (lat: number, lon: number) => {
    setGeocoding(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
      );
      const data = await res.json();
      if (data && data.address) {
        const addr = data.address;
        const streetParts = [
          addr.house_number,
          addr.road,
          addr.suburb,
          addr.neighbourhood,
          addr.village
        ].filter(Boolean);
        
        const streetName = streetParts.length > 0 ? streetParts.join(', ') : data.display_name;
        const cityName = addr.city || addr.town || addr.village || addr.municipality || '';
        const stateName = addr.state || '';
        const postcodeVal = addr.postcode || '';

        setValue('street', streetName, { shouldValidate: true });
        setValue('city', cityName, { shouldValidate: true });
        setValue('state', stateName, { shouldValidate: true });
        setValue('pincode', postcodeVal, { shouldValidate: true });
      }
    } catch (err) {
      console.error('Reverse geocoding failed:', err);
    } finally {
      setGeocoding(false);
    }
  };

  // Map Initialization Effect
  useEffect(() => {
    if (!mapLoaded || !showMap || !mapContainerRef.current) return;

    let initLat = 19.54;
    let initLon = 74.00;

    const L = (window as any).L;
    if (!L) return;

    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
    }

    const streetLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      attribution: '&copy; Google Maps'
    });

    const satelliteLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      attribution: '&copy; Google Maps'
    });

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      scrollWheelZoom: true
    }).setView([initLat, initLon], 14);

    if (satelliteMode) {
      satelliteLayer.addTo(map);
    } else {
      streetLayer.addTo(map);
    }

    streetLayerRef.current = streetLayer;
    satelliteLayerRef.current = satelliteLayer;

    const marker = L.marker([initLat, initLon], {
      draggable: true
    }).addTo(map);

    leafletMapRef.current = map;
    leafletMarkerRef.current = marker;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.setView([latitude, longitude], 15);
          marker.setLatLng([latitude, longitude]);
          reverseGeocode(latitude, longitude);
        },
        () => {
          reverseGeocode(initLat, initLon);
        }
      );
    } else {
      reverseGeocode(initLat, initLon);
    }

    marker.on('dragend', () => {
      const position = marker.getLatLng();
      reverseGeocode(position.lat, position.lng);
    });

    map.on('click', (e: any) => {
      marker.setLatLng(e.latlng);
      reverseGeocode(e.latlng.lat, e.latlng.lng);
    });

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [mapLoaded, showMap]);

  const handleStreetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (value.trim().length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceTimer.current = setTimeout(async () => {
      setSearchingSuggestions(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&addressdetails=1&countrycodes=in&limit=5`
        );
        const data = await res.json();
        if (Array.isArray(data)) {
          setSuggestions(data);
          setShowSuggestions(data.length > 0);
        }
      } catch (err) {
        console.error('Failed to fetch address suggestions', err);
      } finally {
        setSearchingSuggestions(false);
      }
    }, 400);
  };

  const handleSelectSuggestion = (suggestion: any) => {
    const addr = suggestion.address;
    if (!addr) return;

    const streetParts = [
      addr.house_number,
      addr.road,
      addr.suburb,
      addr.neighbourhood,
      addr.village
    ].filter(Boolean);
    
    const streetName = streetParts.length > 0 ? streetParts.join(', ') : suggestion.name;
    const cityName = addr.city || addr.town || addr.village || addr.municipality || '';
    const stateName = addr.state || '';
    const postcodeVal = addr.postcode || '';

    setValue('street', streetName, { shouldValidate: true });
    setValue('city', cityName, { shouldValidate: true });
    setValue('state', stateName, { shouldValidate: true });
    setValue('pincode', postcodeVal, { shouldValidate: true });

    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          const data = await res.json();
          if (data && data.address) {
            const addr = data.address;
            const streetParts = [
              addr.house_number,
              addr.road,
              addr.suburb,
              addr.neighbourhood,
              addr.village
            ].filter(Boolean);
            
            const streetName = streetParts.length > 0 ? streetParts.join(', ') : data.display_name;
            const cityName = addr.city || addr.town || addr.village || addr.municipality || '';
            const stateName = addr.state || '';
            const postcodeVal = addr.postcode || '';

            setValue('street', streetName, { shouldValidate: true });
            setValue('city', cityName, { shouldValidate: true });
            setValue('state', stateName, { shouldValidate: true });
            setValue('pincode', postcodeVal, { shouldValidate: true });
            
            toast.success('Location detected!');
          } else {
            toast.error('Could not resolve your coordinates to address');
          }
        } catch (error) {
          console.error(error);
          toast.error('Failed to retrieve address details');
        } finally {
          setDetecting(false);
        }
      },
      (error) => {
        console.error(error);
        if (error.code === 1) {
          toast.error('Location access is blocked. Please click the lock/settings icon next to the URL in your browser search bar to allow location permissions.');
        } else {
          toast.error(error.message || 'Failed to detect location');
        }
        setDetecting(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const res = await api.get('/addresses');
      return res.data.data.addresses || [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: AddressFormData) => {
      if (editingAddress) {
        const res = await api.put(`/addresses/${editingAddress.id}`, data);
        return res.data;
      } else {
        const res = await api.post('/addresses', data);
        return res.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success(editingAddress ? 'Address updated' : 'Address added');
      closeModal();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to save address');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/addresses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address deleted');
    },
    onError: () => {
      toast.error('Failed to delete address');
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.put(`/addresses/${id}`, { isDefault: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Default address updated');
    },
  });

  const openAddModal = () => {
    setEditingAddress(null);
    reset({
      label: 'Home',
      name: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false,
    });
    setIsOpen(true);
  };

  const openEditModal = (address: any) => {
    setEditingAddress(address);
    reset({
      label: address.label || 'Home',
      name: address.name,
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      isDefault: address.isDefault,
    });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditingAddress(null);
    setSuggestions([]);
    setShowSuggestions(false);
    setShowMap(false);
  };

  const onSubmit = (data: AddressFormData) => {
    saveMutation.mutate(data);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 120, damping: 14 } }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white dark:bg-coffee-900/20 p-6 rounded-3xl border border-coffee-100 dark:border-gold-500/10 space-y-4">
              <Skeleton className="h-6 w-16 rounded-md" />
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
              <div className="pt-4 border-t border-coffee-100 dark:border-gold-500/10 flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gold-500/10 text-gold-600 dark:text-gold-400 border border-gold-500/20 mb-2">
            ✦ LOCATIONS
          </span>
          <h1 className="text-3xl font-display font-bold text-coffee-950 dark:text-cream-50">My Addresses</h1>
          <p className="text-coffee-500 dark:text-coffee-400 text-sm">Manage your delivery and billing locations.</p>
        </div>
        <button
          onClick={openAddModal}
          className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-forest-500 to-forest-600 hover:from-forest-600 hover:to-forest-700 text-white px-5 py-3 rounded-xl font-bold transition-all duration-300 text-sm self-start sm:self-auto shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
          <span>Add Address</span>
        </button>
      </div>

      {addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address: any) => (
            <motion.div
              key={address.id}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`bg-white dark:bg-coffee-900/40 dark:backdrop-blur-md p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between relative shadow-sm hover:shadow-coffee/5 ${
                address.isDefault
                  ? 'border-forest-500 ring-1 ring-forest-500/25'
                  : 'border-coffee-100 dark:border-gold-500/10 hover:border-gold-500/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex px-3 py-1 rounded-xl text-xs font-bold bg-gold-500/10 text-gold-600 dark:text-gold-400 border border-gold-500/15">
                    {address.label || 'Home'}
                  </span>
                  {address.isDefault && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-600 dark:text-forest-400">
                      <Check className="w-4 h-4" /> Default
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-lg text-coffee-950 dark:text-cream-100 font-display mb-1">{address.name}</h3>
                <p className="text-coffee-500 dark:text-coffee-400 text-xs font-medium mb-3">{address.phone}</p>
                <p className="text-coffee-600 dark:text-cream-200 text-sm leading-relaxed">
                  {address.street}, {address.city}, {address.state} - {address.pincode}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-coffee-100 dark:border-gold-500/10 flex items-center justify-between gap-4">
                {!address.isDefault ? (
                  <button
                    onClick={() => setDefaultMutation.mutate(address.id)}
                    className="text-xs font-bold text-coffee-500 hover:text-forest-600 dark:hover:text-gold-400 transition-colors uppercase tracking-wider"
                  >
                    Set as Default
                  </button>
                ) : (
                  <span className="text-xs font-bold text-forest-600 dark:text-forest-400 uppercase tracking-wider">Primary Address</span>
                )}

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => openEditModal(address)}
                    className="p-2 rounded-xl border border-coffee-100 dark:border-gold-500/10 text-coffee-600 dark:text-cream-300 hover:border-gold-500/30 hover:text-forest-600 dark:hover:text-gold-450 hover:bg-coffee-50/50 dark:hover:bg-coffee-950/30 transition-all duration-205"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(address.id)}
                    className="p-2 rounded-xl border border-red-100 dark:border-red-950/20 text-red-500 hover:bg-red-500 hover:text-white dark:hover:bg-red-950/25 transition-all duration-205"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div 
          variants={itemVariants}
          className="text-center py-16 px-6 bg-white dark:bg-coffee-900/40 dark:backdrop-blur-md rounded-3xl border border-dashed border-coffee-200 dark:border-gold-500/20 shadow-sm max-w-xl mx-auto"
        >
          <div className="w-20 h-20 bg-coffee-50 dark:bg-coffee-950 rounded-full flex items-center justify-center mx-auto mb-6 border border-coffee-100 dark:border-gold-500/10 relative">
            <MapPinOff className="w-10 h-10 text-coffee-400 dark:text-coffee-600 animate-bounce-subtle" />
            <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-gold-500 border-2 border-white dark:border-coffee-900"></div>
          </div>
          
          <h3 className="text-2xl font-display font-bold text-coffee-950 dark:text-cream-50 mb-3">No addresses saved</h3>
          <p className="text-coffee-500 dark:text-coffee-400 text-sm max-w-sm mx-auto mb-8 leading-relaxed">
            Add a delivery address to ensure faster checkout for your future premium coffee cravings.
          </p>
          
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-forest-500 to-forest-600 hover:from-forest-600 hover:to-forest-700 text-white font-bold px-8 py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Address</span>
          </button>
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={closeModal} 
            />

            {/* Modal Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', duration: 0.35 }}
              className="bg-white dark:bg-[#0F1E15] rounded-3xl p-7 max-w-lg w-full relative z-10 border-t-4 border-t-[#D4AF37] border-x border-b border-coffee-100 dark:border-forest-500/10 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button 
                onClick={closeModal}
                className="absolute top-5 right-5 text-coffee-400 hover:text-coffee-700 dark:hover:text-cream-100 transition-colors p-1.5 rounded-full hover:bg-coffee-50 dark:hover:bg-white/5 cursor-pointer"
                aria-label="Close dialog"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <h2 className="font-display font-bold text-2xl text-coffee-900 dark:text-cream-50 mb-6 pr-8">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Tag Selection */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-coffee-800 dark:text-cream-200 uppercase tracking-wider">Address Tag</label>
                  <div className="flex gap-2">
                    {['Home', 'Work', 'Other'].map((tag) => {
                      const isSelected = watchLabel === tag;
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setValue('label', tag, { shouldValidate: true })}
                          className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#3D2015] dark:bg-[#D4AF37] border-transparent text-white dark:text-[#3D2015] shadow-sm'
                              : 'bg-white dark:bg-[#0B150F] border-coffee-100 dark:border-forest-500/15 text-coffee-600 dark:text-cream-200 hover:bg-coffee-50 dark:hover:bg-white/5'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                  <input type="hidden" {...register('label', { required: 'Label is required' })} />
                  {errors.label && <p className="text-red-500 text-xs mt-1">{errors.label.message}</p>}
                </div>

                {/* Recipient Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Recipient Name"
                    placeholder="Enter recipient name"
                    {...register('name', { required: 'Name is required' })}
                    error={errors.name?.message}
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="Enter phone number"
                    {...register('phone', { required: 'Phone is required' })}
                    error={errors.phone?.message}
                  />
                </div>

                {/* Street Address */}
                {(() => {
                  const { onChange: formOnChange, ref: streetRef, ...streetReg } = register('street', { required: 'Street is required' });
                  return (
                    <div className="relative">
                      <Input
                        label="Street Address / Area"
                        placeholder="Start typing your address (e.g. MG Road, Pune)..."
                        {...streetReg}
                        onChange={(e) => {
                          formOnChange(e);
                          handleStreetChange(e);
                        }}
                        ref={(e) => {
                          streetRef(e);
                          inputRef.current = e;
                        }}
                        error={errors.street?.message}
                        className="pr-12"
                        hint={searchingSuggestions ? "Searching locations..." : "Type address details to get search suggestions"}
                      />
                      <button
                        type="button"
                        onClick={handleDetectLocation}
                        disabled={detecting}
                        className="absolute right-2 top-[34px] p-2 text-forest-600 dark:text-emerald-500 hover:bg-forest-50 dark:hover:bg-white/5 rounded-lg transition-all flex items-center justify-center cursor-pointer disabled:opacity-50"
                        title="Detect current location"
                      >
                        {detecting ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <MapPin className="w-5 h-5 hover:scale-110 active:scale-95 transition-transform" />
                        )}
                      </button>

                      {/* Autocomplete Dropdown */}
                      {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute z-50 left-0 right-0 mt-1 bg-white dark:bg-[#0B150F] border border-coffee-100 dark:border-forest-500/25 rounded-2xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
                          {suggestions.map((suggestion) => (
                            <button
                              key={suggestion.place_id}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectSuggestion(suggestion);
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-coffee-50 dark:hover:bg-white/5 border-b border-coffee-50 dark:border-white/5 last:border-none flex items-start gap-2.5 transition-colors cursor-pointer"
                            >
                              <MapPin className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-coffee-950 dark:text-cream-50 leading-tight truncate">
                                  {suggestion.name}
                                </p>
                                <p className="text-[11px] text-coffee-500 dark:text-coffee-400 mt-0.5 truncate">
                                  {suggestion.display_name}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Map Picker section */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-coffee-500 dark:text-cream-300/60 uppercase tracking-wider">
                      Or Pin Location on Map
                    </span>
                    <div className="flex items-center gap-3">
                      {showMap && (
                        <button
                          type="button"
                          onClick={toggleMapType}
                          className="px-2 py-1 text-[9px] font-bold rounded-lg border border-coffee-100 dark:border-white/10 bg-coffee-50 dark:bg-white/5 text-coffee-600 dark:text-cream-300 hover:bg-[#D4AF37] hover:text-[#3D2015] dark:hover:bg-[#D4AF37] dark:hover:text-[#3D2015] transition-all uppercase tracking-wider cursor-pointer"
                        >
                          {satelliteMode ? '🗺️ Standard View' : '🛰️ Satellite View'}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowMap(!showMap)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-600 dark:text-emerald-500 hover:underline cursor-pointer"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        {showMap ? 'Hide Map Picker' : 'Show Map Picker'}
                      </button>
                    </div>
                  </div>

                  {showMap && (
                    <div className="relative border border-coffee-100 dark:border-white/10 rounded-2xl overflow-hidden shadow-inner">
                      {!mapLoaded && (
                        <div className="absolute inset-0 bg-coffee-50/50 dark:bg-coffee-950/40 backdrop-blur-sm z-10 flex flex-col items-center justify-center py-12 gap-2">
                          <Loader2 className="animate-spin w-6 h-6 text-gold-500" />
                          <p className="text-xs font-bold text-coffee-600 dark:text-cream-300">Loading Map Engine...</p>
                        </div>
                      )}
                      {geocoding && (
                        <div className="absolute top-2 right-2 bg-white/90 dark:bg-coffee-950/90 backdrop-blur-sm z-[1000] px-3 py-1 rounded-full border border-coffee-100 dark:border-white/10 shadow-sm flex items-center gap-1.5 text-[10px] font-bold text-forest-600 dark:text-emerald-450 animate-pulse">
                          <Loader2 className="animate-spin w-3 h-3 text-gold-500" />
                          Resolving Address...
                        </div>
                      )}
                      <div 
                        ref={mapContainerRef} 
                        style={{ height: '240px' }} 
                        className="w-full relative bg-coffee-50/20"
                      />
                      <div className="bg-coffee-50/60 dark:bg-white/5 p-3 border-t border-coffee-100 dark:border-white/5 text-[10px] text-coffee-500 dark:text-cream-300/70 font-semibold text-center select-none">
                        📍 Drag the red marker or click anywhere on the map to pinpoint your location
                      </div>
                    </div>
                  )}
                </div>

                {/* City, State, PIN Code */}
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    label="City"
                    placeholder="e.g. Mumbai"
                    {...register('city', { required: 'City is required' })}
                    error={errors.city?.message}
                  />
                  <Input
                    label="State"
                    placeholder="e.g. Maharashtra"
                    {...register('state', { required: 'State is required' })}
                    error={errors.state?.message}
                  />
                  <Input
                    label="PIN Code"
                    placeholder="e.g. 400001"
                    {...register('pincode', { required: 'Pincode is required' })}
                    error={errors.pincode?.message}
                  />
                </div>

                {/* Default Address Checkbox */}
                <label className="flex items-center gap-3 py-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    {...register('isDefault')}
                    className="rounded text-emerald-600 focus:ring-emerald-500 border-coffee-200 dark:border-forest-500/10 w-4 h-4"
                  />
                  <span className="text-sm font-semibold text-coffee-700 dark:text-cream-200">Set as default delivery address</span>
                </label>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-5 border-t border-coffee-50 dark:border-white/5">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2.5 text-xs font-bold text-coffee-500 hover:text-coffee-700 dark:hover:text-cream-200 transition-colors uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    isLoading={saveMutation.isPending}
                    className="bg-[#3D2015] dark:bg-[#D4AF37] hover:bg-[#2C150D] dark:hover:bg-[#C5A028] text-white dark:text-[#3D2015] px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs cursor-pointer shadow-md"
                  >
                    {editingAddress ? 'Update Address' : 'Save Address'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
