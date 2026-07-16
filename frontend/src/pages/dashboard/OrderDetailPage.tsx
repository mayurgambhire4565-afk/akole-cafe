import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, Calendar, Clock, ShoppingBag, Coffee, AlertTriangle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/api/axios';

const STATUS_STEPS = ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [mapLoaded, setMapLoaded] = useState(false);
  const [satelliteMode, setSatelliteMode] = useState(false);
  const [driverPosition, setDriverPosition] = useState<[number, number]>([19.5415, 74.0025]);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<any>(null);
  const streetLayerRef = useRef<any>(null);
  const satelliteLayerRef = useRef<any>(null);

  const { data: order, isLoading } = useQuery({
    queryKey: ['order-detail', id],
    queryFn: async () => {
      const res = await api.get(`/orders/my/${id}`);
      return res.data.data.order;
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async () => {
      const res = await api.put(`/orders/my/${id}/cancel`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['order-detail', id] });
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      toast.success(data.message || 'Order cancelled successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to cancel order');
    },
  });

  // Load Leaflet dynamically
  useEffect(() => {
    if (!order) return;
    if ((window as any).L) {
      setMapLoaded(true);
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      setMapLoaded(true);
    };
    document.head.appendChild(script);
  }, [order]);

  // Animate driver position on OUT_FOR_DELIVERY status
  useEffect(() => {
    if (!order) return;
    if (order.status !== 'OUT_FOR_DELIVERY') {
      if (order.status === 'DELIVERED') {
        setDriverPosition([19.5350, 74.0125]);
      } else {
        setDriverPosition([19.5415, 74.0025]);
      }
      return;
    }

    const path = [
      [19.5415, 74.0025],
      [19.5402, 74.0038],
      [19.5391, 74.0055],
      [19.5378, 74.0078],
      [19.5365, 74.0098],
      [19.5350, 74.0125]
    ];

    let step = 0;
    const interval = setInterval(() => {
      setDriverPosition(path[step] as [number, number]);
      step = (step + 1) % path.length;
    }, 3000);

    return () => clearInterval(interval);
  }, [order?.status]);

  // Handle map creation and layer switching
  useEffect(() => {
    if (!mapLoaded || !mapContainerRef.current || !order) return;

    const L = (window as any).L;
    if (!L) return;

    if (leafletMapRef.current) {
      return;
    }

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      scrollWheelZoom: true
    }).setView([19.5382, 74.0075], 14);

    const streetLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      attribution: '&copy; Google Maps'
    });

    const satelliteLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      attribution: '&copy; Google Maps'
    });

    streetLayer.addTo(map);
    streetLayerRef.current = streetLayer;
    satelliteLayerRef.current = satelliteLayer;
    leafletMapRef.current = map;

    // Custom Icons
    const cafeIcon = L.divIcon({
      html: `<div style="background-color: #3D2015; border: 2px solid #D4AF37; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"><span style="font-size: 14px; line-height: 28px;">☕</span></div>`,
      className: 'custom-div-icon',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const homeIcon = L.divIcon({
      html: `<div style="background-color: #2E7D32; border: 2px solid white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"><span style="font-size: 14px; line-height: 28px;">🏠</span></div>`,
      className: 'custom-div-icon',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    // Add cafe and home markers
    L.marker([19.5415, 74.0025], { icon: cafeIcon }).addTo(map).bindPopup('<b>Akole Cafe</b><br/>Cafe Location');
    L.marker([19.5350, 74.0125], { icon: homeIcon }).addTo(map).bindPopup('<b>Delivery Destination</b><br/>Your Location');

    // Add path polyline
    const path = [
      [19.5415, 74.0025],
      [19.5402, 74.0038],
      [19.5391, 74.0055],
      [19.5378, 74.0078],
      [19.5365, 74.0098],
      [19.5350, 74.0125]
    ];
    L.polyline(path, { color: '#D4AF37', weight: 4, dashArray: '5, 8', opacity: 0.8 }).addTo(map);

    return () => {
      // Leave map instance active or cleanup on unmount
    };
  }, [mapLoaded, order]);

  // Update driver marker position
  useEffect(() => {
    if (!mapLoaded || !leafletMapRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    if ((leafletMapRef.current as any).driverMarker) {
      (leafletMapRef.current as any).driverMarker.remove();
    }

    const driverIcon = L.divIcon({
      html: `<div style="background-color: #D4AF37; border: 2px solid #3D2015; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.2);"><span style="font-size: 16px; line-height: 32px; display: block; transform: scaleX(-1);">🛵</span></div>`,
      className: 'custom-div-icon-driver',
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    const marker = L.marker(driverPosition, { icon: driverIcon }).addTo(leafletMapRef.current);
    (leafletMapRef.current as any).driverMarker = marker;
  }, [driverPosition, mapLoaded]);

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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <img src="/gold-logo.png" className="w-12 h-12 animate-spin mb-4 object-contain" alt="Loading" />
        <p className="text-coffee-500 text-sm">Brewing order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-coffee-900 dark:text-cream-105 mb-2">Order Not Found</h3>
        <p className="text-coffee-500 mb-6">We couldn't retrieve the details for this order.</p>
        <Link to="/dashboard/orders" className="bg-forest-500 text-white px-5 py-2 rounded-xl text-sm font-medium">
          Back to Orders
        </Link>
      </div>
    );
  }

  const currentStepIdx = STATUS_STEPS.indexOf(order.status);
  const isCancelled = order.status === 'CANCELLED';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <Link to="/dashboard/orders" className="inline-flex items-center gap-2 text-sm font-semibold text-coffee-600 dark:text-cream-300 hover:text-forest-600 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
        {order.status === 'PENDING' && (
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to cancel this order?')) {
                cancelMutation.mutate();
              }
            }}
            disabled={cancelMutation.isPending}
            className="text-xs font-bold text-red-500 hover:text-red-650 px-4 py-2 rounded-xl border border-red-200 dark:border-red-950/20 hover:bg-red-50 dark:hover:bg-red-950/10 transition-colors"
          >
            {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Order'}
          </button>
        )}
      </div>

      {/* Main Order Details Cards */}
      <div className="bg-white dark:bg-coffee-950 rounded-3xl border border-coffee-100 dark:border-forest-500/10 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 sm:p-8 bg-coffee-50/50 dark:bg-white/5 border-b border-coffee-100 dark:border-forest-500/10 flex flex-wrap justify-between items-center gap-6">
          <div>
            <span className="text-xs font-semibold text-gold-600 dark:text-gold-500 uppercase tracking-wider">Coffee Katta Order</span>
            <h1 className="text-xl sm:text-2xl font-display font-bold text-coffee-900 dark:text-cream-100 mt-1">
              Order #{order.orderNumber || order.id.slice(-8).toUpperCase()}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-coffee-500 mt-2">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(order.createdAt).toLocaleString()}</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Status: <strong className="uppercase text-forest-600 dark:text-gold-450">{order.status}</strong></span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-coffee-400 uppercase tracking-wider font-semibold">Total Amount</p>
            <p className="text-2xl font-bold text-forest-600 dark:text-gold-400">₹{order.total.toFixed(2)}</p>
          </div>
        </div>

        {/* Tracking Timeline */}
        {!isCancelled && (
          <div className="p-6 sm:p-8 border-b border-coffee-100 dark:border-forest-500/10">
            <h3 className="font-bold text-coffee-900 dark:text-cream-100 mb-6">Delivery Tracking</h3>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 max-w-2xl mx-auto">
              {STATUS_STEPS.map((step, idx) => {
                const isCompleted = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                return (
                  <div key={step} className="flex-1 flex flex-col items-center relative w-full">
                    {/* Line connector */}
                    {idx < STATUS_STEPS.length - 1 && (
                      <div className={`hidden sm:block absolute left-1/2 right-[-50%] top-4 h-0.5 z-0 ${
                        idx < currentStepIdx ? 'bg-forest-500' : 'bg-coffee-100 dark:bg-forest-950/20'
                      }`} />
                    )}

                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs z-10 transition-all ${
                      isCompleted 
                        ? 'bg-forest-500 text-white shadow-md shadow-forest-500/15'
                        : 'bg-coffee-50 dark:bg-white/5 text-coffee-400'
                    } ${isCurrent ? 'ring-4 ring-forest-500/20' : ''}`}>
                      {idx + 1}
                    </div>
                    <span className={`text-[10px] font-bold mt-2 text-center capitalize tracking-wide ${
                      isCompleted ? 'text-forest-600 dark:text-forest-400' : 'text-coffee-400'
                    }`}>
                      {step.replace(/_/g, ' ').toLowerCase()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Live Map Tracking widget */}
        {!isCancelled && (
          <div className="p-6 sm:p-8 border-b border-coffee-100 dark:border-forest-500/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-coffee-900 dark:text-cream-100">Live Delivery Route Map</h3>
              <button
                type="button"
                onClick={toggleMapType}
                className="px-3.5 py-1.5 text-[10px] font-bold rounded-xl border border-coffee-100 dark:border-white/10 bg-coffee-50 dark:bg-white/5 text-coffee-600 dark:text-cream-300 hover:bg-[#D4AF37] hover:text-[#3D2015] dark:hover:bg-[#D4AF37] dark:hover:text-[#3D2015] transition-all uppercase tracking-wider cursor-pointer"
              >
                {satelliteMode ? '🗺️ Standard View' : '🛰️ Satellite View'}
              </button>
            </div>
            
            <div className="relative border border-coffee-100 dark:border-white/10 rounded-2xl overflow-hidden shadow-inner">
              {!mapLoaded && (
                <div className="absolute inset-0 bg-coffee-50/50 dark:bg-coffee-950/40 backdrop-blur-sm z-10 flex flex-col items-center justify-center py-20 gap-2">
                  <Loader2 className="animate-spin w-6 h-6 text-gold-500" />
                  <p className="text-xs font-bold text-coffee-600 dark:text-cream-300">Preparing live map route...</p>
                </div>
              )}
              <div 
                ref={mapContainerRef} 
                style={{ height: '300px' }} 
                className="w-full relative bg-coffee-50/20"
              />
              <div className="bg-coffee-50/60 dark:bg-white/5 p-3 border-t border-coffee-100 dark:border-white/5 text-[10px] text-coffee-500 dark:text-cream-300/70 font-semibold text-center select-none flex items-center justify-center gap-1.5">
                <span>☕ Akole Cafe</span>
                <span className="text-coffee-300">➔</span>
                <span>🛵 Driver (Moving)</span>
                <span className="text-coffee-300">➔</span>
                <span>🏠 Delivery Destination</span>
              </div>
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="p-6 sm:p-8 border-b border-coffee-100 dark:border-forest-500/10">
          <h3 className="font-bold text-coffee-900 dark:text-cream-100 mb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-gold-500" /> Items Ordered
          </h3>
          <div className="space-y-4">
            {order.items?.map((item: any) => {
              return (
                <div key={item.id} className="flex items-center justify-between gap-4 py-2 border-b border-coffee-50 dark:border-forest-500/5 last:border-none">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-forest-500/10 flex items-center justify-center overflow-hidden">
                      {item.productImage ? (
                        <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                      ) : (
                        <Coffee className="w-6 h-6 text-forest-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-coffee-900 dark:text-cream-100 text-sm sm:text-base">{item.productName}</p>
                      <p className="text-xs text-coffee-500">₹{item.price.toFixed(2)} x {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-bold text-coffee-950 dark:text-cream-50 text-sm sm:text-base">₹{item.total.toFixed(2)}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Details (Address & Payment info) */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Address */}
          <div className="p-6 sm:p-8 border-b md:border-b-0 md:border-r border-coffee-100 dark:border-forest-500/10">
            <h3 className="font-bold text-coffee-900 dark:text-cream-100 mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gold-500" /> Delivery Address
            </h3>
            {order.address ? (
              <div className="text-sm space-y-1.5 text-coffee-600 dark:text-cream-200">
                <p className="font-semibold text-coffee-900 dark:text-cream-100">{order.address.name}</p>
                <p>{order.address.phone}</p>
                <p className="leading-relaxed">
                  {order.address.street}, {order.address.city}, {order.address.state} - {order.address.pincode}
                </p>
              </div>
            ) : (
              <p className="text-sm text-coffee-400">No delivery address linked.</p>
            )}
          </div>

          {/* Payment */}
          <div className="p-6 sm:p-8">
            <h3 className="font-bold text-coffee-900 dark:text-cream-100 mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gold-500" /> Payment & Costs
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-coffee-550 dark:text-coffee-400">
                <span>Subtotal</span>
                <span>₹{order.subtotal?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-coffee-550 dark:text-coffee-400">
                <span>GST (5%)</span>
                <span>₹{order.tax?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-coffee-550 dark:text-coffee-400">
                <span>Delivery Charge</span>
                <span>{order.deliveryFee === 0 ? 'Complimentary' : `₹${order.deliveryFee?.toFixed(2)}`}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount</span>
                  <span>-₹{order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="h-px bg-coffee-50 dark:bg-forest-500/10 my-2" />
              <div className="flex justify-between text-base font-bold text-coffee-900 dark:text-cream-100">
                <span>Total Amount Paid</span>
                <span className="text-forest-600 dark:text-gold-400">₹{order.total.toFixed(2)}</span>
              </div>

              {order.payment && (
                <div className="mt-4 pt-4 border-t border-coffee-50 dark:border-forest-500/10 flex items-center justify-between text-xs text-coffee-400">
                  <span>Method: <strong className="uppercase">{order.payment.provider}</strong></span>
                  <span>Status: <strong className="uppercase text-forest-600 dark:text-gold-450">{order.payment.status}</strong></span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
