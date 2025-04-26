// frontend/src/components/IsUniversity.js
import React, { useState } from "react";
import { Card, Form, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

export default function IsUniversity({ contract, account }) {
  const [addr, setAddr] = useState("");
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  async function handleCheck(e) {
    e.preventDefault();
    if (!contract) return toast.error("Kontrat yüklenemedi!");
    setBusy(true);
    try {
      const res = await contract.methods.isUniversity(addr).call({ from: account });
      setResult({ exists: res[0], name: res[1] });
    } catch (err) {
      console.error(err);
      toast.error("Sorgulama sırasında hata oluştu!");
    }
    setBusy(false);
  }

  return (
    <Card className="mb-4">
      <Card.Header>Üniversite Sorgulama</Card.Header>
      <Card.Body>
        <Form onSubmit={handleCheck}>
          <Form.Group className="mb-3">
            <Form.Label>Adres</Form.Label>
            <Form.Control
              value={addr}
              onChange={e => setAddr(e.target.value)}
              placeholder="0x..."
              required
            />
          </Form.Group>
          <Button variant="info" type="submit" disabled={busy}>
            {busy ? <><Spinner animation="border" size="sm" /> Sorgula</> : "Sorgula"}
          </Button>
        </Form>
        {result && (
          <div className="mt-3">
            {result.exists
              ? <p>✅ Bu adres <strong>{result.name}</strong> üniversitesine ait.</p>
              : <p>❌ Kayıtlı bir üniversite değil.</p>
            }
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
