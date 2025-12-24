import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Save, 
  User, 
  Phone, 
  FileText, 
  MapPin, 
  Camera, 
  Trash2, 
  ChevronLeft,
  Upload
} from 'lucide-react';
import Pagination from '../components/Pagination'; // 1. Import Pagination
import { MOCK_DRIVERS } from '../data/mockData';

export default function Drivers() {
  const [view, setView] = useState('list'); // 'list' | 'add'
  const [drivers, setDrivers] = useState(MOCK_DRIVERS);
  const fileInputRef = useRef(null);

  // --- PAGINATION & SEARCH STATE ---
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Number of items per page

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    aadhar: '',
    address: '',
    photo: null,
    previewUrl: null
  });

  // --- FILTER & PAGINATION LOGIC ---
  
  // 1. Filter based on search
  const filteredDrivers = drivers.filter(driver => 
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.mobile.includes(searchTerm) ||
    driver.aadhar.includes(searchTerm)
  );

  // 2. Slice data for current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDrivers = filteredDrivers.slice(indexOfFirstItem, indexOfLastItem);

  // 3. Reset to page 1 if search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);


  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData({ ...formData, photo: file, previewUrl: url });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.aadhar) {
      alert("Please fill in all required fields.");
      return;
    }

    const newDriver = {
      id: drivers.length + 1,
      name: formData.name,
      mobile: formData.mobile,
      aadhar: formData.aadhar,
      address: formData.address,
      status: 'Active',
      photo: formData.previewUrl
    };

    setDrivers([newDriver, ...drivers]);
    setView('list');
    setFormData({ name: '', mobile: '', aadhar: '', address: '', photo: null, previewUrl: null });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 p-4 md:p-6 bg-slate-50 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="pl-14 md:pl-0">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Driver Management</h1>
          <p className="text-slate-500 text-sm mt-1">Onboard and manage delivery partners.</p>
        </div>
        
        {view === 'list' && (
          <button 
            onClick={() => setView('add')}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-sm transition-all active:scale-95"
          >
            <Plus size={18} /> Add New Driver
          </button>
        )}
      </div>

      {/* --- ADD DRIVER FORM --- */}
      {view === 'add' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <button 
            onClick={() => setView('list')}
            className="flex items-center text-slate-500 hover:text-slate-800 font-medium mb-6 transition-colors"
          >
            <ChevronLeft size={20} className="mr-1" /> Back to Driver List
          </button>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden max-w-4xl mx-auto">
            <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-800">New Driver Registration</h2>
              <p className="text-sm text-slate-500 mt-1">Enter the details below to register a new delivery partner.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Left Column: Photo Upload */}
              <div className="md:col-span-1 space-y-4">
                <label className="block text-sm font-semibold text-gray-700">Driver Photo</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    relative w-48 mx-auto md:w-full aspect-[3/4] rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group
                    ${formData.previewUrl ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-emerald-400 hover:bg-slate-50'}
                  `}
                >
                  {formData.previewUrl ? (
                    <img src={formData.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <div className="bg-white p-4 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                        <Camera size={28} className="text-slate-400" />
                      </div>
                      <p className="text-xs text-center text-slate-500 px-4">Tap to upload passport size photo</p>
                    </>
                  )}
                  
                  {formData.previewUrl && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-sm font-medium flex items-center gap-2"><Upload size={16}/> Change Photo</p>
                    </div>
                  )}
                  
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    accept="image/*" 
                    onChange={handlePhotoUpload} 
                    className="hidden" 
                  />
                </div>
                <p className="text-xs text-slate-400 text-center">Supported: JPG, PNG (Max 5MB)</p>
              </div>

              {/* Right Column: Text Fields */}
              <div className="md:col-span-2 space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <User size={16} className="text-slate-400" /> Full Name <span className="text-red-500">*</span>
                    </label>
                    <input 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all" 
                      placeholder="e.g. Ramesh Gupta" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Phone size={16} className="text-slate-400" /> Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input 
                      name="mobile" 
                      value={formData.mobile} 
                      onChange={handleInputChange} 
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all" 
                      placeholder="+91 00000 00000" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <FileText size={16} className="text-slate-400" /> Aadhar Number <span className="text-red-500">*</span>
                  </label>
                  <input 
                    name="aadhar" 
                    value={formData.aadhar} 
                    onChange={handleInputChange} 
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all font-mono" 
                    placeholder="0000 0000 0000" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <MapPin size={16} className="text-slate-400" /> Current Address
                  </label>
                  <textarea 
                    name="address" 
                    rows={3} 
                    value={formData.address} 
                    onChange={handleInputChange} 
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all resize-none" 
                    placeholder="Enter full residential address..." 
                  />
                </div>

                <div className="pt-4 flex flex-col md:flex-row gap-4">
                  <button 
                    type="submit" 
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold shadow-emerald-200 shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Save size={18} /> Register Driver
                  </button>
                  <button 
                    type="button"
                    onClick={() => setView('list')}
                    className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>

              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- LIST VIEW --- */}
      {view === 'list' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          {/* List Search Header */}
          <div className="p-4 border-b border-gray-100 flex gap-4 bg-gray-50/50">
            <div className="relative flex-1 md:max-w-md w-full">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search drivers..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              />
            </div>
          </div>

          {/* DESKTOP: Table View (Hidden on Mobile) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-slate-500 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Driver Details</th>
                  <th className="px-6 py-4">Verification</th>
                  <th className="px-6 py-4">Address</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentDrivers.map((driver) => (
                  <tr key={driver.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0 border border-slate-300">
                          {driver.photo ? (
                            <img src={driver.photo} alt={driver.name} className="w-full h-full object-cover" />
                          ) : (
                            <User size={20} className="text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{driver.name}</div>
                          <div className="text-xs text-slate-500">{driver.mobile}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Aadhar</span>
                        <span className="text-sm font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded w-fit">
                          {driver.aadhar}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate text-sm text-slate-600">
                      <div className="flex items-start gap-2">
                        <MapPin size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
                        <span className="truncate">{driver.address}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        driver.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {driver.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE: Card List View (Hidden on Desktop) */}
          <div className="md:hidden divide-y divide-gray-100">
            {currentDrivers.map((driver) => (
              <div key={driver.id} className="p-4 bg-white">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0 border border-slate-300">
                        {driver.photo ? (
                          <img src={driver.photo} alt={driver.name} className="w-full h-full object-cover" />
                        ) : (
                          <User size={24} className="text-slate-400" />
                        )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{driver.name}</h3>
                      <p className="text-sm text-slate-500">{driver.mobile}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    driver.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {driver.status}
                  </span>
                </div>

                <div className="space-y-3 pl-1">
                  <div className="flex items-center gap-3 text-sm">
                    <FileText size={16} className="text-slate-400" />
                    <span className="font-mono bg-slate-50 px-2 py-0.5 rounded text-slate-700">{driver.aadhar}</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600 leading-snug">{driver.address}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-50 flex justify-end">
                   <button className="text-sm font-medium text-red-500 flex items-center gap-2 px-3 py-1.5 hover:bg-red-50 rounded-lg transition-colors">
                     <Trash2 size={16} /> Remove Driver
                   </button>
                </div>
              </div>
            ))}
          </div>
          
          {currentDrivers.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              No drivers found.
            </div>
          )}

          {/* --- PAGINATION CONTROLS --- */}
          <Pagination 
            currentPage={currentPage}
            totalItems={filteredDrivers.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}