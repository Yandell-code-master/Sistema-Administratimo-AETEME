import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';

/* El acceso único es RF-SU-01.01.01: el index sirve el login.
   El resto de rutas se agregan en las fases 2 y 3 (registro y gestión de usuarios). */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
