import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Divider,
  Button,
} from '@mui/material';
import { EvaluationForm } from '../components/EvaluationForm';
import { EvaluationUseCase } from '../../core/useCases/EvaluationUseCase';
import { EvaluationRepository } from '../../infrastructure/repositories/EvaluationRepository';
import { IEvaluation } from '../../core/domain/interfaces/IEvaluation';
import { IQuestion } from '../../core/domain/interfaces/IQuestion';
import { api } from '../../infrastructure/api/api';

export const EvaluationFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [evaluation, setEvaluation] = useState<IEvaluation | null>(null);
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState(false);

  const evaluationRepository = useMemo(() => new EvaluationRepository(), []);
  const evaluationUseCase = useMemo(() => new EvaluationUseCase(evaluationRepository), [evaluationRepository]);

  useEffect(() => {
    // Obter o userId do usuário logado
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserId(user.id || user._id || '');
      // verifica admin: roleId, role, nome ou email contendo "admin"
      const roleIdStr = String(user.roleId || '').toLowerCase();
      if (roleIdStr.includes('admin')) {
        setIsAdmin(true);
      }
      if (user.role && String(user.role).toLowerCase().includes('admin')) {
        setIsAdmin(true);
      }
      if (user.nome && String(user.nome).toLowerCase().includes('admin')) {
        setIsAdmin(true);
      }
      if (user.email && String(user.email).toLowerCase().includes('admin')) {
        setIsAdmin(true);
      }
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log('Iniciando carregamento de dados. ID:', id);

        // Carregar perguntas
        const questionsResponse = await api.get<IQuestion[]>('/questions');
        console.log('Perguntas carregadas:', questionsResponse.data);
        setQuestions(questionsResponse.data);

        // Se estiver editando, carregar avaliação
        if (id) {
          console.log('Tentando carregar avaliação com ID:', id);
          const evaluationData = await evaluationUseCase.getEvaluationById(id);
          console.log('Dados da avaliação recebidos:', evaluationData);
          
          if (evaluationData) {
            setEvaluation(evaluationData);
            // Determinar perguntas já selecionadas
            if ((evaluationData as any).questions && Array.isArray((evaluationData as any).questions)) {
              const ids = (evaluationData as any).questions.map((q: any) => q._id || q.id || q.questionId).filter(Boolean);
              setSelectedQuestions(ids);
            } else {
              setSelectedQuestions([]);
            }
            console.log('Avaliação carregada com sucesso');
          } else {
            console.log('Avaliação não encontrada');
            setError('Avaliação não encontrada');
          }
        }
      } catch (err) {
        console.error('Erro detalhado ao carregar dados:', err);
        setError('Erro ao carregar dados. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, evaluationUseCase]);

  const handleSubmit = async (data: Omit<IEvaluation, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      console.log('Iniciando submissão do formulário com dados:', data);
      
      if (id) {
        // Modo edição: construir payload conforme especificação
        const questionsPayload = selectedQuestions.map((qid) => {
          const q = questions.find((qq) => qq._id === qid);
          return {
            questionId: qid,
            opcoes: q?.respostas?.map((r) => ({ texto: r.texto, peso: r.peso })) || [],
          };
        });

        const payload = {
          titulo: data.titulo,
          descricao: data.descricao,
          publicada: true,
          questions: questionsPayload,
          tempoLimiteMinutos: data.tempoLimiteMinutos,
          quantidadeParticipantes: data.quantidadeParticipantes,
        } as any;

        console.log('Payload de atualização:', payload);

        await evaluationUseCase.updateEvaluation(id, payload);
      } else {
        // Criação: payload simples com questionIds
        const payload = {
          titulo: data.titulo,
          descricao: data.descricao,
          userId,
          questionIds: selectedQuestions,
          tempoLimiteMinutos: data.tempoLimiteMinutos,
          quantidadeParticipantes: data.quantidadeParticipantes,
        } as any;

        console.log('Criando nova avaliação', payload);
        await evaluationUseCase.createEvaluation(payload);
      }
      
      console.log('Operação concluída com sucesso');
      navigate('/evaluations');
    } catch (err) {
      console.error('Erro detalhado ao salvar avaliação:', err);
      setError('Erro ao salvar avaliação');
    }
  };

  const handleQuestionToggle = (questionId: string) => {
    setSelectedQuestions(prev => {
      if (prev.includes(questionId)) {
        return prev.filter(id => id !== questionId);
      } else {
        return [...prev, questionId];
      }
    });
  };

  const handleUnpublish = async () => {
    if (!id) return;
    try {
      setLoading(true);
      await evaluationUseCase.updateEvaluation(id, { publicada: false });
      const refreshed = await evaluationUseCase.getEvaluationById(id);
      setEvaluation(refreshed);
    } catch (err) {
      console.error('Erro ao despublicar:', err);
      setError('Erro ao despublicar avaliação');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {id ? 'Editar Avaliação' : 'Nova Avaliação'}
      </Typography>

      {/* Card com detalhes da avaliação */}
      {evaluation && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Detalhes da Avaliação
            </Typography>
            <Typography><strong>Título:</strong> {evaluation.titulo}</Typography>
            <Typography><strong>Descrição:</strong> {evaluation.descricao}</Typography>
            <Typography><strong>Status:</strong> {evaluation.status}</Typography>
            {(() => {
              const showUnpublish = isAdmin && (evaluation.publicada === true || (evaluation.status && evaluation.status.toLowerCase() === 'publicada'));
              console.log('Render Detalhes: isAdmin', isAdmin, 'publicada', evaluation.publicada, 'showUnpublish', showUnpublish);
              return showUnpublish ? (
                <Button variant="outlined" color="warning" sx={{ mt:2 }} onClick={handleUnpublish}>
                  Despublicar
                </Button>
              ) : null;
            })()}
          </CardContent>
        </Card>
      )}

      {/* Formulário de edição */}
      <Box sx={{ mb: 4 }}>
        <EvaluationForm
          evaluation={evaluation || undefined}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/evaluations')}
        />
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Construir listas filtradas */}
      {(() => {
        const selObjs = questions.filter(q => selectedQuestions.includes(q._id || (q as any).id || ''));
        const availObjs = questions.filter(q => !selectedQuestions.includes(q._id || (q as any).id || ''));

        return (
          <>
            {/* Perguntas selecionadas */}
            <Typography variant="h6" gutterBottom>
              Perguntas Selecionadas ({selObjs.length})
            </Typography>
            <TableContainer component={Paper} sx={{ mb: 4 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Pergunta</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell align="right">Peso Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selObjs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center">Nenhuma pergunta selecionada</TableCell>
                    </TableRow>
                  ) : selObjs.map((question) => (
                    <TableRow key={`sel-${question._id}`} hover onClick={() => handleQuestionToggle(question._id!)} sx={{ cursor: 'pointer' }}>
                      <TableCell>{question.pergunta}</TableCell>
                      <TableCell>{question.tipo}</TableCell>
                      <TableCell align="right">{question.pesoTotal}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Perguntas disponíveis */}
            <Typography variant="h6" gutterBottom>
              Perguntas Disponíveis ({availObjs.length})
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Pergunta</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell align="right">Peso Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {availObjs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center">Nenhuma pergunta disponível</TableCell>
                    </TableRow>
                  ) : availObjs.map((question) => (
                    <TableRow key={`avail-${question._id}`} hover onClick={() => handleQuestionToggle(question._id!)} sx={{ cursor: 'pointer' }}>
                      <TableCell>{question.pergunta}</TableCell>
                      <TableCell>{question.tipo}</TableCell>
                      <TableCell align="right">{question.pesoTotal}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        );
      })()}
    </Container>
  );
}; 