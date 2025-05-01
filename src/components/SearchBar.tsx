
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { toast } from "@/components/ui/sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  normalizeText, 
  getPredictiveSuggestions,
  getMatchingPopularLocations
} from '@/utils/searchUtils';

interface Location {
  lat: number;
  lon: number;
  display_name: string;
}

interface SearchBarProps {
  onSearch: (location: Location) => void;
  userPosition?: [number, number] | null;
}

const SearchBar = ({ onSearch, userPosition }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [predictiveSuggestions, setPredictiveSuggestions] = useState<string[]>([]);
  const [popularSuggestions, setPopularSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userCountry, setUserCountry] = useState<string | null>(null);
  const [userLocationLabel, setUserLocationLabel] = useState<string | null>(null);

  useEffect(() => {
    const getUserLocation = async () => {
      if (userPosition) {
        try {
          const [lat, lon] = userPosition;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`
          );
          
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          
          const data = await response.json();
          
          let locationLabel = "Ubicación actual";
          
          if (data && data.address) {
            const cityName = data.address.city || data.address.town || data.address.village;
            const roadName = data.address.road;
            
            if (roadName && cityName) {
              locationLabel = `${roadName}, ${cityName}`;
            } else if (cityName) {
              locationLabel = cityName;
            } else if (roadName) {
              locationLabel = roadName;
            }
            
            if (data.address.country_code) {
              setUserCountry(data.address.country_code);
            }
          }
          
          setUserLocationLabel(locationLabel);
          
        } catch (error) {
          console.error('Error obteniendo la ubicación del usuario:', error);
          setUserLocationLabel('Ubicación actual');
        }
      }
    };

    getUserLocation();
  }, [userPosition]);

  useEffect(() => {
    const updatedPredictiveSuggestions = getPredictiveSuggestions(searchQuery);
    setPredictiveSuggestions(updatedPredictiveSuggestions);
    
    const updatedPopularSuggestions = getMatchingPopularLocations(searchQuery);
    setPopularSuggestions(updatedPopularSuggestions);
    
    if (searchQuery.trim().length >= 3) {
      const searchLocations = async () => {
        try {
          setIsSearching(true);
          const countryFilter = userCountry ? `&countrycodes=${userCountry}` : '';
          
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}${countryFilter}&limit=15`
          );
          
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          
          const data = await response.json();
          
          if (data && Array.isArray(data)) {
            setSuggestions(data
              .map((item: any) => ({
                lat: parseFloat(item.lat),
                lon: parseFloat(item.lon),
                display_name: item.display_name
              }))
              .slice(0, 15)
            );
          }
        } catch (error) {
          console.error('Error buscando sugerencias:', error);
          toast.error('Error al buscar sugerencias');
        } finally {
          setIsSearching(false);
        }
      };

      const timeoutId = setTimeout(searchLocations, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, userCountry]);

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    setShowSuggestions(true);
  };

  const handleSelectLocation = (location: Location) => {
    setSearchQuery(location.display_name.split(',')[0]);
    setShowSuggestions(false);
    onSearch(location);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setSearchQuery(suggestion);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSelectLocation(suggestions[0]);
    } else if (searchQuery.trim()) {
      toast.info('Buscando...');
    }
  };

  const handleUseCurrentLocation = () => {
    if (userPosition && userLocationLabel) {
      const userLoc: Location = {
        lat: userPosition[0],
        lon: userPosition[1],
        display_name: userLocationLabel
      };
      onSearch(userLoc);
      setSearchQuery(userLocationLabel.split(',')[0]);
      setShowSuggestions(false);
      toast.success("Usando tu ubicación actual");
    }
  };

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] w-full max-w-md px-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Buscar ubicación..."
            value={searchQuery}
            onChange={(e) => handleInputChange(e.target.value)}
            className="flex-1 pr-10 bg-white shadow-lg"
            autoComplete="off"
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={isSearching}
            className="bg-white hover:bg-gray-100 shadow-lg"
          >
            <Search className="h-4 w-4 text-gray-600" />
          </Button>
        </div>

        {showSuggestions && (searchQuery.trim() || userPosition) && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border w-full z-[40]">
            {userPosition && userLocationLabel && (
              <div 
                className="flex items-center gap-2 p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
                onClick={handleUseCurrentLocation}
              >
                <div className="flex-1">
                  <div className="font-medium">Tu ubicación actual</div>
                  <div className="text-sm text-gray-500">{userLocationLabel}</div>
                </div>
              </div>
            )}

            <ScrollArea className="max-h-[70vh]">
              <Command className="w-full">
                <CommandList>
                  <CommandEmpty>No hay resultados</CommandEmpty>
                  <CommandGroup>
                    {predictiveSuggestions.length > 0 && (
                      <div className="p-2 border-b border-gray-100">
                        <div className="text-sm font-medium text-gray-500 px-2 py-1">
                          Tipos de lugares
                        </div>
                        {predictiveSuggestions.map((suggestion, index) => (
                          <CommandItem
                            key={`predict-${index}`}
                            onSelect={() => handleSelectSuggestion(suggestion)}
                            className="cursor-pointer py-2 px-4 hover:bg-gray-50"
                          >
                            <Search className="mr-2 h-4 w-4 text-gray-400" />
                            <span>{suggestion}</span>
                          </CommandItem>
                        ))}
                      </div>
                    )}

                    {popularSuggestions.length > 0 && (
                      <div className="p-2 border-b border-gray-100">
                        <div className="text-sm font-medium text-gray-500 px-2 py-1">
                          Lugares populares
                        </div>
                        {popularSuggestions.map((suggestion, index) => (
                          <CommandItem
                            key={`popular-${index}`}
                            onSelect={() => handleSelectSuggestion(suggestion)}
                            className="cursor-pointer py-2 px-4 hover:bg-gray-50"
                          >
                            <Search className="mr-2 h-4 w-4 text-gray-400" />
                            <span>{suggestion}</span>
                          </CommandItem>
                        ))}
                      </div>
                    )}

                    {suggestions.length > 0 && (
                      <div className="p-2">
                        <div className="text-sm font-medium text-gray-500 px-2 py-1">
                          Resultados de búsqueda
                        </div>
                        {suggestions.map((suggestion, index) => (
                          <CommandItem
                            key={`result-${index}`}
                            onSelect={() => handleSelectLocation(suggestion)}
                            className="cursor-pointer py-3 px-4 hover:bg-gray-50"
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {suggestion.display_name.split(',')[0]}
                              </span>
                              <span className="text-sm text-gray-500">
                                {suggestion.display_name.split(',').slice(1, 4).join(',')}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </div>
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </ScrollArea>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
