const STORE_ID = Number(import.meta.env.VITE_STORE_ID);
import { useEffect, useState } from "react";
import { ImageIcon } from "lucide-react";
import Select from "react-select";
import API from "../api/api";
import toast from "react-hot-toast";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ManualAddForm = ({ onSave, onCancel, initialData }) => {
  const [product, setProduct] = useState({
    id: 0,
    name: "",
    brand: "",
    description: "",
    category: "",
    unit: "",
    basePrice: "",
    mrp: "",
    stockQty: "",
    sku: "",
    status: "Active",
    itmsts: 1,
    openbalqty: 0,
    openbaldate: "",
    image: null,
    discount_per: 0,
    discount_sts: 0,
    itmtype: "",
  });

  const [categories, setCategories] = useState([]);
  const [unitlist, setUnitlist] = useState([]);
  const [preview, setPreview] = useState(null);

  const itemsts = [
    { stsid: 1, label: "Active" },
    { stsid: 0, label: "In-Active" },
  ];

  const discountoption = [
    { label: "OFF", value: 0 },
    { label: "ON", value: 1 },
  ];
  const itemtypes = [
    { label: "Select Item Type", value: "" },
    { label: "Sessional fruit", value: "fruit" },
    { label: "Sessional Vegitable", value: "vegitable" },
  ];

  /* ================= PREFILL ================= */
  useEffect(() => {
    if (initialData) {
      setProduct({
        id: initialData.id ?? 0,
        name: initialData.name ?? "",
        brand: initialData.brand ?? "",
        description: initialData.description ?? "",
        category: initialData.categories_id ?? "",
        unit: initialData.unit ?? "",
        basePrice: initialData.price ?? "",
        mrp: initialData.mrp ?? "",
        stockQty: initialData.lowstqty ?? "",
        sku: initialData.sku ?? "",
        status: initialData.status ?? "Active",
        itmsts: initialData.itmsts ?? 1,
        openbalqty: initialData.openbalqty ?? 0,
        openbaldate: initialData.openbaldate ?? "",
        image: initialData.image ?? null,
        discount_per: initialData.discount_per ?? 0,
        discount_sts: initialData.discount_sts ?? 0,
        itmtype: initialData.itmtype ?? "",
      });

      setPreview(initialData.image ?? null);
    }
  }, [initialData]);

  /* ================= FETCH ================= */
  useEffect(() => {
    fetchCategories();
    fetchUnitlist();
  }, []);

  const fetchCategories = async () => {
    const res = await API.post("product/allcatedetails", {
      mode_fetchorall: 0,
      cate_id: 0,
      register_id: STORE_ID,
    });
    if (res.data.status === 1) {
      setCategories(
        res.data.data.map((c) => ({
          value: c.categories_id,
          label: c.categories_name,
        })),
      );
    }
  };

  const fetchUnitlist = async () => {
    const res = await API.post("product/unitlist");
    if (res.data.status === 1) {
      setUnitlist(
        res.data.data.map((u) => ({
          value: u.unitid,
          label: u.unitname,
        })),
      );
    }
  };
  const navigate = useNavigate();

  /* ================= HANDLERS ================= */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]:
        name === "stockQty" || name === "openbalqty" ? Number(value) : value,
    }));
  };

  // const handleImageUpload = (e) => {
  //     const file = e.target.files[0];
  //     if (file) {
  //         setProduct((prev) => ({
  //             ...prev,
  //             image: file   // ✅ store actual File object
  //         }));
  //     }
  // };

  const MAX_SIZE_MB = 2;
  const MAX_WIDTH = 1024;
  const MAX_HEIGHT = 1024;

  // ✅ EXTENSION ONLY (not mime)
  const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const extension = file.name.split(".").pop().toLowerCase();

    // ❌ Extension validation
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      alert("Only JPG, JPEG, PNG, WEBP image files are allowed");
      e.target.value = "";
      return;
    }

    // ❌ Size validation (2 MB)
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      alert("Image must be less than 2 MB");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        let { width, height } = img;

        const scale = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height, 1);

        width *= scale;
        height *= scale;

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) return;

            const optimizedFile = new File([blob], file.name, {
              type: blob.type,
              lastModified: Date.now(),
            });

            setProduct((prev) => ({
              ...prev,
              image: optimizedFile,
            }));

            setPreview(URL.createObjectURL(optimizedFile));
          },
          "image/jpeg",
          0.9,
        );
      };
    };

    reader.readAsDataURL(file);
  };

  /* ================= SUBMIT ================= */
  // const handleSubmit = async (e) => {
  //     e.preventDefault();

  //     if (!product.name.trim()) {
  //         toast.error("Product name is required");
  //         return;
  //     }
  //     if (!product.category) {
  //         toast.error("Category is required");
  //         return;
  //     }
  //     if (!product.unit) {
  //         toast.error("Unit is required");
  //         return;
  //     }
  //     if (!product.basePrice) {
  //         toast.error("Selling price is required");
  //         return;
  //     }
  //     if (!product.mrp) {
  //         toast.error("MRP is required");
  //         return;
  //     }

  //     try {
  //         const payload = {
  //             productdata: {
  //                 ...product,
  //                 basePrice: Number(product.basePrice),
  //                 mrp: Number(product.mrp),
  //                 stockQty: Number(product.stockQty) || 0,
  //                 openbalqty: Number(product.openbalqty) || 0,
  //                },
  //         };

  //         const res = await API.post(
  //             "product/saveItem",
  //             payload
  //         );

  //         if (res.data.status === 1) {
  //             toast.success(res.data.message || "Item saved successfully");
  //             // onSave?.();
  //             // onCancel?.();
  //         } else {
  //             toast.error(res.data.message || "Save failed");
  //         }
  //     } catch (err) {
  //         console.error(err);
  //         toast.error("Server error. Please try again");
  //     }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ---------- VALIDATION ----------
    if (!product.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (!product.category) {
      toast.error("Category is required");
      return;
    }
    if (!product.unit) {
      toast.error("Unit is required");
      return;
    }
    if (!product.basePrice) {
      toast.error("Selling price is required");
      return;
    }
    if (!product.mrp) {
      toast.error("MRP is required");
      return;
    }

    try {
      // ---------- FORM DATA ----------
      const formData = new FormData();

      formData.append("id", product.id || 0);
      formData.append("name", product.name);
      formData.append("brand", product.brand || "");
      formData.append("description", product.description || "");
      formData.append("category", product.category);
      formData.append("unit", product.unit);
      formData.append("basePrice", Number(product.basePrice));
      formData.append("mrp", Number(product.mrp));
      formData.append("stockQty", Number(product.stockQty) || 0);
      formData.append("sku", product.sku || "");
      formData.append("itmsts", product.itmsts ?? 1);
      formData.append("openbalqty", Number(product.openbalqty) || 0);
      formData.append("openbaldate", product.openbaldate || "");
      formData.append("discount_sts", product.discount_sts ?? 0);
      formData.append("discount_per", Number(product.discount_per) || 0);
      formData.append("itmtype", product.itmtype || "");

      // ---------- IMAGE ----------
      if (product.image instanceof File) {
        formData.append("image", product.image);
      }

      // ---------- API CALL ----------
  

      const res = await API.post("product/saveItem", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("API RESPONSE:", res.data);

      // const res = await API.post(
      //     "http://localhost:5000/product/saveItem",
      //     formData,
      //     {
      //         headers: {
      //             "Content-Type": "multipart/form-data",
      //         },
      //     }
      // );

      if (res.data.status === 1) {
        toast.success(res.data.message || "Item saved successfully");
        // navigate("/inventory?tab=list");

         onSave?.();
         onCancel?.();
      } else {
        toast.error(res.data.message || "Save failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error. Please try again");
    }
  };

  /* ================= UI (UNCHANGED) ================= */
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
        {/* LEFT */}
    <div className="lg:col-span-2 p-4 md:p-6 space-y-5">

  {/* PRODUCT NAME */}
  <div>
    <label className="block text-sm font-semibold mb-1">
      Product Name *
    </label>
    <input
      name="name"
      value={product.name}
      onChange={handleInputChange}
      placeholder="Enter product name"
      className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
    />
  </div>

  {/* CATEGORY + ITEM TYPE */}
  <div className="grid md:grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium mb-1">
        Category
      </label>
      <Select
        options={categories}
        value={categories.find(c => c.value === product.category) || null}
        onChange={s => setProduct({ ...product, category: s?.value || "" })}
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-1">
        Item Type
      </label>
      <Select
        options={itemtypes}
        value={itemtypes.find(s => s.value === product.itmtype) || null}
        onChange={s => setProduct({ ...product, itmtype: s?.value || "" })}
      />
    </div>
  </div>

  {/* UNIT + STATUS */}
  <div className="grid md:grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium mb-1">
        Item Unit
      </label>
      <Select
        options={unitlist}
        value={unitlist.find(u => u.value === product.unit) || null}
        onChange={s => setProduct({ ...product, unit: s?.value || "" })}
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-1">
        Item Status
      </label>
      <Select
        options={itemsts}
        getOptionValue={o => o.stsid}
        getOptionLabel={o => o.label}
        value={itemsts.find(s => s.stsid === product.itmsts) || null}
        onChange={s => setProduct({ ...product, itmsts: s?.stsid })}
      />
    </div>
  </div>

  {/* OPEN BALANCE */}
  <div className="grid md:grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium mb-1">
        Opening Balance Qty
      </label>
      <input
        name="openbalqty"
        value={product.openbalqty}
        onChange={handleInputChange}
        className="border rounded-lg p-2.5 w-full"
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-1">
        Opening Balance Date
      </label>
      <Flatpickr
        value={product.openbaldate}
        options={{ dateFormat: "Y-m-d" }}
        onChange={(d, str) =>
          setProduct({ ...product, openbaldate: str })
        }
        className="border rounded-lg p-2.5 w-full"
      />
    </div>
  </div>

  {/* DISCOUNT + LOW STOCK */}
  <div className="grid md:grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium mb-1">
        Discount %
      </label>
      <input
        name="discount_per"
        value={product.discount_per}
        onChange={handleInputChange}
        className="border rounded-lg p-2.5 w-full"
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-1">
        Low Stock Qty
      </label>
      <input
        type="number"
        name="stockQty"
        value={product.stockQty}
        onChange={handleInputChange}
        className="border rounded-lg p-2.5 w-full"
      />
    </div>
  </div>

</div>


        {/* RIGHT */}
        <div className="lg:col-span-1 bg-gray-50/50 p-4 md:p-6 space-y-6">
          <label className="block text-sm font-medium mb-2">
            Product Image
          </label>
          <div className="border-2 border-dashed rounded-xl p-4 h-32 relative">
            <input
              type="file"
              onChange={handleImageUpload}
              className="absolute inset-0 opacity-0"
            />
            {preview ? (
              <img
                src={preview}
                alt="Product"
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <ImageIcon />
                <p className="text-xs">Tap to upload</p>
              </div>
            )}{" "}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              MRP (₹) *
            </label>
            <input
              type="number"
              name="mrp"
              value={product.mrp}
              onChange={handleInputChange}
              className="border rounded-lg p-2.5 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selling Price (₹) *
            </label>

            <input
              type="number"
              name="basePrice"
              value={product.basePrice}
              onChange={handleInputChange}
              className="border rounded-lg p-2.5 w-full font-bold"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold">
              {initialData ? "Update" : "Save"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 border py-3 rounded-xl font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ManualAddForm;
