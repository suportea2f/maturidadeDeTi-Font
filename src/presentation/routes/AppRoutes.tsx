import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { UsersPage } from '../pages/UsersPage';
import { EvaluationsPage } from '../pages/EvaluationsPage';
import { QuestionsPage } from '../pages/QuestionsPage';
import { EvaluationFormPage } from '../pages/EvaluationFormPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ProfilePage } from '../pages/ProfilePage';
import { DashboardPage } from '../pages/DashboardPage';
import QuestionTypesPage from '../pages/QuestionTypesPage';
import { RulesPage } from '../pages/RulesPage';
import { ProtectedRoute } from './ProtectedRoute';
import { AuthenticatedLayout } from '../layouts/AuthenticatedLayout';
import { PublishedEvaluationsPage } from '../pages/PublishedEvaluationsPage';
import { EvaluationResponsePage } from '../pages/EvaluationResponsePage';

export const AppRoutes: React.FC = () => {
  const token = localStorage.getItem('token');

  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />

      {/* Rotas Protegidas */}
      <Route element={<AuthenticatedLayout/>}>
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
        <Route path="/evaluations" element={<ProtectedRoute><EvaluationsPage /></ProtectedRoute>} />
        <Route path="/evaluations/published" element={<ProtectedRoute><PublishedEvaluationsPage /></ProtectedRoute>} />
        <Route path="/evaluations/new" element={<ProtectedRoute><EvaluationFormPage /></ProtectedRoute>} />
        <Route path="/evaluations/:id/edit" element={<ProtectedRoute><EvaluationFormPage /></ProtectedRoute>} />
        <Route path="/evaluations/:id/respond" element={<ProtectedRoute><EvaluationResponsePage /></ProtectedRoute>} />
        <Route path="/questions" element={<ProtectedRoute><QuestionsPage /></ProtectedRoute>} />
        <Route path="/question-types" element={<ProtectedRoute><QuestionTypesPage /></ProtectedRoute>} />
        <Route path="/rules" element={<ProtectedRoute><RulesPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      </Route>

      {/* Redireciona qualquer outra rota para login ou home */}
      <Route path="*" element={
        token ? <Navigate to="/" replace /> : <Navigate to="/login" replace />
      } />
    </Routes>
  );
}; 