import { lazy, Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useNavigation } from './hooks';
import { ROUTES } from './constants';

// Lazy load heavy page components
const AuthPage = lazy(() => import('./components/auth/AuthPage'));
const CarbonMathPage = lazy(() => import('./components/education/CarbonMathPage'));
const QuizPage = lazy(() => import('./components/quiz/QuizPage'));
const DashboardPage = lazy(() => import('./components/dashboard/DashboardPage'));
const ActionCenter = lazy(() => import('./components/actions/ActionCenter'));
const GardenPage = lazy(() => import('./components/garden/GardenPage'));
const LeaderboardPage = lazy(() => import('./components/leaderboard/LeaderboardPage'));

// Loading fallback component
function PageLoader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>
  );
}

function AppContent() {
  const { currentPage, navigate } = useNavigation(ROUTES.EDUCATION);

  const renderPage = () => {
    const pageProps: Record<string, React.ReactNode> = {
      [ROUTES.AUTH]: <AuthPage />,
      [ROUTES.EDUCATION]: <CarbonMathPage />,
      [ROUTES.DASHBOARD]: <ProtectedRoute><DashboardPage /></ProtectedRoute>,
      [ROUTES.QUIZ]: <ProtectedRoute><QuizPage /></ProtectedRoute>,
      [ROUTES.ACTIONS]: <ProtectedRoute><ActionCenter /></ProtectedRoute>,
      [ROUTES.GARDEN]: <ProtectedRoute><GardenPage /></ProtectedRoute>,
      [ROUTES.LEADERBOARD]: <ProtectedRoute><LeaderboardPage /></ProtectedRoute>,
    };

    return pageProps[currentPage] || <CarbonMathPage />;
  };

  return (
    <AppLayout currentPage={currentPage} onNavigate={navigate}>
      <Suspense fallback={<PageLoader />}>
        {renderPage()}
      </Suspense>
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
