// frontend/src/components/ListDiplomas.js
import React, { useState } from "react";
import { Card, Table, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

export default function ListDiplomas({ contract, account }) {
  const [dips, setDips] = useState([]);
  const [busy, setBusy] = useState(false);

  async function handleList() {
    if (!contract) return toast.error("Kontrat yüklenemedi!");
    setBusy(true);
    try {
      const arr = await contract.methods.getDiplomasByUniversity(account).call({ from: account });
      setDips(arr);
      if (arr.length === 0) toast.info("Hiç diploma bulunamadı.");
    } catch (err) {
      console.error(err);
      toast.error("Diplomalar listelenemedi!");
    }
    setBusy(false);
  }

  return (
    <Card className="mb-4">
      <Card.Header>Sistemdeki Diplomalar</Card.Header>
      <Card.Body>
        <Button variant="secondary" onClick={handleList} disabled={busy}>
          {busy ? <><Spinner animation="border" size="sm" /> Yükleniyor</> : "Diplomaları Listele"}
        </Button>

        {dips.length > 0 && (
          <div className="table-responsive mt-3">
            <Table bordered hover>
              <thead>
                <tr>
                  <th>ID</th><th>Öğrenci</th><th>Derece</th><th>Geçerlilik</th><th>IPFS</th>
                </tr>
              </thead>
              <tbody>
                {dips.map((d,i) => (
                  <tr key={i}>
                    <td>{d.id}</td>
                    <td>{d.studentName}</td>
                    <td>{d.degree}</td>
                    <td>{d.isValid ? "✅" : "❌"}</td>
                    <td>
                      <a 
                        href={`https://ipfs.io/ipfs/${d.ipfsHash}`} 
                        target="_blank" rel="noopener noreferrer"
                      >
                        {d.ipfsHash.slice(0, 10)}…
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
