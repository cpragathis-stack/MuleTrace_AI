import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PageLayout from './components/layout/PageLayout'
import Accounts from './pages/Accounts'
import Alerts from './pages/Alerts'
import Assistant from './pages/Assistant'
import Dashboard from './pages/Dashboard'
import Investigation from './pages/Investigation'
import NetworkGraph from './pages/NetworkGraph'
import NotFound from './pages/NotFound'
import Transactions from './pages/Transactions'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PageLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="investigation" element={<Investigation />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="network" element={<NetworkGraph />} />
          <Route path="assistant" element={<Assistant />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
