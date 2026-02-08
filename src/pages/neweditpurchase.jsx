import React, { useEffect, useMemo, useRef, useState } from "react";
import Select from "react-select";
import API from "../api/api";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";

/* ---------------- ITEMS (REPLACE WITH API) ---------------- */
// const ITEMS = [
//   { item_id: 101, item_name: "Rices", unit_id: 1, unit_name: "Kg", rate: 50 },
//   { item_id: 102, item_name: "Sugar", unit_id: 1, unit_name: "Kg", rate: 40 },
//   { item_id: 103, item_name: "Oil", unit_id: 2, unit_name: "Ltr", rate: 150 },
// ];



const EDIT_API = "product/getPurchaseEditData";
const SAVE_API = "product/submitpurchase";
const DELETE_ITEM_API = "product/cancelPurchaseItem";
const ITEMOption_API = "product/Optionitems";

/* ---------------- MAIN ---------------- */
const AddEditPurchase = ({ editData, onCancel, onSaved }) => {
  const isEdit = Boolean(editData?.purchase_id);

  /* -------- HEADER -------- */
  const [purchaseDate, setPurchaseDate] = useState("");
  const [purchaseNo, setPurchaseNo] = useState("AUTO");
  const [reference, setReference] = useState("");
  const [ITEMS, setOptionitem] = useState([]);

  /* -------- ITEMS -------- */
  const createRow = () => ({
    item_id: "",
    item_name: "",
    unit_id: "",
    unit_name: "",
    quantity: "",
    rate: "",
    value: 0,
  });

  const ITEM_OPTIONS = ITEMS.map(i => ({
  value: i.item_id,
  label: i.item_name,
  unit_id: i.unit_id,
  unit_name: i.unit_name,
  rate: i.rate,
}));

  const [items, setItems] = useState([createRow()]);
  const [loading, setLoading] = useState(false);

  /* -------- REFS -------- */
  const selectRefs = useRef([]);
  const qtyRefs = useRef([]);

  /* =========================================================
     🔥 FETCH EDIT DATA BY PURCHASE ID
     ========================================================= */
  useEffect(() => {
    const fetchoptionlist = async () => {
      const res = await API.post(ITEMOption_API);
      if (res.data.status === 1) {
        setOptionitem( res.data.data)
      }
    };

    fetchoptionlist();
  }, []);


  useEffect(() => {
    if (!isEdit) return;

    const fetchEditData = async () => {
      try {
        setLoading(true);

        const res = await API.post(EDIT_API, {
          purchase_id: editData.purchase_id,
        });

        if (res.data.status !== 1) {
          toast.error("Failed to load purchase data");
          return;
        }

        const d = res.data.data;

        /* Header */
        setPurchaseNo(d.purchase_no);
        setPurchaseDate(d.purchase_date?.substring(0, 10));
        setReference(d.reference || "");

        /* Items */
        const mappedItems = d.purchase_items.map(i => ({
          item_id: Number(i.item_id),
          item_name: i.item_name,
          unit_id: Number(i.unit_id),
          unit_name: i.unit_name,
          quantity: Number(i.quantity),
          rate: Number(i.rate),
          value: Number(i.value),
        }));

        setItems(mappedItems.length ? mappedItems : [createRow()]);
      } catch (err) {
        console.error(err);
        toast.error("Server error while loading edit data");
      } finally {
        setLoading(false);
      }
    };

    fetchEditData();
  }, [editData, isEdit]);

  /* -------- ITEM CHANGE -------- */
  const handleItemChange = (rowIndex, option) => {
    if (!option) return;

    if (items.some((r, i) => r.item_id === option.value && i !== rowIndex)) {
      toast.error("Item already added");
      return;
    }

    const updated = [...items];
    updated[rowIndex] = {
      ...updated[rowIndex],
      item_id: option.value,
      item_name: option.label,
      unit_id: option.unit_id,
      unit_name: option.unit_name,
      rate: option.rate,
      quantity: "",
      value: 0,
    };

    setItems(updated);
    setTimeout(() => qtyRefs.current[rowIndex]?.focus(), 100);
  };

  /* -------- QTY -------- */
  const handleQtyChange = (rowIndex, qty) => {
    const q = Number(qty);
    if (q < 0) return;

    const updated = [...items];
    updated[rowIndex].quantity = q;
    updated[rowIndex].value = q * updated[rowIndex].rate;
    setItems(updated);
  };

  const handleQtyKeyDown = (e, rowIndex) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    if (!items[rowIndex].item_id || items[rowIndex].quantity <= 0) {
      toast.error("Complete row");
      return;
    }

    if (rowIndex === items.length - 1) {
      setItems(prev => [...prev, createRow()]);
      setTimeout(() => selectRefs.current[rowIndex + 1]?.focus(), 150);
    } else {
      selectRefs.current[rowIndex + 1]?.focus();
    }
  };

  /* -------- ADD / REMOVE -------- */
  const addRow = () => setItems(prev => [...prev, createRow()]);
  // const removeRow = i => setItems(prev => prev.filter((_, idx) => idx !== i));

  const removeRow = (index) => {
    const row = items[index];

    toast((t) => (
      <div className="flex flex-col gap-3">
        <span className="font-semibold">
          {isEdit ? "Delete this item permanently?" : "Remove this item row?"}
        </span>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 rounded bg-gray-200"
          >
            No
          </button>

          <button
            onClick={async () => {
              toast.dismiss(t.id);

              /* -------- ADD MODE (UI ONLY) -------- */
              if (!isEdit) {
                setItems((prev) => prev.filter((_, i) => i !== index));
                toast.success("Item removed");
                return;
              }

              /* -------- EDIT MODE (API + UI) -------- */
              try {
                const res = await API.post(DELETE_ITEM_API, {
                  purchase_id: editData.purchase_id,
                  item_id: row.item_id,
                });

                if (res.data.status === 1) {
                  setItems((prev) => prev.filter((_, i) => i !== index));
                  toast.success("Item deleted successfully");
                } else {
                  toast.error(res.data.message || "Delete failed");
                }
              } catch {
                toast.error("Server error while deleting item");
              }
            }}
            className="px-3 py-1 rounded bg-red-600 text-white"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    ));
  };


  /* -------- TOTAL -------- */
  const totalAmount = useMemo(
    () => items.reduce((s, r) => s + (Number(r.value) || 0), 0),
    [items]
  );

  /* -------- SAVE -------- */
  const handleSubmit = async () => {
    if (!purchaseDate) {
      toast.error("Purchase date required");
      return;
    }

    if (items.some(i => !i.item_id || i.quantity <= 0)) {
      toast.error("Complete all rows");
      return;
    }

    const payload = {
      purchase_mode: isEdit ? "1" : "0",
      purchase_id: isEdit ? editData.purchase_id : 0,
      purchase_header: { purchase_date: purchaseDate, reference },
      purchase_items: items.map(i => ({
        item_id: i.item_id,
        item_name: i.item_name,
        unit_id: i.unit_id,
        quantity: i.quantity,
        rate: i.rate,
        value: i.value,
        instore_id: 1,
        outstore_id: 0,
        can_order_status: 1,
      })),
    };

    try {
      const res = await API.post(SAVE_API, payload);
      if (res.data.status === 1) {
        toast.success(isEdit ? "Purchase updated" : "Purchase added");
        onSaved?.();
      } else toast.error(res.data.message);
    } catch {
      toast.error("Server error");
    }
  };

  /* -------- UI -------- */
  if (loading) {
    return <div className="p-10 text-center">Loading purchase...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl border shadow-sm">
      {/* HEADER */}
      <div className="p-6 border-b bg-gray-50">
        <h2 className="text-xl font-bold">
          {isEdit ? "Edit Purchase" : "Add Purchase"}
        </h2>

        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <Field label="Purchase Date *">
            <input
              type="date"
              value={purchaseDate}
              onChange={e => setPurchaseDate(e.target.value)}
              className="input"
            />
          </Field>

          {/* <Field label="Purchase No">
            <input value={purchaseNo} disabled className="input bg-gray-100" />
          </Field> */}

          <Field label="Reference">
            <input value={reference} onChange={e => setReference(e.target.value)} className="input border border-gray-300 rounded-md px-3 py-2" />
          </Field>
        </div>
      </div>

      {/* ITEMS */}
      <div className="p-6 overflow-visible">
        <table className="w-full border rounded-xl">
          <thead className="bg-gray-50 text-xs uppercase">
            <tr>
              <th>S.No</th>
              <th>Item</th>
              <th>Unit</th>
              <th>Rate</th>
              <th>Qty</th>
              <th>Amount</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {items.map((row, i) => (
              <tr key={i} className="border-t">
                <td className="text-center">{i + 1}</td>
                <td className="w-72">
                  <Select
                    ref={el => (selectRefs.current[i] = el)}
                    options={ITEM_OPTIONS}
                    value={ITEM_OPTIONS.find(o => o.value === row.item_id) || null}
                    onChange={opt => handleItemChange(i, opt)}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    openMenuOnFocus
                    styles={{ menuPortal: b => ({ ...b, zIndex: 9999 }) }}
                  />
                </td>
                <td className="text-center">{row.unit_name || "-"}</td>
                <td><input value={row.rate} disabled className="input bg-gray-100 text-right" /></td>
                <td>
                  <input
                    ref={el => (qtyRefs.current[i] = el)}
                    type="number"
                    value={row.quantity}
                    onChange={e => handleQtyChange(i, e.target.value)}
                    onKeyDown={e => handleQtyKeyDown(e, i)}
                    className="input text-right border border-gray-300 rounded-md px-3 py-1" 
                  />
                </td>
                <td className="text-right font-semibold">₹ {row.value}</td>
                <td>
                  <button onClick={() => removeRow(i)} className="text-red-600 p-2">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot className="bg-gray-50 font-semibold">
            <tr>
              <td colSpan="5" className="text-right px-4 py-3">Total</td>
              <td className="text-right px-4 py-3">₹ {totalAmount}</td>
              <td />
            </tr>
          </tfoot>
        </table>

        <button onClick={addRow} className="mt-4 flex items-center gap-2 text-emerald-600">
          <Plus size={18} /> Add Item
        </button>
      </div>

      <div className="p-6 border-t flex justify-end gap-3">
        <button onClick={onCancel} className="px-6 py-2 border rounded-lg">Cancel</button>
        <button onClick={handleSubmit} className="px-6 py-2 bg-emerald-600 text-white rounded-lg">
          Save Purchase
        </button>
      </div>
    </div>
  );
};

/* FIELD */
const Field = ({ label, children }) => (
  <div>
    <label className="text-sm font-semibold mb-1 block">{label}</label>
    {children}
  </div>
);

export default AddEditPurchase;
