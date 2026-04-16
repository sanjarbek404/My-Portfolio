/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Portfolio from './pages/Portfolio';
import Login from './pages/Login';
import Admin from './pages/Admin';
import CVBuilder from './pages/CVBuilder';
import { LanguageProvider } from './lib/LanguageContext';
import { GoogleAnalytics } from './components/GoogleAnalytics';

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <GoogleAnalytics />
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: '#1d1d1f',
              color: '#fff',
              borderRadius: '16px',
              padding: '16px 24px',
              fontSize: '14px',
              fontWeight: '500'
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/cv-builder" element={<CVBuilder />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}
