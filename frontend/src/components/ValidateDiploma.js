import React, { useState } from "react";

function ValidateDiplomaForm({ contract, account }) {
  const [diplomaId, setDiplomaId] = useState("");

  async function handleValidate(e) {
    e.preventDefault();
    if (!contract) {
      alert("Kontrat yüklenemedi!");
      return;
    }

    if (!diplomaId) {
      alert("Lütfen diploma ID girin!");
      return;
    }

    try {
      await contract.methods.validateDiploma(diplomaId).send({ from: account });
      alert("Diploma başarıyla onaylandı!");
    } catch (error) {
      console.error("Diploma onaylama hatası:", error);
      alert("Diploma onaylama işlemi sırasında hata oluştu!");
    }
  }

  return (
    <div className="mb-4">
      <h3>Diploma Onaylama</h3>
      <form onSubmit={handleValidate}>
        <div className="mb-2">
          <label>Diploma ID:</label>
          <input
            type="number"
            className="form-control"
            value={diplomaId}
            onChange={(e) => setDiplomaId(e.target.value)}
            placeholder="Diploma ID girin"
            required
          />
        </div>
        <button type="submit" className="btn btn-success">
          Onayla
        </button>
      </form>
    </div>
  );
}

export default ValidateDiplomaForm;
