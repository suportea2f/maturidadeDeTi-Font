import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';
import { UsersPage } from './pages/UsersPage';
import { QuestionsPage } from './pages/QuestionsPage';
import QuestionTypesPage from './pages/QuestionTypesPage';
import { EvaluationsPage } from './pages/EvaluationsPage';
import { CreateEvaluationPage } from './pages/CreateEvaluationPage';
import { EvaluationDetailsPage } from './pages/EvaluationDetailsPage';
import { EvaluationResponsePage } from './pages/EvaluationResponsePage';
import EvaluationResultPage from './pages/EvaluationResultPage';
import { FinalizedEvaluationsPage } from './pages/FinalizedEvaluationsPage';
import { PrivateRoute } from './components/PrivateRoute';
import { EvaluationFormPage } from './pages/EvaluationFormPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Rotas Privadas */}
      <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
      
      {/* Rotas de Administração */}
      <Route path="/users" element={<PrivateRoute><UsersPage /></PrivateRoute>} />
      <Route path="/questions" element={<PrivateRoute><QuestionsPage /></PrivateRoute>} />
      <Route path="/question-types" element={<PrivateRoute><QuestionTypesPage /></PrivateRoute>} />
      
      {/* Rotas de Avaliação */}
      <Route path="/evaluations" element={<PrivateRoute><EvaluationsPage /></PrivateRoute>} />
      <Route path="/evaluations/create" element={<PrivateRoute><CreateEvaluationPage /></PrivateRoute>} />
      <Route path="/evaluations/:id" element={<PrivateRoute><EvaluationDetailsPage /></PrivateRoute>} />
      <Route path="/evaluations/:id/edit" element={<PrivateRoute><EvaluationFormPage /></PrivateRoute>} />
      <Route path="/evaluations/:id/respond" element={<PrivateRoute><EvaluationResponsePage /></PrivateRoute>} />
      <Route path="/evaluations/:id/result" element={<PrivateRoute><EvaluationResultPage /></PrivateRoute>} />
      
      {/* Rotas de Avaliações Finalizadas */}
      <Route path="/finalized-evaluations" element={<PrivateRoute><FinalizedEvaluationsPage /></PrivateRoute>} />
      <Route path="/finalized-evaluations/:id" element={<PrivateRoute><EvaluationResultPage /></PrivateRoute>} />
    </Routes>
  );
}; 