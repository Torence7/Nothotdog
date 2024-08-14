import React, { useState } from 'react';
import './css/App.css';
import WebSocketComponent from './WebSocketComponent';
import RecordedTests from './RecordedTestsComponent';
import ConfigurationComponent from './ConfigurationComponent';
import EvaluationComponent from './EvaluationComponent';
import RestEvaluationComponent from './RestEvaluationComponent';
import Sidebar from './Sidebar';
import { AuthProvider, useAuth } from './AuthContext';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/sign-in" />;
}

function SignInComponent() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleSignIn = async () => {
      try {
        await signIn();
      } catch (error) {
        console.error('Sign-in failed:', error);
      } finally {
        navigate('/voice-evaluation'); // Redirect to /voice-evaluation regardless
      }
    };

    handleSignIn();
  }, [signIn, navigate]);

  // Return nothing, as we don't want to render any sign-in UI
  return null;
}

function AppContent() {
  const [activeTab, setActiveTab] = useState('Voice Evaluation');
  const { user, signIn, signOut } = useAuth();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="app">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        user={user}
        signIn={signIn}
        signOut={signOut}
      />
      <div className="main-content">
        <div className="content-wrapper">
          <Routes>
            <Route path="/sign-in" element={<SignInComponent />} />
            <Route
              path="/api-testing"
              element={<PrivateRoute><WebSocketComponent /></PrivateRoute>}
            />
            <Route
              path="/recorded-tests"
              element={<PrivateRoute><RecordedTests /></PrivateRoute>}
            />
            <Route
              path="/configuration"
              element={<PrivateRoute><ConfigurationComponent /></PrivateRoute>}
            />
            <Route
              path="/voice-evaluation"
              element={<EvaluationComponent />} /> {/* Always accessible */}
            <Route
              path="/text-evaluation"
              element={<PrivateRoute><RestEvaluationComponent /></PrivateRoute>}
            />
            <Route path="/" element={<Navigate to="/voice-evaluation" />} /> {/* Default route */}
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
