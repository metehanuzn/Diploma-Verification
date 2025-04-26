// frontend/src/components/RevokeUniversityForm.js
import React, { useState } from "react";
import { Card, Form, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

export default function RevokeUniversityForm({ contract, account }) {
  const [addr, setAddr] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!contract) return toast.error("Kontrat yüklenemedi!");
    setBusy(true);
    try {
      await contract.methods.revokeUniversity(addr).send({ from: account });
      toast.success("Üniversite başarıyla kaldırıldı!");
      window.location.reload();
      setAddr("");
    } catch (err) {
      console.error(err);
      toast.error("Kaldırma işlemi başarısız!");
    }
    setBusy(false);
  }

  return (
    <Card className="mb-4">
      <Card.Header>Üniversiteyi Kaldır</Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Üniversite Adresi</Form.Label>
            <Form.Control
              value={addr}
              onChange={e => setAddr(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="danger" type="submit" disabled={busy}>
            {busy ? <><Spinner animation="border" size="sm" /> Kaldır</> : "Kaldır"}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
