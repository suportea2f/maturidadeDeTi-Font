import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  TextField,
  Box,
  Typography,
  Paper,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { IQuestion } from '../../core/domain/interfaces/IQuestion';

interface SelectedQuestionListProps {
  questions: IQuestion[];
  selectedQuestions: string[];
  onSelectQuestion: (questionId: string) => void;
  onRemoveQuestion: (questionId: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const SelectedQuestionList: React.FC<SelectedQuestionListProps> = ({
  questions,
  selectedQuestions,
  onSelectQuestion,
  onRemoveQuestion,
  searchTerm,
  onSearchChange,
}) => {
  const theme = useTheme();

  const filteredQuestions = questions.filter(question =>
    question.pergunta.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Paper 
      sx={{ 
        p: 2,
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      }}
    >
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label="Buscar questões"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        <Typography variant="subtitle2" color="text.secondary">
          {filteredQuestions.length} questões encontradas
        </Typography>
      </Box>

      <List>
        {filteredQuestions.map((question) => (
          <ListItem
            key={question._id}
            divider
            sx={{
              bgcolor: selectedQuestions.includes(question._id || '')
                ? theme.palette.action.selected
                : 'inherit',
            }}
          >
            <ListItemText
              primary={question.pergunta}
              secondary={
                <Typography variant="body2" color="text.secondary">
                  Tipo: {question.tipo} | Peso Total: {question.pesoTotal}
                </Typography>
              }
            />
            <ListItemSecondaryAction>
              {selectedQuestions.includes(question._id || '') ? (
                <IconButton
                  edge="end"
                  onClick={() => onRemoveQuestion(question._id || '')}
                  color="error"
                >
                  <RemoveIcon />
                </IconButton>
              ) : (
                <IconButton
                  edge="end"
                  onClick={() => onSelectQuestion(question._id || '')}
                  color="primary"
                >
                  <AddIcon />
                </IconButton>
              )}
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}; 