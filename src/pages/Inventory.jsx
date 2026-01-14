import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Plus,
  Trash2,
  FileSpreadsheet,
  Save,
  Image as ImageIcon,
  Search,
  Package,
  MoreVertical,
  AlertTriangle,
  Download
} from 'lucide-react';
import axios from "axios";
import { useSearchParams } from "react-router-dom";

// 1. Import Pagination
import { EXISTING_PRODUCTS } from '../data/mockData';
import PurchaseController from '../pages/Purchasecontroller';
import Productlist from '../pages/Productlists';
import ManualAddForm from '../pages/ManualAddForm';
import LowStockView from '../pages/Lowstockdetails';
import Stockreport from '../pages/Stockreport';
import toast from "react-hot-toast";
import * as XLSX from "xlsx";


/* ===== REQUIRED EXCEL HEADERS (STRICT) ===== */
const REQUIRED_HEADERS = [
  "title",
  "categoriesname",
  "quantity",
  "price",
  "mrp",
  "description",
  "unit"
];

/* ================= BULK UPLOAD ================= */
const BulkUpload = ({ onCancel }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  /* -------- DOWNLOAD TEMPLATE -------- */
  const downloadExactExcel = () => {
    window.location.href = "/templates/inventory_bulk_template.xlsx";
  };

  /* -------- FILE SELECT + STRICT VALIDATION -------- */
  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    /* File type check */
    if (!/\.(xlsx|xls)$/i.test(selectedFile.name)) {
      toast.error("Only Excel files (.xlsx or .xls) are allowed");
      return;
    }

    try {
      const buffer = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const sheetData = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        defval: ""
      });

      if (!sheetData.length) {
        toast.error("Excel file is empty");
        return;
      }

      const uploadedHeaders = sheetData[0].map(h =>
        h.toString().trim()
      );

      /* Header count check */
      if (uploadedHeaders.length !== REQUIRED_HEADERS.length) {
        toast.error("Invalid Excel format. Use only the downloaded template.");
        return;
      }

      /* Header name + order check */
      const isValid = REQUIRED_HEADERS.every(
        (h, i) => h === uploadedHeaders[i]
      );

      if (!isValid) {
        toast.error(
          "Excel headers mismatch.\nRequired: title, categoriesname, quantity, price, mrp, description, unit"
        );
        return;
      }

      setFile(selectedFile);
      setFileName(selectedFile.name);
      toast.success("Valid Excel template selected");

    } catch (err) {
      console.error(err);
      toast.error("Failed to read Excel file");
    }
  };

  /* -------- IMPORT (API CALL) -------- */
  const handleImport = async () => {
    if (!file) {
      toast.error("Please select a valid Excel file");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        "https://api.sribalajistores.com/product/createitmfile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data?.status === 1) {
        toast.success("Bulk upload successful");
        onCancel();
      } else {
        toast.error(res.data?.message || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while uploading");
    } finally {
      setLoading(false);
      setFile(null);
      setFileName("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-8">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-bold text-gray-800">Bulk Upload Inventory</h2>
        <button
          onClick={downloadExactExcel}
          className="flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700"
        >
          <Download className="w-4 h-4" /> Download Excel
        </button>
      </div>

      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:bg-gray-50"
      >
        <div className="bg-emerald-50 p-4 rounded-full inline-flex mb-3">
          <Upload className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="font-semibold text-gray-800">Upload Excel File</h3>
        <p className="text-sm text-gray-500">Upload only the downloaded format</p>
        {fileName && <p className="text-xs mt-2 text-gray-600">{fileName}</p>}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          accept=".xlsx,.xls"
        />
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <button onClick={onCancel} className="text-sm text-gray-500" disabled={loading}>
          Cancel
        </button>
        <button
          onClick={handleImport}
          disabled={loading}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          {loading ? "Importing..." : "Import"}
        </button>
      </div>
    </div>
  );
};


// --- MAIN INVENTORY COMPONENT ---
const Inventory = () => {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState(tabFromUrl || "list");

  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);
  const [inventory, setInventory] = useState(EXISTING_PRODUCTS);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8; // Number of items to show per page

  const handleSaveProduct = (newProduct) => {
    setInventory([{ ...newProduct, id: Date.now(), price: newProduct.basePrice, stock: newProduct.stockQty, status: 'Active' }, ...inventory]);
    setActiveTab('list');
  };

  // const handleBulkImport = (data) => {
  //   const newItems = data.map((item, idx) => ({ 
  //       id: Date.now() + idx, name: item.Name, sku: item.SKU || 'BULK-001', category: item.Category, price: item.Price, mrp: item.MRP || item.Price, stock: item.Stock, status: 'Active' 
  //   }));
  //   setInventory([...newItems, ...inventory]);
  //   setActiveTab('list');
  // };

  // --- FILTER & PAGINATION LOGIC ---

  // 1. Filter
  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. Pagination Slice
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInventory.slice(indexOfFirstItem, indexOfLastItem);

  // 3. Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab]);

  return (
    <div className="font-sans p-4 md:p-8 pb-24">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header Block */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Package className="text-emerald-600" size={28} /> Inventory
            </h1>
          </div>

          <div className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-sm pt-2 pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:static md:bg-transparent md:p-0">
            <div className="w-full overflow-x-auto no-scrollbar">
              <div className="bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm flex whitespace-nowrap min-w-max">
                {[
                  { id: 'list', label: 'Inventory List' },
                  { id: 'low_stock', label: 'Low Stock', icon: AlertTriangle },
                  { id: 'manual', label: 'Add Product', icon: Plus },
                  { id: 'bulk', label: 'Bulk Upload', icon: FileSpreadsheet },
                  { id: 'inv_list', label: 'Stock List', icon: FileSpreadsheet },
                  { id: 'inv_manage', label: 'Inventory Manage', icon: FileSpreadsheet },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${activeTab === tab.id
                        ? (tab.id === 'low_stock' ? 'bg-orange-100 text-orange-700 shadow-sm' : 'bg-slate-800 text-white shadow-md')
                        : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    {tab.icon && <tab.icon size={16} />} {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- VIEWS --- */}
        {activeTab === 'list' && (
          <Productlist />
        )}

        {/* Form Views */}
        {activeTab === 'low_stock' && <LowStockView />}
        {activeTab === 'manual' && <ManualAddForm onSave={handleSaveProduct} onCancel={() => setActiveTab('list')} />}
        {activeTab === 'bulk' && <BulkUpload onCancel={() => setActiveTab('list')} />}
        {activeTab === "inv_list" && <PurchaseController onBack={() => setActiveTab("list")} />}
        {activeTab === "inv_manage" && <Stockreport onBack={() => setActiveTab("list")} />}
      </div>
    </div>
  );
};

export default Inventory;