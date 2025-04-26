// src/App.js
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { Container, Navbar, Nav, Tab, Row, Col, Accordion, Spinner, Card } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';

import UniversityRegistryJSON from './contracts/UniversityRegistry.json';
import DiplomaRegistryJSON from './contracts/DiplomaRegistry.json';

import UniversityForm from "./components/UniversityForm";
import RevokeUniversityForm from "./components/RevokeUniversityForm";
import IsUniversity from "./components/IsUniversity";
import DiplomaForm from "./components/DiplomaForm";
import ValidateDiploma from "./components/ValidateDiploma";
import ListDiplomas from "./components/ListDiplomas";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const [account, setAccount] = useState('');
  const [uniRegistry, setUniRegistry] = useState(null);
  const [dipRegistry, setDipRegistry] = useState(null);
  const [networkId, setNetworkId] = useState(null);
  const [loadingChain, setLoadingChain] = useState(true);

  useEffect(() => { init(); }, []);
  async function init() {
    if (!window.ethereum) return toast.error('Metamask bulunamadı');
    const web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const [acct] = await web3.eth.getAccounts();
      setAccount(acct);
      const netId = await web3.eth.net.getId();
      setNetworkId(netId);

      const uData = UniversityRegistryJSON.networks[netId];
      if (uData) setUniRegistry(new web3.eth.Contract(UniversityRegistryJSON.abi, uData.address));
      else toast.warn('ÜniversiteRegistry yüklenemedi');

      const dData = DiplomaRegistryJSON.networks[netId];
      if (dData) setDipRegistry(new web3.eth.Contract(DiplomaRegistryJSON.abi, dData.address));
      else toast.warn('DiplomaRegistry yüklenemedi');
    } catch (e) {
      toast.error('Blockchain hatası');
      console.error(e);
    }
    setLoadingChain(false);
  }

  if (loadingChain) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" /><p>Blockchain’e bağlanılıyor…</p>
      </div>
    );
  }

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>🎓 Diploma Sistemi</Navbar.Brand>
          <Nav className="ms-auto">
            <Navbar.Text className="text-light me-4">
              Hesap: {account}
            </Navbar.Text>
            <Navbar.Text className="text-light">
              Network: {networkId}
            </Navbar.Text>
          </Nav>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <ToastContainer position="top-right" autoClose={3000} />
        <Tab.Container defaultActiveKey="uni">
          <Nav variant="tabs">
            <Nav.Item><Nav.Link eventKey="uni">Üniversite İşlemleri</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="dip">Diploma İşlemleri</Nav.Link></Nav.Item>
          </Nav>
          <Tab.Content className="mt-3">
            <Tab.Pane eventKey="uni">
              <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Üniversite Ekle</Accordion.Header>
                  <Accordion.Body>{uniRegistry && <UniversityForm contract={uniRegistry} account={account} />}</Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Üniversiteyi Kaldır</Accordion.Header>
                  <Accordion.Body>{uniRegistry && <RevokeUniversityForm contract={uniRegistry} account={account} />}</Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>Üniversite Sorgulama</Accordion.Header>
                  <Accordion.Body>{uniRegistry && <IsUniversity contract={uniRegistry} account={account} />}</Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Tab.Pane>

            <Tab.Pane eventKey="dip">
              <Accordion defaultActiveKey="0" flush>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Diploma Ekle</Accordion.Header>
                  <Accordion.Body>
                    {dipRegistry && <DiplomaForm contract={dipRegistry} account={account} />}
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1">
                  <Accordion.Header>Diploma Onaylama</Accordion.Header>
                  <Accordion.Body>
                    {dipRegistry && <ValidateDiploma contract={dipRegistry} account={account} />}
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="2">
                  <Accordion.Header>Sistemdeki Diplomalar</Accordion.Header>
                  <Accordion.Body>
                    {dipRegistry && <ListDiplomas contract={dipRegistry} account={account} />}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>
    </>
  );
}

export default App;
