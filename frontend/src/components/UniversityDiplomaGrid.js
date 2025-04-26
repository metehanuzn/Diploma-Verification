import React, { useState, useEffect } from "react";
import { Card, Table, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

export default function UniversityDiplomaGrid({
  uniContract,
  dipContract,
  account,
  isAdmin
}) {
  const [unis, setUnis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    if (!isAdmin || !uniContract) return;
    async function loadUnis() {
      setLoading(true);
      try {
        const arr = await uniContract.methods
          .getAllUniversities()
          .call({ from: account });
        setUnis(arr);
      } catch (err) {
        console.error(err);
        toast.error("Üniversiteler yüklenemedi");
      }
      setLoading(false);
    }
    loadUnis();
  }, [isAdmin, uniContract, account]);

  async function toggleUniversity(univAddr) {
    setExpanded(prev => ({ ...prev, [univAddr]: !prev[univAddr] }));
    const uni = unis.find(u => u.universityAddress === univAddr);
    if (uni && !uni.diplomas) {
      try {
        const dips = await dipContract.methods
          .getDiplomasByUniversity(univAddr)
          .call({ from: account });
        setUnis(prev =>
          prev.map(u =>
            u.universityAddress === univAddr ? { ...u, diplomas: dips } : u
          )
        );
      } catch (err) {
        console.error(err);
        toast.error("Diplomalar alınamadı");
      }
    }
  }

  if (!isAdmin) return null;

  return (
    <Card className="mb-4">
      <Card.Header>Üniversite – Diplomalar</Card.Header>
      <Card.Body>
        {loading ? (
          <Spinner animation="border" />
        ) : (
          <Table bordered hover>
            <thead>
              <tr>
                <th>Üniversite Adı</th>
                <th>Adres</th>
                <th>Detay</th>
              </tr>
            </thead>
            <tbody>
              {unis.map((u, idx) => (
                <React.Fragment key={idx}>
                  <tr>
                    <td>{u.name}</td>
                    <td>{u.universityAddress}</td>
                    <td>
                      <Button
                        variant="link"
                        onClick={() => toggleUniversity(u.universityAddress)}
                      >
                        {expanded[u.universityAddress]
                          ? "Kapat ▲"
                          : "Aç ▼"}
                      </Button>
                    </td>
                  </tr>
                  {expanded[u.universityAddress] && u.diplomas && (
                    <tr>
                      <td colSpan="3">
                        <Table size="sm" bordered>
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Öğrenci</th>
                              <th>Derece</th>
                              <th>Geçerlilik</th>
                            </tr>
                          </thead>
                          <tbody>
                            {u.diplomas.map((d, i) => (
                              <tr key={i}>
                                <td>{d.id}</td>
                                <td>{d.studentName}</td>
                                <td>{d.degree}</td>
                                <td>{d.isValid ? "✅" : "❌"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
}
