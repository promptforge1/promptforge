import { BrowserRouter, Routes, Route } from 'react-router'
import Layout from './components/Layout'
import Home from './pages/Home'
import Optimize from './pages/Optimize'
import Models from './pages/Models'
import Templates from './pages/Templates'
import Pricing from './pages/Pricing'
import Docs from './pages/Docs'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="optimize" element={<Optimize />} />
          <Route path="models" element={<Models />} />
          <Route path="templates" element={<Templates />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="docs" element={<Docs />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
