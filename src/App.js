// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import SignIn from './Pages/SignIn';
import Dashboard from './Pages/FileUpload';
import ProtectedRoute from './ProtectedRoutes/ProtectedRoute';

function App() {
  return (
    <div>

      <Router>
        <Routes>
          <Route index path="/" element={<SignIn />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/dashboard" element={<ProtectedRoute Component={<Dashboard/>}/>}/>
        </Routes>
      </Router>

    </div>
  );
}



export default App;
