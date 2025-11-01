"use client";
import { useState, useEffect } from 'react';
import { authAPI, getStoredToken, getStoredRefreshToken } from '@/lib/api';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { Copy, RefreshCw, CheckCircle2, XCircle, Eye, EyeOff } from 'lucide-react';

interface DebugInfo {
  authStatus: 'authenticated' | 'unauthenticated' | 'checking' | 'error';
  user: any | null;
  token: string | null;
  refreshToken: string | null;
  tokenExpiry: number | null;
  apiUrl: string;
  lastError: string | null;
  testResults: {
    login?: { status: 'success' | 'error'; message: string };
    register?: { status: 'success' | 'error'; message: string };
    getCurrentUser?: { status: 'success' | 'error'; message: string };
    refresh?: { status: 'success' | 'error'; message: string };
  };
}

export function AuthDebug() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTokens, setShowTokens] = useState(false);
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    authStatus: 'checking',
    user: null,
    token: null,
    refreshToken: null,
    tokenExpiry: null,
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    lastError: null,
    testResults: {},
  });

  const decodeToken = (token: string | null): number | null => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp ? payload.exp * 1000 : null; // Convert to milliseconds
    } catch {
      return null;
    }
  };

  const formatTokenExpiry = (timestamp: number | null): string => {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = timestamp - now.getTime();
    
    if (diff < 0) return `Expired (${date.toLocaleString()})`;
    if (diff < 60000) return `Expires in ${Math.floor(diff / 1000)}s`;
    if (diff < 3600000) return `Expires in ${Math.floor(diff / 60000)}min`;
    return date.toLocaleString();
  };

  const checkAuthStatus = async () => {
    setDebugInfo(prev => ({ ...prev, authStatus: 'checking', lastError: null }));
    const token = getStoredToken();
    const refreshToken = getStoredRefreshToken();
    const tokenExpiry = decodeToken(token);

    if (!token) {
      setDebugInfo(prev => ({
        ...prev,
        authStatus: 'unauthenticated',
        token: null,
        refreshToken: null,
        user: null,
        tokenExpiry: null,
      }));
      return;
    }

    try {
      const user = await authAPI.getCurrentUser();
      if (user) {
        setDebugInfo(prev => ({
          ...prev,
          authStatus: 'authenticated',
          user,
          token,
          refreshToken,
          tokenExpiry,
        }));
      } else {
        setDebugInfo(prev => ({
          ...prev,
          authStatus: 'unauthenticated',
          user: null,
          tokenExpiry,
        }));
      }
    } catch (error: any) {
      setDebugInfo(prev => ({
        ...prev,
        authStatus: 'error',
        lastError: error.message || 'Unknown error',
        user: null,
        tokenExpiry,
      }));
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkAuthStatus();
    }
  }, [isOpen]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const testLogin = async () => {
    setDebugInfo(prev => ({
      ...prev,
      testResults: { ...prev.testResults, login: { status: 'success', message: 'Testing...' } },
    }));
    
    try {
      // This will fail with test credentials, but shows the API is reachable
      await authAPI.login('test@example.com', 'testpassword');
      setDebugInfo(prev => ({
        ...prev,
        testResults: {
          ...prev.testResults,
          login: { status: 'error', message: 'Test credentials should fail (this is expected)' },
        },
      }));
    } catch (error: any) {
      // Expected to fail
      if (error.message.includes('Invalid login credentials') || error.message.includes('Email not confirmed')) {
        setDebugInfo(prev => ({
          ...prev,
          testResults: {
            ...prev.testResults,
            login: { status: 'success', message: 'API is reachable (auth endpoint works)' },
          },
        }));
      } else {
        setDebugInfo(prev => ({
          ...prev,
          testResults: {
            ...prev.testResults,
            login: { status: 'error', message: error.message || 'API connection failed' },
          },
        }));
      }
    }
  };

  const testGetCurrentUser = async () => {
    setDebugInfo(prev => ({
      ...prev,
      testResults: { ...prev.testResults, getCurrentUser: { status: 'success', message: 'Testing...' } },
    }));

    try {
      const user = await authAPI.getCurrentUser();
      if (user) {
        setDebugInfo(prev => ({
          ...prev,
          testResults: {
            ...prev.testResults,
            getCurrentUser: { status: 'success', message: `Success: ${user.email}` },
          },
        }));
      } else {
        setDebugInfo(prev => ({
          ...prev,
          testResults: {
            ...prev.testResults,
            getCurrentUser: { status: 'error', message: 'No user returned' },
          },
        }));
      }
    } catch (error: any) {
      setDebugInfo(prev => ({
        ...prev,
        testResults: {
          ...prev.testResults,
          getCurrentUser: { status: 'error', message: error.message || 'Failed to get user' },
        },
      }));
    }
  };

  const testRefreshToken = async () => {
    setDebugInfo(prev => ({
      ...prev,
      testResults: { ...prev.testResults, refresh: { status: 'success', message: 'Testing...' } },
    }));

    try {
      const result = await authAPI.refreshToken();
      if (result) {
        setDebugInfo(prev => ({
          ...prev,
          testResults: {
            ...prev.testResults,
            refresh: { status: 'success', message: 'Token refreshed successfully' },
          },
        }));
        checkAuthStatus();
      } else {
        setDebugInfo(prev => ({
          ...prev,
          testResults: {
            ...prev.testResults,
            refresh: { status: 'error', message: 'No refresh token available' },
          },
        }));
      }
    } catch (error: any) {
      setDebugInfo(prev => ({
        ...prev,
        testResults: {
          ...prev.testResults,
          refresh: { status: 'error', message: error.message || 'Failed to refresh token' },
        },
      }));
    }
  };

  const maskToken = (token: string | null) => {
    if (!token) return 'No token';
    if (!showTokens) {
      return `${token.substring(0, 20)}...${token.substring(token.length - 10)}`;
    }
    return token;
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          size="sm"
          className="bg-white shadow-lg"
        >
          🔍 Auth Debug
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-[90vh] overflow-y-auto">
      <Card className="shadow-2xl border-2">
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold">Auth Debug Panel</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTokens(!showTokens)}
                title={showTokens ? 'Hide tokens' : 'Show tokens'}
              >
                {showTokens ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={checkAuthStatus}
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          {/* Auth Status */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Auth Status:</span>
              <Badge
                variant={
                  debugInfo.authStatus === 'authenticated'
                    ? 'default'
                    : debugInfo.authStatus === 'error'
                    ? 'destructive'
                    : 'secondary'
                }
              >
                {debugInfo.authStatus === 'authenticated' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                {debugInfo.authStatus === 'error' && <XCircle className="w-3 h-3 mr-1" />}
                {debugInfo.authStatus}
              </Badge>
            </div>
            {debugInfo.lastError && (
              <div className="text-xs text-red-600 mt-1 p-2 bg-red-50 rounded">
                Error: {debugInfo.lastError}
              </div>
            )}
          </div>

          {/* User Info */}
          {debugInfo.user && (
            <div>
              <div className="text-sm font-medium mb-2">User Info:</div>
              <div className="text-xs space-y-1 bg-gray-50 p-2 rounded">
                <div><strong>ID:</strong> {debugInfo.user.id}</div>
                <div><strong>Email:</strong> {debugInfo.user.email}</div>
                <div><strong>Name:</strong> {debugInfo.user.full_name || 'N/A'}</div>
                <div><strong>Username:</strong> {debugInfo.user.username || 'N/A'}</div>
                <div><strong>Rating:</strong> {debugInfo.user.rating || 'N/A'}</div>
              </div>
            </div>
          )}

          {/* Token Info */}
          <div>
            <div className="text-sm font-medium mb-2 flex items-center justify-between">
              <span>Access Token:</span>
              {debugInfo.token && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(debugInfo.token!)}
                  className="h-6 px-2"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              )}
            </div>
            <div className="text-xs font-mono bg-gray-50 p-2 rounded break-all mb-2">
              {maskToken(debugInfo.token)}
            </div>
            {debugInfo.tokenExpiry && (
              <div className="text-xs text-gray-600 italic">
                Expires: {formatTokenExpiry(debugInfo.tokenExpiry)}
              </div>
            )}
          </div>

          {debugInfo.refreshToken && (
            <div>
              <div className="text-sm font-medium mb-2 flex items-center justify-between">
                <span>Refresh Token:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(debugInfo.refreshToken!)}
                  className="h-6 px-2"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              <div className="text-xs font-mono bg-gray-50 p-2 rounded break-all">
                {maskToken(debugInfo.refreshToken)}
              </div>
            </div>
          )}

          {/* API URL */}
          <div>
            <div className="text-sm font-medium mb-2">API URL:</div>
            <div className="text-xs font-mono bg-gray-50 p-2 rounded">
              {debugInfo.apiUrl}
            </div>
          </div>

          {/* Test Buttons */}
          <div>
            <div className="text-sm font-medium mb-2">API Tests:</div>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={testLogin}
              >
                Test Login Endpoint
              </Button>
              {debugInfo.testResults.login && (
                <div className={`text-xs p-2 rounded ${
                  debugInfo.testResults.login.status === 'success'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }`}>
                  {debugInfo.testResults.login.message}
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={testGetCurrentUser}
                disabled={!debugInfo.token}
              >
                Test Get Current User
              </Button>
              {debugInfo.testResults.getCurrentUser && (
                <div className={`text-xs p-2 rounded ${
                  debugInfo.testResults.getCurrentUser.status === 'success'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }`}>
                  {debugInfo.testResults.getCurrentUser.message}
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={testRefreshToken}
                disabled={!debugInfo.refreshToken}
              >
                Test Refresh Token
              </Button>
              {debugInfo.testResults.refresh && (
                <div className={`text-xs p-2 rounded ${
                  debugInfo.testResults.refresh.status === 'success'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }`}>
                  {debugInfo.testResults.refresh.message}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 border-t">
            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={async () => {
                await authAPI.logout();
                toast.success('Logged out');
                checkAuthStatus();
              }}
              disabled={!debugInfo.token}
            >
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

