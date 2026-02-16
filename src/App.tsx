import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout';
import Navigation from './components/Navigation';
import ExplorationPanel from './components/exploration/ExplorationPanel';
import CombatPanel from './components/combat/CombatPanel';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Navigation />
          <Routes>
            <Route path="/" element={<Navigate to="/exploration" replace />} />
            <Route path="/exploration" element={<ExplorationPanel />} />
            <Route path="/combat" element={<CombatPanel />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App
