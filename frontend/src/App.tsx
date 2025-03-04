import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecipeList from './pages/RecipeList';
import RecipeInfo from './pages/RecipeInfo';
import Header from './components/Header';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<RecipeList />} />
            <Route path="/recipe/:id" element={<RecipeInfo />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;