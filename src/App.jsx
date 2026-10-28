import { BrowserRouter, Route, Routes } from "react-router";

import AppLayout from "./layouts/AppLayout";

import Dashboard from "./pages/Dashboard";
import ExploreQuizzes from "./pages/ExploreQuizzes";
import HistoryPage from "./pages/HistoryPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import NotFound from "./pages/NotFound";
import QuizPage from "./pages/QuizPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />

          <Route path="explore" element={<ExploreQuizzes />} />

          <Route path="quiz" element={<QuizPage />} />

          <Route path="history" element={<HistoryPage />} />

          <Route path="leaderboard" element={<LeaderboardPage />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
