import React, { useState } from "react";
import PurchaseStockList from "../pages/puchaselist";
import AddEditPurchase from "../pages/neweditpurchase";

const PurchaseController = ({ onBack }) => {
  const [view, setView] = useState("list"); // list | add | edit
  const [editData, setEditData] = useState(null);

  return (
    <>
      {view === "list" && (
        <PurchaseStockList
          onAdd={() => setView("add")}
          onEdit={(row) => {
            setEditData(row);
            setView("edit");
          }}
          onBack={onBack}
        />
      )}

      {(view === "add" || view === "edit") && (
        <AddEditPurchase
          editData={view === "edit" ? editData : null}
          onCancel={() => setView("list")}
          onSaved={() => setView("list")}
        />
      )}
    </>
  );
};

export default PurchaseController;
