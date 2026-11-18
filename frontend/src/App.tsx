import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegistroPage from './pages/RegistroPage';
import GestionUsuariosPage from './pages/GestionUsuariosPage';
import NoticiasPage from './pages/NoticiasPage';
import NoticiaFormPage from './pages/NoticiaFormPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/registro" element={<RegistroPage />} />
        <Route path="/usuarios" element={<GestionUsuariosPage />} />
        <Route path="/noticias" element={<NoticiasPage />} />
        <Route path="/noticias/nueva" element={<NoticiaFormPage />} />
        <Route path="/noticias/:id/editar" element={<NoticiaFormPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
