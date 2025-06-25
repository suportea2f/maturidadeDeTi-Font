import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  TextField,
  InputAdornment,
  useTheme,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { IQuestion } from '../../core/domain/interfaces/IQuestion';
import { questionService } from '../../infrastructure/api/api';

interface QuestionSelectorProps {
  selectedQuestions: string[];
  onQuestionsChange: (questionIds: string[]) => void;
}

export const QuestionSelector: React.FC<QuestionSelectorProps> = ({
  selectedQuestions,
  onQuestionsChange,
}) => {
  const theme = useTheme();
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data = await questionService.getAll() as IQuestion[];
        setQuestions(data);
      } catch (error) {
        console.error('Erro ao carregar questões:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const filteredQuestions = questions.filter(question =>
    question.pergunta.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleQuestion = (questionId: string) => {
    const newSelectedQuestions = selectedQuestions.includes(questionId)
      ? selectedQuestions.filter(id => id !== questionId)
      : [...selectedQuestions, questionId];
    
    onQuestionsChange(newSelectedQuestions);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Selecione as Questões
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Buscar questões..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress />
        </Box>
      ) : (
        <List sx={{ 
          maxHeight: 300, 
          overflow: 'auto',
          bgcolor: theme.palette.background.paper,
          borderRadius: 1,
          border: `1px solid ${theme.palette.divider}`,
        }}>
          {filteredQuestions.map((question) => (
            <ListItem
              key={question._id}
              sx={{
                borderBottom: `1px solid ${theme.palette.divider}`,
                '&:last-child': {
                  borderBottom: 'none',
                },
              }}
            >
              <ListItemText
                primary={question.pergunta}
                secondary={question.tipo}
              />
              <ListItemSecondaryAction>
                <Checkbox
                  edge="end"
                  checked={selectedQuestions.includes(question._id!)}
                  onChange={() => handleToggleQuestion(question._id!)}
                />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}; 