// frontend/src/components/UniversityForm.js
import React, { useState } from "react";
import { Card, Form, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

export default function UniversityForm({ contract, account }) {
  const [name, setName] = useState("");
  const [addr, setAddr] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!contract) return toast.error("Kontrat yüklenemedi!");
    setBusy(true);
    try {
      await contract.methods.addUniversity(addr, name).send({ from: account });
      toast.success("Üniversite başarıyla eklendi!");
      setName("");
      setAddr("");
    } catch (err) {
      console.error(err);
      toast.error("Üniversite ekleme başarısız!");
    }
    setBusy(false);
  }

  return (
    <Card className="mb-4">
      <Card.Header>Üniversite Ekle</Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Üniversite Adı</Form.Label>
            <Form.Control
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Üniversite Adresi</Form.Label>
            <Form.Control
              value={addr}
              onChange={e => setAddr(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" disabled={busy}>
            {busy ? <><Spinner animation="border" size="sm" /> Ekle</> : "Ekle"}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
