'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { ApiQuest } from '@/lib/sponsorApi';

// Fix default marker icon broken by webpack
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function makeDivIcon(emoji: string) {
  return L.divIcon({
    html: `<div style="
      width:36px;height:36px;border-radius:50% 50% 50% 0;
      background:var(--color-primary,#5C3524);
      transform:rotate(-45deg);
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 2px 6px rgba(0,0,0,0.35);
    "><span style="transform:rotate(45deg);font-size:16px;line-height:1">${emoji}</span></div>`,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -38],
  });
}

interface QuestCoord {
  quest: ApiQuest;
  lat: number;
  lng: number;
}

function FitBounds({ coords }: { coords: QuestCoord[] }) {
  const map = useMap();
  useEffect(() => {
    if (coords.length === 0) return;
    if (coords.length === 1) {
      map.setView([coords[0].lat, coords[0].lng], 14);
    } else {
      const bounds = L.latLngBounds(coords.map((c) => [c.lat, c.lng]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [map, coords]);
  return null;
}

async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'GoalQuestSponsorPortal/1.0' } });
    const data = await res.json();
    if (data[0]) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {
    // silently fail — quest just won't appear on map
  }
  return null;
}

export interface QuestMapProps {
  quests: ApiQuest[];
  height?: string;
}

export default function QuestMap({ quests, height = '320px' }: QuestMapProps) {
  const [coords, setCoords] = useState<QuestCoord[]>([]);
  const [geocoding, setGeocoding] = useState(true);
  const geocodedRef = useRef(false);

  useEffect(() => {
    if (geocodedRef.current) return;
    geocodedRef.current = true;

    async function resolve() {
      const results: QuestCoord[] = [];

      for (const quest of quests) {
        // Already has coordinates
        if (quest.latitude != null && quest.longitude != null) {
          results.push({ quest, lat: quest.latitude, lng: quest.longitude });
          continue;
        }
        // Geocode the address
        if (quest.address?.trim()) {
          const geo = await geocodeAddress(quest.address);
          if (geo) results.push({ quest, lat: geo.lat, lng: geo.lng });
          // Nominatim rate limit: 1 req/sec
          await new Promise((r) => setTimeout(r, 1100));
        }
      }

      setCoords(results);
      setGeocoding(false);
    }

    resolve();
  }, [quests]);

  if (geocoding && coords.length === 0) {
    return (
      <div
        className="w-full rounded-2xl border border-border bg-background flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-center text-subtext text-sm">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Locating quests…
        </div>
      </div>
    );
  }

  if (coords.length === 0) {
    return (
      <div
        className="w-full rounded-2xl border border-border bg-background flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-center text-subtext text-sm px-4">
          <div className="text-3xl mb-2">📍</div>
          <div className="font-medium text-app-text text-sm">No locations to show</div>
          <div className="text-xs mt-1">Add a street address when creating a quest to pin it here.</div>
        </div>
      </div>
    );
  }

  const center: [number, number] = [coords[0].lat, coords[0].lng];

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-border" style={{ height }}>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds coords={coords} />
        {coords.map(({ quest, lat, lng }) => (
          <Marker
            key={quest.id}
            position={[lat, lng]}
            icon={makeDivIcon(quest.sponsor_logo || '🏪')}
          >
            <Popup>
              <div style={{ minWidth: 180 }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>
                  {quest.reward_icon} {quest.title}
                </div>
                <div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>
                  {quest.address}
                </div>
                <div style={{ fontSize: 12 }}>
                  <strong>Reward:</strong> {quest.reward}
                </div>
                <div style={{ fontSize: 12, marginTop: 2 }}>
                  <strong>Participants:</strong> {quest.participants} / {quest.max_participants}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
