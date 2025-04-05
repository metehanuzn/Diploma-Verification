import React, { useState } from "react";

function IsUniversity({ contract, account }) {
  const [queryAddress, setQueryAddress] = useState("");
  const [result, setResult] = useState(null);

  async function handleCheck(e) {
    e.preventDefault();
    if (!contract) {
      alert("Kontrat yüklenemedi!");
      return;
    }

    try {
        const res = await contract.methods.isUniversity(queryAddress).call({ from: account });
        console.log("Dönen sonuç:", res);
        // Eğer dönüş dizi şeklinde gelmiyorsa, res nesnesinin yapısını inceleyin.
        setResult({ exists: res[0], name: res[1] });
      } catch (error) {
        console.error("Sorgulama hatası:", error);
        alert("Sorgulama sırasında hata oluştu! Detaylar için konsolu kontrol edin.");
      }
  }

  return (
    <div className="mb-4">
      <h3>Üniversite Sorgulama</h3>
      <form onSubmit={handleCheck}>
        <div className="mb-2">
          <label>Adres:</label>
          <input
            type="text"
            className="form-control"
            value={queryAddress}
            onChange={(e) => setQueryAddress(e.target.value)}
            placeholder="Sorgulanacak adresi girin"
            required
          />
        </div>
        <button type="submit" className="btn btn-info">
          Sorgula
        </button>
      </form>
      {result !== null && (
        <div className="mt-2">
          {result.exists ? (
            <p>
              {queryAddress} adresi kayıtlı bir üniversite. Üniversite Adı: {result.name}
            </p>
          ) : (
            <p>{queryAddress} adresi kayıtlı bir üniversite değil.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default IsUniversity;