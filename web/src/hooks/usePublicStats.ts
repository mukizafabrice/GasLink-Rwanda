import { useEffect, useRef, useState } from "react";
import api from "@/services/api";

interface PublicStats {
  activeMerchants: number;
  totalClients: number;
  totalOrders: number;
  securePlatformScore: number;
}

interface UsePublicStatsResult {
  stats: PublicStats;
  loading: boolean;
  error: string | null;
}

const defaultStats: PublicStats = {
  activeMerchants: 0,
  totalClients: 0,
  totalOrders: 0,
  securePlatformScore: 100,
};

export const usePublicStats = (): UsePublicStatsResult => {
  const [stats, setStats] = useState<PublicStats>(defaultStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/public/platform-stats");
        if (mountedRef.current && response.data?.success && response.data?.data) {
          setStats({
            activeMerchants: response.data.data.activeMerchants ?? 0,
            totalClients: response.data.data.totalClients ?? 0,
            totalOrders: response.data.data.totalOrders ?? 0,
            securePlatformScore: response.data.data.securePlatformScore ?? 100,
          });
        }
      } catch (err) {
        console.error("Failed to fetch public stats", err);
        if (mountedRef.current) {
          setError("Unable to load latest platform metrics");
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  return { stats, loading, error };
};

export default usePublicStats;
