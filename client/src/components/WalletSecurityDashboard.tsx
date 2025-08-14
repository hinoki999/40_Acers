import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Activity, TrendingUp, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
import { Link } from 'wouter';

interface E0GHealthStatus {
  connected: boolean;
  e0gStatus: string;
  threatPatterns: string;
  addressesMonitored: string;
}

export function WalletSecurityDashboard() {
  // Check E0G API health status
  const { data: healthStatus, isLoading: healthLoading } = useQuery<E0GHealthStatus>({
    queryKey: ['/api/e0g/health'],
    refetchInterval: 30000, // Check every 30 seconds
  });

  const getStatusColor = (connected: boolean) => {
    return connected ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  const getStatusIcon = (connected: boolean) => {
    return connected ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Wallet Security Center
        </CardTitle>
        <CardDescription>
          Monitor wallet security and analyze cryptocurrency addresses using E0G Trust API
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* API Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">API Status</span>
              {healthLoading ? (
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse" />
              ) : (
                <Badge className={getStatusColor(healthStatus?.connected || false)}>
                  {getStatusIcon(healthStatus?.connected || false)}
                  <span className="ml-1">{healthStatus?.e0gStatus || 'Unknown'}</span>
                </Badge>
              )}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Real-time security monitoring
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Threat Patterns</span>
              <Activity className="h-4 w-4 text-orange-500" />
            </div>
            <div className="text-lg font-bold text-orange-600">
              {healthStatus?.threatPatterns || '---'}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Active security patterns
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Addresses Monitored</span>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-lg font-bold text-blue-600">
              {healthStatus?.addressesMonitored || '---'}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Total monitored wallets
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/wallet-security" className="flex-1">
            <Button className="w-full" variant="default">
              <Shield className="h-4 w-4 mr-2" />
              Analyze Wallet Address
            </Button>
          </Link>
          
          <Button variant="outline" className="flex-1" onClick={() => window.open('https://e0g.ai', '_blank')}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Learn About E0G
          </Button>
        </div>

        {/* Security Tips */}
        <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Security Best Practices</h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Always verify wallet addresses before making investments</li>
            <li>• Avoid wallets with high risk scores (above 70)</li>
            <li>• Use the wallet security analysis for cryptocurrency transactions</li>
            <li>• Report suspicious addresses to enhance security for all users</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}