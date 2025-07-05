
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LocationCaptureProps {
  location: { lat: number; lng: number; address: string } | null;
  onLocationChange: (location: { lat: number; lng: number; address: string } | null) => void;
}

const LocationCapture = ({ location, onLocationChange }: LocationCaptureProps) => {
  const { toast } = useToast();
  const [isCapturing, setIsCapturing] = useState(false);

  const captureLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive"
      });
      return;
    }

    setIsCapturing(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // For now, we'll create a simple address format
        // In a real app, you'd use a reverse geocoding service
        const address = `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`;
        
        onLocationChange({
          lat: latitude,
          lng: longitude,
          address: address
        });
        
        setIsCapturing(false);

      },
      (error) => {
        setIsCapturing(false);
        let errorMessage = "Failed to get location";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }
        
        toast({
          title: "Location capture failed",
          description: errorMessage,
          variant: "destructive"
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  return (
      <CardContent className="p-0">
        {location ? (
            <div className="space-y-3 flex p-3 bg-green-50 border border-green-200 rounded-lg justify-between items-center">
              <div>
                <p className="text-sm text-green-800 font-medium">Location Captured</p>
                <p className="text-xs text-green-600 mt-1">{location.address}</p>
              </div>
              <Button
                  className="mt-0"
                  variant="outline"
                  onClick={() => onLocationChange(null)}
              >
                Clear Location
              </Button>
            </div>
        ) : (
            <div className="space-y-3">
              <Button
                  onClick={captureLocation}
                  disabled={isCapturing}
                  className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <MapPin className="h-4 w-4 mr-2" />
                {isCapturing ? "Capturing..." : "Capture Shop Location"}
              </Button>
            </div>
        )}
      </CardContent>
  );
};

export default LocationCapture;
