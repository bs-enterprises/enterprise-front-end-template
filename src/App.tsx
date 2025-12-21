import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LayoutWithAppShell } from './components/AppShell';
import { RequireAuth } from './components/RequireAuth';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LayoutProvider } from './contexts/LayoutContext';

// Auth modules
import { Login } from './modules/auth/Login';
import { Signup } from './modules/auth/Signup';
import { ForgotPassword } from './modules/auth/ForgotPassword';

// Main application modules
import { Dashboard } from './modules/dashboard/Dashboard';
import { Settings } from './modules/settings/Settings';
import { Support } from './modules/support/Support';

// Account modules
import { Profile } from './modules/account/Profile';
import { SessionInspector } from './modules/account/SessionInspector';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LayoutProvider>
          <BrowserRouter>
            <Routes>
              {/* Public auth routes */}
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/signup" element={<Signup />} />
              <Route path="/auth/forgot" element={<ForgotPassword />} />

              {/* Protected routes - rendered inside LayoutWithAppShell */}
              <Route
                element={
                  <RequireAuth>
                    <LayoutWithAppShell />
                  </RequireAuth>
                }
              >
                {/* Main application routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/support" element={<Support />} />

                {/* Account routes */}
                <Route path="/account/profile" element={<Profile />} />
                <Route path="/account/inspector" element={<SessionInspector />} />
              </Route>

              {/* Redirect root and unknown routes */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </LayoutProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
