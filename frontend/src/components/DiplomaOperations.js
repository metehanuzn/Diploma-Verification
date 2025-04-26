// frontend/src/components/DiplomaOperations.js
import React, { useState } from "react";
import { Form, Button, Spinner, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";

export default function DiplomaOperations({ contract, account }) {
  const [validateId, setValidateId] = useState("");
  const [invalidateId, setInvalidateId] = useState("");
  const [busyValidate, setBusyValidate] = useState(false);
  const [busyInvalidate, setBusyInvalidate] = useState(false);

  async function handleValidate(e) {
    e.preventDefault();
    if (!contract) return toast.error("Kontrat yüklenemedi!");
    setBusyValidate(true);
    try {
      await contract.methods
        .validateDiploma(validateId)
        .send({ from: account });
      toast.success("Diploma onaylandı!");
      setValidateId("");
    } catch (err) {
      console.error(err);
      toast.error("Onaylama sırasında hata oluştu!");
    }
    setBusyValidate(false);
  }

  async function handleInvalidate(e) {
    e.preventDefault();
    if (!contract) return toast.error("Kontrat yüklenemedi!");
    setBusyInvalidate(true);
    try {
      await contract.methods
        .invalidateDiploma(invalidateId)
        .send({ from: account });
      toast.success("Diploma iptal edildi!");
      setInvalidateId("");
    } catch (err) {
      console.error(err);
      toast.error("İptal işlemi sırasında hata oluştu!");
    }
    setBusyInvalidate(false);
  }

  return (
    <Row>
      <Col xs={12} md={6} className="mb-3">
        <Form onSubmit={handleValidate}>
          <h5>Diploma Onaylama</h5>
          <Form.Group className="mb-2">
            <Form.Label>Diploma ID</Form.Label>
            <Form.Control
              type="number"
              value={validateId}
              onChange={e => setValidateId(e.target.value)}
              placeholder="ID girin"
              required
            />
          </Form.Group>
          <Button variant="success" type="submit" disabled={busyValidate}>
            {busyValidate
              ? <><Spinner animation="border" size="sm" /> Onaylanıyor…</>
              : "Onayla"}
          </Button>
        </Form>
      </Col>

      <Col xs={12} md={6} className="mb-3">
        <Form onSubmit={handleInvalidate}>
          <h5>Diploma İptal</h5>
          <Form.Group className="mb-2">
            <Form.Label>Diploma ID</Form.Label>
            <Form.Control
              type="number"
              value={invalidateId}
              onChange={e => setInvalidateId(e.target.value)}
              placeholder="ID girin"
              required
            />
          </Form.Group>
          <Button variant="danger" type="submit" disabled={busyInvalidate}>
            {busyInvalidate
              ? <><Spinner animation="border" size="sm" /> İptal Ediliyor…</>
              : "İptal Et"}
          </Button>
        </Form>
      </Col>
    </Row>
  );
}
