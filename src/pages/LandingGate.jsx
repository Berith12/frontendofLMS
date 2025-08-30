import { useEffect, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import Home from './home';

// Shows Home exactly once per browser (until storage is cleared),
// then routes users to Featured for subsequent visits to '/'.
export default function LandingGate() {
  const seen = useMemo(() => {
    try {
      return localStorage.getItem('seenHomeOnce') === '1';
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    if (!seen) {
      try {
        localStorage.setItem('seenHomeOnce', '1');
      } catch {}
    }
  }, [seen]);

  if (seen) {
    return <Navigate to="/featured" replace />;
  }
  return <Home />;
}
