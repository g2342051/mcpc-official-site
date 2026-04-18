import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Top from './pages/Top';
import Consent from './pages/Consent';

function App() {
  return (
    <Router>
      <Routes>
        {/* URLが "/"（トップページ）の時に Top コンポーネントを表示 */}
        <Route path="/" element={<Top />} />
        
        {/* URLが "/consent" の時に Consent コンポーネントを表示 */}
        <Route path="/consent" element={<Consent />} />

        {/* どこにも当てはまらないURLの場合はトップへ戻す（念のため） */}
        {/*<Route path="*" element={<Top />} />*/}
      </Routes>
    </Router>
  );
}

export default App;