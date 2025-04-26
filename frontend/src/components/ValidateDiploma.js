// frontend/src/components/ValidateDiploma.js
import React, { useState } from "react";
import { Card, Form, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

export default function ValidateDiploma({ contract, account }) {
  const [id, setId] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!contract) return toast.error("Kontrat yüklenemedi!");
    setBusy(true);
    try {
      await contract.methods.validateDiploma(id).send({ from: account });
      toast.success("Diploma onaylandı!");
      setId("");
    } catch (err) {
      console.error(err);
      toast.error("Onaylama sırasında hata oluştu!");
    }
    setBusy(false);
  }

  return (
    <Card className="mb-4">
      <Card.Header>Diploma Onaylama</Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Diploma ID</Form.Label>
            <Form.Control
              type="number"
              value={id}
              onChange={e => setId(e.target.value)}
              placeholder="ID girin"
              required
            />
          </Form.Group>
          <Button variant="success" type="submit" disabled={busy}>
            {busy ? <><Spinner animation="border" size="sm" /> Onayla</> : "Onayla"}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
