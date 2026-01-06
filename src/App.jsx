import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './pages/Layout' // Import the new layout
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import Inventory from './pages/Inventory'
import Customers from './pages/Customers'
import Drivers from './pages/Drivers'
import Settings from './pages/Settings'
import SuperDeals from './pages/SuperDeals'
import { Toaster } from "react-hot-toast";
import useAdminSocket from './hooks/useAdminSocket';

function App() {
    useAdminSocket();
  return (
    <BrowserRouter>
    
      {/* ✅ GLOBAL TOASTER */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { fontSize: "14px" },
        }}
      />

      <Routes>
        {/* WRAP ALL ROUTES INSIDE THE LAYOUT ELEMENT */}
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="superdeals" element={<SuperDeals/>}/>
          <Route path="/settings" element={<Settings />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;