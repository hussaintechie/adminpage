import { useEffect, useState } from "react";
import { ImageIcon } from "lucide-react";
import Select from "react-select";
import axios from "axios";
import toast from "react-hot-toast";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";

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
    });

    const [categories, setCategories] = useState([]);
    const [unitlist, setUnitlist] = useState([]);

    const itemsts = [
        { stsid: 1, label: "Active" },
        { stsid: 0, label: "In-Active" },
    ];

    const discountoption = [{ "label": "OFF", "value": 0 }, { "label": "ON", "value": 1 }];

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
            });
        }
    }, [initialData]);

    /* ================= FETCH ================= */
    useEffect(() => {
        fetchCategories();
        fetchUnitlist();
    }, []);

    const fetchCategories = async () => {
        const res = await axios.post(
            "http://localhost:5000/product/allcatedetails",
            { mode_fetchorall: 0, cate_id: 0 }
        );
        if (res.data.status === 1) {
            setCategories(
                res.data.data.map((c) => ({
                    value: c.categories_id,
                    label: c.categories_name,
                }))
            );
        }
    };

    const fetchUnitlist = async () => {
        const res = await axios.post("http://localhost:5000/product/unitlist");
        if (res.data.status === 1) {
            setUnitlist(
                res.data.data.map((u) => ({
                    value: u.unitid,
                    label: u.unitname,
                }))
            );
        }
    };

    /* ================= HANDLERS ================= */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({
            ...prev,
            [name]:
                name === "stockQty" || name === "openbalqty"
                    ? Number(value)
                    : value,
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProduct({ ...product, image: URL.createObjectURL(file) });
        }
    };

    /* ================= SUBMIT ================= */
    const handleSubmit = async (e) => {
        e.preventDefault();

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
            const payload = {
                productdata: {
                    ...product,
                    basePrice: Number(product.basePrice),
                    mrp: Number(product.mrp),
                    stockQty: Number(product.stockQty) || 0,
                    openbalqty: Number(product.openbalqty) || 0,
                },
            };

            const res = await axios.post(
                "http://localhost:5000/product/saveItem",
                payload
            );

            if (res.data.status === 1) {
                toast.success(res.data.message || "Item saved successfully");
                // onSave?.();
                // onCancel?.();
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
                <div className="lg:col-span-2 p-4 md:p-6 space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-gray-800 text-lg">Product Details</h3>
                        <span className="text-xs text-gray-400 uppercase font-semibold">
                            General
                        </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Product Name *
                            </label>
                            <input
                                name="name"
                                value={product.name}
                                onChange={handleInputChange}
                                className="w-full border rounded-lg p-2.5"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Brand</label>
                            <input
                                name="brand"
                                value={product.brand}
                                onChange={handleInputChange}
                                className="w-full border rounded-lg p-2.5"
                            />
                        </div>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">SKU</label>
                            <input
                                name="sku"
                                value={product.sku}
                                onChange={handleInputChange}
                                className="border rounded-lg p-2.5"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Low Stock Qty</label>
                            <input
                                type="number"
                                name="stockQty"
                                value={product.stockQty}
                                onChange={handleInputChange}
                                className="border rounded-lg p-2.5"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Category
                            </label>

                            <Select
                                options={categories}
                                value={categories.find((c) => c.value === product.category) || null}
                                onChange={(s) =>
                                    setProduct({ ...product, category: s ? s.value : "" })
                                }
                            />
                        </div>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Item Status
                            </label>

                            <Select
                                options={itemsts}
                                getOptionValue={(o) => o.stsid}
                                getOptionLabel={(o) => o.label}
                                value={itemsts.find((s) => s.stsid === product.itmsts) || null}
                                onChange={(s) =>
                                    setProduct({ ...product, itmsts: s ? s.stsid : null })
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Item Unit
                            </label>
                            <Select
                                options={unitlist}
                                value={unitlist.find((u) => u.value === product.unit) || null}
                                onChange={(s) =>
                                    setProduct({ ...product, unit: s ? s.value : "" })
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Openbanlance Qty</label>
                            <input
                                name="openbalqty"
                                value={product.openbalqty}
                                onChange={handleInputChange}
                                className="border rounded-lg p-2.5"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Opening Balance Date</label>
                            <Flatpickr
                                value={product.openbaldate}
                                options={{ dateFormat: "Y-m-d" }}
                                onChange={(dates, dateStr) =>
                                    setProduct({ ...product, openbaldate: dateStr })
                                }
                                className="border rounded-lg p-2.5 w-full"
                                placeholder="Opening Balance Date"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Discount Percent</label>

                            <input

                                name="discount_per"
                                value={product.discount_per}
                                onChange={handleInputChange}
                                className="border rounded-lg p-2.5"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Discount Status</label>
                            <Select
                                options={discountoption}
                                value={discountoption.find((s) => s.value === product.discount_sts) || null}
                                onChange={(s) =>
                                    setProduct({ ...product, discount_sts: s ? s.value : null })
                                }
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
                        {product.image ? (
                            <img
                                src={product.image}
                                className="h-full w-full object-contain"
                            />
                        ) : (
                            <div className="text-center">
                                <ImageIcon className="mx-auto" />
                                <p className="text-xs">Tap to upload</p>
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">MRP (₹) *</label>
                        <input
                            type="number"
                            name="mrp"
                            value={product.mrp}
                            onChange={handleInputChange}
                            className="border rounded-lg p-2.5 w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Selling Price (₹) *</label>

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
