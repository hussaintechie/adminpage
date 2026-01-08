import { useEffect, useState } from "react";
import { ImageIcon } from "lucide-react";
import Select from "react-select";
import axios from "axios";

const ManualAddForm = ({ onSave, onCancel, initialData }) => {
    const [product, setProduct] = useState({
        id: 0,
        name: "",
        brand: "",
        description: "",
        category: "",
        unit: "pcs",
        basePrice: "",
        mrp: "",
        stockQty: "",
        sku: "",
        status: "Active",
        openbalqty:0,
        openbaldate:"",
        image: null,
    });

    const [categories, setCategories] = useState([]);
    const [unitlist, setUnitlist] = useState([]);

    const itemsts = [{ "stsid": 1, "label": "Active" }, { "stsid": 0, "label": "In-Active" }]

    /* ================= PREFILL FOR EDIT ================= */
    useEffect(() => {
        if (initialData) {

            console.log(initialData, 'initialData');
            setProduct({
                id: initialData.id ?? 0,
                name: initialData.name || "",
                brand: initialData.brand || "",
                description: initialData.description || "",
                category: initialData.categories_id || 0,
                unit: initialData.unit || 0,
                basePrice: initialData.price || 0,
                mrp: initialData.mrp || 0,
                stockQty: initialData.lowstqty || 0,
                sku: initialData.sku || "",
                status: initialData.status || "Active",
                itmsts: initialData.itmsts || 0,
                openbalqty: initialData.openbalqty || 0,
                openbaldate: initialData.openbaldate || 0,
                image: initialData.image || "",
            });
        }
    }, [initialData]);

    /* ================= FETCH CATEGORIES ================= */
    useEffect(() => {
        fetchCategories();
        fetchUnitlist();
    }, []);


    const fetchCategories = async () => {
        try {
            const res = await axios.post(
                "https://api.sribalajistores.com/product/allcatedetails",
                {
                    mode_fetchorall: 0,
                    cate_id: 0,
                }
            );

            if (res.data.status === 1) {
                const options = res.data.data.map((cat) => ({
                    value: cat.categories_id,
                    label: cat.categories_name,
                }));
                setCategories(options);
            }
        } catch (err) {
            console.error("Category fetch failed", err);
        }
    };
    const fetchUnitlist = async () => {
        try {
            const res = await axios.post("https://api.sribalajistores.com/product/unitlist");

            if (res.data.status === 1) {
                setUnitlist(
                    res.data.data.map((unit) => ({
                        value: unit.unitid,
                        label: unit.unitname,
                    }))
                );
            }
        } catch (err) {
            console.error("Unit fetch failed", err);
        }
    };

    /* ================= HANDLERS ================= */
    const handleInputChange = (e) =>
        setProduct({ ...product, [e.target.name]: e.target.value });

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProduct({ ...product, image: URL.createObjectURL(file) });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!product.name || !product.basePrice || !product.mrp) {
            alert("Please fill required fields");
            return;
        }

        console.log(product, 'product');

        // onSave(product);
    };

    /* ================= UI ================= */
    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
                {/* ================= LEFT ================= */}
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

                    <div className="pt-4 border-t">
                        <h3 className="font-bold mb-4">Inventory</h3>

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
                                    value={
                                        categories.find(
                                            (cat) => cat.value === product.category
                                        ) || null
                                    }
                                    onChange={(selected) =>
                                        setProduct({
                                            ...product,
                                            category: selected ? selected.value : "",
                                        })
                                    }
                                    placeholder="Select Category"
                                    isClearable
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="pt-4 border-t">
                        {/* <h3 className="font-bold mb-4">Inventory</h3> */}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Item Status
                                </label>

                                <Select
                                    options={itemsts}
                                    getOptionValue={(option) => option.stsid}
                                    getOptionLabel={(option) => option.label}
                                    value={
                                        itemsts.find((sts) => sts.stsid === product.itmsts) || null
                                    }
                                    onChange={(selected) =>
                                        setProduct({
                                            ...product,
                                            itemsts: selected ? selected.stsid : null,
                                        })
                                    }
                                    placeholder="Select Status"
                                    isClearable
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                />
                            </div>


                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Item Unit
                                </label>

                                <Select
                                    options={unitlist}
                                    value={unitlist.find((u) => u.value === product.unit) || null}
                                    onChange={(selected) =>
                                        setProduct({
                                            ...product,
                                            unit: selected ? selected.value : null,
                                        })
                                    }
                                    placeholder="Select Unit"
                                    isClearable
                                />

                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Openbanlance Qty</label>
                                <input
                                    name="openbal"
                                    value={product.openbalqty}
                                    onChange={handleInputChange}
                                    className="border rounded-lg p-2.5"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="pt-4 border-t">
                        {/* <h3 className="font-bold mb-4">Inventory</h3> */}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                            <div>
                                <label className="block text-sm font-medium mb-1">Opening Balance Date</label>
                                <input
                                    name="openbal"
                                    value={product.openbaldate}
                                    onChange={handleInputChange}
                                    className="border rounded-lg p-2.5"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= RIGHT ================= */}
                <div className="lg:col-span-1 bg-gray-50/50 p-4 md:p-6 space-y-6">
                    <div>
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
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">MRP (₹) *</label>
                        <input
                            type="number"
                            name="mrp"
                            value={product.mrp}
                            onChange={handleInputChange}
                            placeholder="MRP"
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
                            placeholder="Selling Price"
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





write full correct code please 