import React from 'react';

interface EvaluationResult {
  pontuacao: number;
  percentual: number;
  pesoAtingido: number;
  usuario: string;
  empresa: string;
  nivelMaturidade: string;
  recomendacoes: string[];
  dataFinalizacao: string;
}

interface EvaluationResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: EvaluationResult;
}

const EvaluationResultModal: React.FC<EvaluationResultModalProps> = ({ isOpen, onClose, result }) => {
  if (!isOpen) return null;

  const getMaturityLevel = (percentual: number) => {
    if (percentual >= 80) return { 
      level: 'Alto', 
      color: '#68d391', 
      bgColor: '#22543d',
      icon: '✓'
    };
    if (percentual >= 50) return { 
      level: 'Médio', 
      color: '#f6ad55', 
      bgColor: '#744210',
      icon: '⚠'
    };
    return { 
      level: 'Baixo', 
      color: '#fc8181', 
      bgColor: '#742a2a',
      icon: 'ⓘ'
    };
  };

  const maturityInfo = getMaturityLevel(result.percentual);

  const getScoreColor = (score: number) => {
    if (score >= 70) return '#68d391';
    if (score >= 40) return '#f6ad55';
    return '#fc8181';
  };

  const styles = {
    overlay: {
      position: 'fixed' as const,
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1300,
      padding: '16px'
    },
    dialog: {
      backgroundColor: '#1a1d23',
      borderRadius: '12px',
      boxShadow: '0 11px 15px -7px rgba(0,0,0,0.3), 0 24px 38px 3px rgba(0,0,0,0.2), 0 9px 46px 8px rgba(0,0,0,0.15)',
      maxWidth: '768px',
      width: '100%',
      maxHeight: '90vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column' as const,
      border: '1px solid #2d3748'
    },
    header: {
      background: 'linear-gradient(135deg, #2d5a87 0%, #1a365d 100%)',
      color: 'white',
      padding: '24px',
      position: 'relative' as const
    },
    closeButton: {
      position: 'absolute' as const,
      top: '16px',
      right: '16px',
      background: 'none',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      transition: 'background-color 0.2s',
      // @ts-ignore
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
      }
    } as React.CSSProperties,
    headerContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    avatar: {
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px'
    },
    content: {
      padding: '24px',
      flex: 1,
      overflowY: 'auto' as const,
      backgroundColor: '#1a1d23'
    },
    contentBox: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '24px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px'
    },
    scoreCard: {
      backgroundColor: '#2d3748',
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 2px 1px -1px rgba(0,0,0,0.4), 0 1px 1px 0 rgba(0,0,0,0.3), 0 1px 3px 0 rgba(0,0,0,0.2)',
      borderLeft: '4px solid',
      height: '100%',
      border: '1px solid #4a5568'
    },
    scoreCardContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    scoreCardAvatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px'
    },
    maturityCard: {
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.4)',
      backgroundColor: '#2d3748',
      border: '1px solid #4a5568'
    },
    maturityHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      marginBottom: '8px'
    },
    maturityAvatar: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px'
    },
    progressBar: {
      height: '8px',
      backgroundColor: 'rgba(0,0,0,0.1)',
      borderRadius: '4px',
      overflow: 'hidden' as const
    },
    progressFill: {
      height: '100%',
      borderRadius: '4px',
      transition: 'width 0.3s ease'
    },
    card: {
      backgroundColor: '#2d3748',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.4)',
      border: '1px solid #4a5568'
    },
    cardContent: {
      padding: '16px'
    },
    divider: {
      height: '1px',
      backgroundColor: 'rgba(255,255,255,0.12)',
      margin: '16px 0'
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '24px'
    },
    infoItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    infoAvatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px'
    },
    chipContainer: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: '8px'
    },
    chip: {
      padding: '6px 16px',
      borderRadius: '16px',
      background: 'linear-gradient(135deg, #2d5a87 0%, #1a365d 100%)',
      color: 'white',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
      border: 'none'
    },
    footer: {
      padding: '24px',
      backgroundColor: '#1a1d23',
      borderTop: '1px solid #4a5568',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    button: {
      padding: '10px 32px',
      borderRadius: '8px',
      background: 'linear-gradient(135deg, #2d5a87 0%, #1a365d 100%)',
      color: 'white',
      border: 'none',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.2s',
      textTransform: 'none' as const
    }
  };

  const ScoreCard = ({ title, value, icon, color }: { title: string; value: string; icon: string; color: string }) => (
    <div style={{...styles.scoreCard, borderLeftColor: color}}>
      <div style={styles.scoreCardContent}>
        <div>
          <div style={{ fontSize: '14px', color: '#a0aec0', marginBottom: '4px' }}>
            {title}
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color }}>
            {value}
          </div>
        </div>
        <div style={{...styles.scoreCardAvatar, backgroundColor: `${color}20`, color}}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.dialog} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <button 
            style={styles.closeButton}
            onClick={onClose}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            ✕
          </button>
          
          <div style={styles.headerContent}>
            <div style={styles.avatar}>
              📊
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>
                Resultado da Avaliação
              </h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '16px', opacity: 0.8 }}>
                Análise de Maturidade em TI
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={styles.content}>
          <div style={styles.contentBox}>
            {/* Score Cards */}
            <div style={styles.grid}>
              <ScoreCard
                title="Pontuação Total"
                value={`${result.pontuacao.toFixed(1)}%`}
                icon="📊"
                color={getScoreColor(result.pontuacao)}
              />
              <ScoreCard
                title="Percentual Atingido"
                value={`${result.percentual.toFixed(1)}%`}
                icon="📈"
                color={getScoreColor(result.percentual)}
              />
              <ScoreCard
                title="Peso Atingido"
                value={`${result.pesoAtingido.toFixed(1)}%`}
                icon="⭐"
                color={getScoreColor(result.pesoAtingido)}
              />
            </div>

            {/* Maturity Level */}
            <div style={{...styles.maturityCard, backgroundColor: maturityInfo.bgColor}}>
              <div style={styles.maturityHeader}>
                <div style={{...styles.maturityAvatar, backgroundColor: maturityInfo.color}}>
                  {maturityInfo.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: 'white' }}>
                    Nível de Maturidade: {maturityInfo.level}
                  </h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#a0aec0' }}>
                    {result.percentual.toFixed(1)}% de desenvolvimento
                  </p>
                </div>
              </div>
              <div style={styles.progressBar}>
                <div 
                  style={{
                    ...styles.progressFill,
                    width: `${result.percentual}%`,
                    backgroundColor: maturityInfo.color
                  }}
                />
              </div>
            </div>

            {/* User Information */}
            <div style={styles.card}>
              <div style={styles.cardContent}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
                  👤 Informações da Avaliação
                </h3>
                <div style={styles.divider} />
                <div style={styles.infoGrid}>
                  <div style={styles.infoItem}>
                    <div style={{...styles.infoAvatar, backgroundColor: '#2b6cb8', color: '#90cdf4'}}>
                      👤
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', color: '#a0aec0' }}>Usuário</div>
                      <div style={{ fontSize: '16px', fontWeight: '500', color: 'white' }}>{result.usuario}</div>
                    </div>
                  </div>
                  <div style={styles.infoItem}>
                    <div style={{...styles.infoAvatar, backgroundColor: '#553c9a', color: '#c084fc'}}>
                      🏢
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', color: '#a0aec0' }}>Empresa</div>
                      <div style={{ fontSize: '16px', fontWeight: '500', color: 'white' }}>{result.empresa}</div>
                    </div>
                  </div>
                </div>
                {result.dataFinalizacao && (
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.12)' }}>
                    <div style={{ fontSize: '12px', color: '#a0aec0' }}>
                      Finalizada em: {new Date(result.dataFinalizacao).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recommendations */}
            {result.recomendacoes && result.recomendacoes.length > 0 && (
              <div style={styles.card}>
                <div style={styles.cardContent}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
                    ✅ Recomendações
                  </h3>
                  <div style={styles.divider} />
                  <div style={styles.chipContainer}>
                    {result.recomendacoes.map((recomendacao, index) => (
                      <button
                        key={index}
                        style={styles.chip}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #2c5282 0%, #2a4365 100%)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #2d5a87 0%, #1a365d 100%)'}
                      >
                        {recomendacao}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <div style={{ fontSize: '14px', color: '#a0aec0' }}>
            Esta análise foi gerada com base nas respostas fornecidas
          </div>
          <button
            style={styles.button}
            onClick={onClose}
            onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #2c5282 0%, #2a4365 100%)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #2d5a87 0%, #1a365d 100%)'}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EvaluationResultModal; 