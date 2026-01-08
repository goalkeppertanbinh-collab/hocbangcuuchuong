
import React, { useState } from 'react';
import { GameState, QuizResult, GameMode, MultiplayerResult as MultiResultType } from './types';
import Header from './components/Header';
import TableSelector from './components/TableSelector';
import LearningView from './components/LearningView';
import QuizGame from './components/QuizGame';
import ResultView from './components/ResultView';
import StatsView from './components/StatsView';
import MultiplayerQuiz from './components/MultiplayerQuiz';
import MultiplayerResult from './components/MultiplayerResult';

const App: React.FC = () => {
  const [state, setState] = useState<GameState>(GameState.HOME);
  const [mode, setMode] = useState<GameMode>(GameMode.MULTIPLICATION);
  const [selectedTable, setSelectedTable] = useState<number>(2);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [multiResult, setMultiResult] = useState<MultiResultType | null>(null);

  const startLearning = (table: number, selectedMode: GameMode) => {
    setSelectedTable(table);
    setMode(selectedMode);
    setState(GameState.LEARN);
  };

  const startQuiz = (table: number, selectedMode: GameMode) => {
    setSelectedTable(table);
    setMode(selectedMode);
    setState(GameState.QUIZ);
  };

  const startMultiplayer = (table: number, selectedMode: GameMode) => {
    setSelectedTable(table);
    setMode(selectedMode);
    setState(GameState.MULTIPLAYER_QUIZ);
  };

  const finishQuiz = (result: QuizResult) => {
    setQuizResult(result);
    setState(GameState.RESULT);
  };

  const finishMultiplayer = (result: MultiResultType) => {
    setMultiResult(result);
    setState(GameState.MULTIPLAYER_RESULT);
  };

  const goHome = () => {
    setState(GameState.HOME);
    setQuizResult(null);
    setMultiResult(null);
  };

  const showStats = () => {
    setState(GameState.STATS);
  };

  return (
    <div className="min-h-screen bg-sky-50 flex flex-col items-center p-4 md:p-8">
      <div className="max-w-4xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border-4 border-white">
        <Header 
          onHomeClick={goHome} 
          onStatsClick={showStats} 
          showHome={state !== GameState.HOME} 
        />
        
        <main className="flex-1 p-6 md:p-10 relative overflow-hidden">
          {state === GameState.HOME && (
            <TableSelector 
              onSelectLearn={startLearning} 
              onSelectQuiz={startQuiz} 
              onSelectMultiplayer={startMultiplayer} 
            />
          )}

          {state === GameState.LEARN && (
            <LearningView 
              table={selectedTable} 
              mode={mode}
              onBack={goHome} 
              onStartQuiz={() => startQuiz(selectedTable, mode)} 
            />
          )}

          {state === GameState.QUIZ && (
            <QuizGame 
              table={selectedTable} 
              mode={mode}
              onFinish={finishQuiz} 
              onQuit={goHome} 
            />
          )}

          {state === GameState.MULTIPLAYER_QUIZ && (
            <MultiplayerQuiz
              table={selectedTable}
              mode={mode}
              onFinish={finishMultiplayer}
              onQuit={goHome}
            />
          )}

          {state === GameState.RESULT && quizResult && (
            <ResultView 
              result={quizResult} 
              table={selectedTable}
              mode={mode}
              onRetry={() => startQuiz(selectedTable, mode)} 
              onHome={goHome} 
            />
          )}

          {state === GameState.MULTIPLAYER_RESULT && multiResult && (
            <MultiplayerResult
              result={multiResult}
              table={selectedTable}
              mode={mode}
              onRetry={() => startMultiplayer(selectedTable, mode)}
              onHome={goHome}
            />
          )}

          {state === GameState.STATS && (
            <StatsView onBack={goHome} />
          )}
        </main>
        
        <footer className="p-4 bg-sky-100 text-center text-sky-600 font-medium text-sm">
          © 2026 Cô Linh
        </footer>
      </div>
    </div>
  );
};

export default App;
