import React, { useState } from "react";

function RevokeUniversityForm({ contract, account }) {
  const [universityAddr, setUniversityAddr] = useState("");

  async function handleRevoke(e) {
    e.preventDefault();
    if (!contract) return alert("Kontrat yüklenemedi!");

    try {
      await contract.methods.revokeUniversity(universityAddr).send({ from: account });
      alert("Üniversite başarıyla kaldırıldı!");
    } catch (error) {
      console.error(error);
      alert("Üniversite kaldırma işlemi başarısız!");
    }
  }

  return (
    <div>
      <h3>Üniversiteyi Sistemde Kaldır</h3>
      <form onSubmit={handleRevoke}>
        <div className="mb-2">
          <label>Üniversite Adresi:</label>
          <input
            type="text"
            className="form-control"
            value={universityAddr}
            onChange={(e) => setUniversityAddr(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-danger">
          Kaldır
        </button>
      </form>
    </div>
  );
}

export default RevokeUniversityForm;