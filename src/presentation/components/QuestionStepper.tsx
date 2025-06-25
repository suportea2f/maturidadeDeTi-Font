import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  TextField,
} from '@mui/material';
import { IQuestion, IOption } from '../../core/domain/interfaces/IQuestion';
import { api } from '../../infrastructure/api/api';

interface QuestionStepperProps {
  evaluationId: string;
  questions: IQuestion[];
  onFinish: () => void;
}

export const QuestionStepper: React.FC<QuestionStepperProps> = ({ evaluationId, questions, onFinish }) => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, IOption | IOption[] | string>>({});

  const handleAnswerChange = (question: IQuestion, value: any) => {
    setAnswers(prev => ({ ...prev, [question._id]: value }));
  };

  const handleNext = async () => {
    if (current < questions.length - 1) setCurrent(c => c + 1);
    else await handleFinish();
  };

  const handleBack = () => {
    if (current > 0) setCurrent(c => c - 1);
  };

  const handleFinish = async () => {
    const respostas = Object.entries(answers).map(([questionId, answer]) => {
      return {
        questaoId: questionId,
        respostaId: (answer as any).texto || answer,
        peso: (answer as any).peso || 0
      };
    });
    try {
      await api.post(`/evaluations/${evaluationId}/responses`, { respostas });
      onFinish();
    } catch (err) {
      console.error('Erro ao enviar respostas', err);
    }
  };

  const q = questions[current];
  if (!q) return null;

  return (
    <Box>
      <Stepper activeStep={current} alternativeLabel sx={{ mb: 4 }}>
        {questions.map((_, idx) => (
          <Step key={idx}><StepLabel /></Step>
        ))}
      </Stepper>

      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Pergunta {current + 1} de {questions.length}
        </Typography>
        <Typography variant="h5" gutterBottom>{q.pergunta}</Typography>

        {/* Opções */}
        {q.respostas && (
          <RadioGroup
            key={`rg-${q._id}`}
            name={`question-${q._id}`}
            value={(answers[q._id] as IOption)?.texto || ''}
            onChange={(_, val) => {
              const opt = q.respostas!.find(o => o.texto === val);
              if (opt) handleAnswerChange(q, opt);
            }}
          >
            {q.respostas.map(opt => (
              <FormControlLabel key={opt.texto} value={opt.texto} control={<Radio />} label={opt.texto} />
            ))}
          </RadioGroup>
        )}
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button disabled={current === 0} onClick={handleBack}>Anterior</Button>
        <Button variant="contained" onClick={handleNext}>{current === questions.length - 1 ? 'Finalizar' : 'Próximo'}</Button>
      </Box>
    </Box>
  );
}; 