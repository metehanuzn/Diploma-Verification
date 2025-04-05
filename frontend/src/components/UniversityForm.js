import React, { useState } from "react";

function UniversityForm({ contract, account }) {
  const [universityName, setUniversityName] = useState("");
  const [universityAddress, setUniversityAddress] = useState("");

  async function handleAddUniversity(e) {
    e.preventDefault();
    if (!contract) return alert("Kontrat yüklenemedi!");

    try {
      await contract.methods
        .addUniversity(universityAddress, universityName)
        .send({ from: account });
      alert("Üniversite başarıyla eklendi!");
    } catch (error) {
      console.error(error);
      alert("Üniversite ekleme başarısız!");
    }
  }

  return (
    <div>
      <h3>Üniversite Ekle</h3>
      <form onSubmit={handleAddUniversity}>
        <div className="mb-2">
          <label>Üniversite Adı:</label>
          <input
            type="text"
            className="form-control"
            value={universityName}
            onChange={(e) => setUniversityName(e.target.value)}
            required
          />
        </div>
        <div className="mb-2">
          <label>Üniversite Adresi:</label>
          <input
            type="text"
            className="form-control"
            value={universityAddress}
            onChange={(e) => setUniversityAddress(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Ekle
        </button>
      </form>
    </div>
  );
}

export default UniversityForm;