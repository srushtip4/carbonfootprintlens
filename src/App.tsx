import { AuthProvider } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';
import AuthPage from './components/auth/AuthPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import CarbonMathPage from './components/education/CarbonMathPage';
import QuizPage from './components/quiz/QuizPage';
import DashboardPage from './components/dashboard/DashboardPage';
import ActionCenter from './components/actions/ActionCenter';
import GardenPage from './components/garden/GardenPage';
import LeaderboardPage from './components/leaderboard/LeaderboardPage';
import { useNavigation } from './hooks';
import { ROUTES } from './constants';

function AppContent() {
  const { currentPage, navigate } = useNavigation(ROUTES.EDUCATION);

  const renderPage = () => {
    switch (currentPage) {
      case ROUTES.AUTH: return <AuthPage />;
      case ROUTES.EDUCATION: return <CarbonMathPage />;
      case ROUTES.DASHBOARD: return <ProtectedRoute><DashboardPage /></ProtectedRoute>;
      case ROUTES.QUIZ: return <ProtectedRoute><QuizPage /></ProtectedRoute>;
      case ROUTES.ACTIONS: return <ProtectedRoute><ActionCenter /></ProtectedRoute>;
      case ROUTES.GARDEN: return <ProtectedRoute><GardenPage /></ProtectedRoute>;
      case ROUTES.LEADERBOARD: return <ProtectedRoute><LeaderboardPage /></ProtectedRoute>;
      default: return <CarbonMathPage />;
    }
  };

  return (
    <AppLayout currentPage={currentPage} onNavigate={navigate}>
      {renderPage()}
    </AppLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
