import React, { useState } from "react";

function ListDiplomas({ contract, account }) {
  const [diplomas, setDiplomas] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleListDiplomas() {
    if (!contract) {
      alert("Kontrat yüklenemedi!");
      return;
    }
    setLoading(true);
    try {
      // Sadece aktif üniversitenin eklediği diplomaları getiriyoruz.
      const diplomasArray = await contract.methods.getDiplomasByUniversity(account).call({ from: account });
      setDiplomas(diplomasArray);
    } catch (error) {
      console.error("Diplomaları listeleme hatası:", error);
      console.log(Object.keys(contract.methods));
      alert("Diplomaları listeleme sırasında hata oluştu!");
    }
    setLoading(false);
  }

  return (
    <div className="mb-4">
      <h3>Sistemdeki Diplomalar</h3>
      <button onClick={handleListDiplomas} className="btn btn-secondary mb-3">
        {loading ? "Yükleniyor..." : "Diplomaları Listele"}
      </button>
      {diplomas.length > 0 ? (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Öğrenci Adı</th>
              <th>Derece</th>
              <th>Geçerlilik</th>
              <th>IPFS Hash</th>
            </tr>
          </thead>
          <tbody>
            {diplomas.map((dip, index) => (
              <tr key={index}>
                <td>{dip.id}</td>
                <td>{dip.studentName}</td>
                <td>{dip.degree}</td>
                <td>{dip.isValid ? "Geçerli" : "Geçersiz"}</td>
                <td>{dip.ipfsHash}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Diploma bulunamadı.</p>
      )}
    </div>
  );
}

export default ListDiplomas;
