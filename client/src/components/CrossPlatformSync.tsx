import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Smartphone, 
  Monitor, 
  Tablet, 
  Wifi, 
  WifiOff, 
  Sync, 
  CheckCircle,
  AlertCircle,
  Clock,
  Download,
  Upload
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getQueryFn, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SyncDevice {
  id: string;
  deviceType: string;
  deviceId: string;
  platform: string;
  appVersion: string;
  lastSyncAt: string;
  isActive: boolean;
  syncStatus: 'synced' | 'syncing' | 'pending' | 'error';
}

interface SyncData {
  portfolio: any;
  transactions: any[];
  preferences: any;
  watchlist: any[];
  lastUpdated: string;
}

export default function CrossPlatformSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: devices = [], isLoading } = useQuery({
    queryKey: ["/api/sync/devices"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const { data: syncStatus } = useQuery({
    queryKey: ["/api/sync/status"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    refetchInterval: 30000, // Check sync status every 30 seconds
  });

  const syncMutation = useMutation({
    mutationFn: async (deviceId?: string) => 
      apiRequest("/api/sync/trigger", { 
        method: "POST", 
        body: JSON.stringify({ deviceId }) 
      }),
    onSuccess: () => {
      toast({
        title: "Sync Initiated",
        description: "Your data is being synchronized across devices.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/sync"] });
    },
    onError: () => {
      toast({
        title: "Sync Failed",
        description: "Unable to sync data. Please try again.",
        variant: "destructive",
      });
    },
  });

  const disconnectDeviceMutation = useMutation({
    mutationFn: async (deviceId: string) => 
      apiRequest(`/api/sync/devices/${deviceId}`, { method: "DELETE" }),
    onSuccess: () => {
      toast({
        title: "Device Disconnected",
        description: "Device has been removed from sync.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/sync/devices"] });
    },
  });

  // Auto-sync when component mounts
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && navigator.onLine) {
        queryClient.invalidateQueries({ queryKey: ["/api/sync"] });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [queryClient]);

  // Simulate sync progress for better UX
  useEffect(() => {
    if (isSyncing) {
      const interval = setInterval(() => {
        setSyncProgress(prev => {
          if (prev >= 100) {
            setIsSyncing(false);
            return 0;
          }
          return prev + 10;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isSyncing]);

  const handleSync = async (deviceId?: string) => {
    setIsSyncing(true);
    setSyncProgress(0);
    await syncMutation.mutateAsync(deviceId);
  };

  const getDeviceIcon = (deviceType: string, platform: string) => {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone className="h-5 w-5" />;
      case 'tablet':
        return <Tablet className="h-5 w-5" />;
      default:
        return <Monitor className="h-5 w-5" />;
    }
  };

  const getStatusIcon = (status: string, isActive: boolean) => {
    if (!isActive) return <WifiOff className="h-4 w-4 text-neutral-400" />;
    
    switch (status) {
      case 'synced':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'syncing':
        return <Sync className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Wifi className="h-4 w-4 text-green-600" />;
    }
  };

  const getStatusBadge = (status: string, isActive: boolean) => {
    if (!isActive) {
      return <Badge variant="secondary">Offline</Badge>;
    }

    const badges = {
      synced: <Badge className="bg-green-100 text-green-800">Synced</Badge>,
      syncing: <Badge className="bg-blue-100 text-blue-800">Syncing</Badge>,
      pending: <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>,
      error: <Badge className="bg-red-100 text-red-800">Error</Badge>,
    };

    return badges[status as keyof typeof badges] || <Badge>Unknown</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Sync Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sync className="h-5 w-5" />
            <span>Cross-Platform Sync</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {syncStatus && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {syncStatus.totalDevices}
                </div>
                <div className="text-sm text-blue-700">Connected Devices</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {formatDistanceToNow(new Date(syncStatus.lastSync))}
                </div>
                <div className="text-sm text-green-700">Last Sync</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {syncStatus.pendingChanges}
                </div>
                <div className="text-sm text-purple-700">Pending Changes</div>
              </div>
            </div>
          )}

          {isSyncing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Synchronizing data...</span>
                <span>{syncProgress}%</span>
              </div>
              <Progress value={syncProgress} className="h-2" />
            </div>
          )}

          <div className="flex space-x-3">
            <Button 
              onClick={() => handleSync()} 
              disabled={isSyncing}
              className="flex items-center space-x-2"
            >
              <Sync className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Sync All Devices</span>
            </Button>
            
            <Button variant="outline" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export Data</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Connected Devices */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Devices</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg animate-pulse">
                  <div className="w-10 h-10 bg-neutral-200 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-neutral-200 rounded w-32"></div>
                    <div className="h-3 bg-neutral-200 rounded w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : devices.length === 0 ? (
            <div className="text-center py-8">
              <Smartphone className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="font-medium text-neutral-900 mb-2">No Connected Devices</h3>
              <p className="text-neutral-600 text-sm">
                Install the 40 Acres mobile app to sync your data across devices.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {devices.map((device: SyncDevice) => (
                <div key={device.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 text-neutral-600">
                      {getDeviceIcon(device.deviceType, device.platform)}
                      {getStatusIcon(device.syncStatus, device.isActive)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium capitalize">
                          {device.platform} {device.deviceType}
                        </h4>
                        {getStatusBadge(device.syncStatus, device.isActive)}
                      </div>
                      <div className="text-sm text-neutral-500">
                        Last sync: {formatDistanceToNow(new Date(device.lastSyncAt), { addSuffix: true })}
                        <span className="mx-2">•</span>
                        Version: {device.appVersion}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSync(device.id)}
                      disabled={isSyncing}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Sync className="h-4 w-4 mr-1" />
                      Sync
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => disconnectDeviceMutation.mutate(device.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sync Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Sync Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Auto-sync</h4>
                <p className="text-sm text-neutral-600">
                  Automatically sync when app opens
                </p>
              </div>
              <Badge className="bg-green-100 text-green-800">Enabled</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Sync on WiFi only</h4>
                <p className="text-sm text-neutral-600">
                  Only sync when connected to WiFi
                </p>
              </div>
              <Badge variant="secondary">Disabled</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Background sync</h4>
                <p className="text-sm text-neutral-600">
                  Keep data synchronized in background
                </p>
              </div>
              <Badge className="bg-green-100 text-green-800">Enabled</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}