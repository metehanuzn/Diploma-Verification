// frontend/src/components/DiplomaForm.js
import React, { useState } from "react";
import { Card, Form, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

export default function DiplomaForm({ contract, account, isAdmin }) {
  const [student, setStudent] = useState("");
  const [degree, setDegree]  = useState("");
  const [hash, setHash]      = useState("");
  const [uniAddr, setUniAddr]= useState("");
  const [busy, setBusy]      = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!contract) return toast.error("Kontrat yüklenemedi!");
    setBusy(true);

    try {
      if (isAdmin) {
        await contract.methods
          .addDiplomaFor(uniAddr, student, degree, hash)
          .send({ from: account });
      } else {
        await contract.methods
          .addDiploma(student, degree, hash)
          .send({ from: account });
      }
      toast.success("Diploma başarıyla eklendi!");
      setStudent(""); setDegree(""); setHash(""); setUniAddr("");
    } catch (err) {
      console.error(err);
      toast.error("Diploma ekleme başarısız!");
    }

    setBusy(false);
  }

  return (
    <Card className="mb-4">
      <Card.Header>Diploma Ekle</Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          {isAdmin && (
            <Form.Group className="mb-3">
              <Form.Label>Üniversite Adresi</Form.Label>
              <Form.Control
                value={uniAddr}
                onChange={e => setUniAddr(e.target.value)}
                placeholder="0x..."
                required
              />
            </Form.Group>
          )}
          <Form.Group className="mb-3">
            <Form.Label>Öğrenci Adı</Form.Label>
            <Form.Control
              value={student}
              onChange={e => setStudent(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Derece (Degree)</Form.Label>
            <Form.Control
              value={degree}
              onChange={e => setDegree(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>IPFS Hash</Form.Label>
            <Form.Control
              value={hash}
              onChange={e => setHash(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" disabled={busy}>
            {busy
              ? <><Spinner animation="border" size="sm" /> Gönderiliyor…</>
              : 'Ekle'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
