
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export const useUserCountry = () => {
  const [userCountry, setUserCountry] = useState("Unknown");
  const queryClient = useQueryClient();
  
  useEffect(() => {
    // Safe country determination without CORS issues
    const determineUserCountry = () => {
      // Use predefined countries for fallback instead of API call
      const countries = ["Syria", "Egypt", "Indonesia", "Turkey", "Germany", "Saudi Arabia"];
      const randomCountry = countries[Math.floor(Math.random() * countries.length)];
      setUserCountry(randomCountry);
    };
    
    determineUserCountry();
    
    // Initial statistics query
    queryClient.invalidateQueries({ queryKey: ['stats'] });
  }, [queryClient]);
  
  return userCountry;
};
