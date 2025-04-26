// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import {
  Container, Navbar, Nav, Tab, Accordion, Spinner
} from 'react-bootstrap';
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    init();
    if (window.ethereum && window.ethereum.on) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0] || '');
        window.location.reload();
      });
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', () => { });
        window.ethereum.removeListener('chainChanged', () => { });
      }
    };
  }, []);
  async function init() {
    if (!window.ethereum) return toast.error('Metamask bulunamadi');
    const web3 = new Web3(window.ethereum);

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const [acct] = await web3.eth.getAccounts();
      setAccount(acct);

      const netId = await web3.eth.net.getId();
      setNetworkId(netId);

      // UniversityRegistry instance
      const uData = UniversityRegistryJSON.networks[netId];
      if (uData) {
        const uReg = new web3.eth.Contract(UniversityRegistryJSON.abi, uData.address);
        setUniRegistry(uReg);
        const owner = await uReg.methods.owner().call();
        setIsAdmin(owner.toLowerCase() === acct.toLowerCase());
      } else {
        toast.warn('UniversityRegistry bulunamadi');
      }

      // DiplomaRegistry instance
      const dData = DiplomaRegistryJSON.networks[netId];
      if (dData) {
        setDipRegistry(new web3.eth.Contract(DiplomaRegistryJSON.abi, dData.address));
      } else {
        toast.warn('DiplomaRegistry bulunamadi');
      }
    } catch (err) {
      console.error(err);
      toast.error('Blockchain baglanti hatasi');
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" /><p>Yukleniyor...</p>
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
            {isAdmin && (
              <Nav.Item>
                <Nav.Link eventKey="uni">Üniversite İşlemleri</Nav.Link>
              </Nav.Item>
            )}
            <Nav.Item>
              <Nav.Link eventKey="dip">Diploma İşlemleri</Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content className="mt-3">
            {isAdmin && (
              <Tab.Pane eventKey="uni">
                <Accordion flush>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>Üniversite Ekle</Accordion.Header>
                    <Accordion.Body>
                      <UniversityForm contract={uniRegistry} account={account} />
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>Üniversiteyi Kaldır</Accordion.Header>
                    <Accordion.Body>
                      <RevokeUniversityForm contract={uniRegistry} account={account} />
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="2">
                    <Accordion.Header>Üniversite Sorgulama</Accordion.Header>
                    <Accordion.Body>
                      <IsUniversity contract={uniRegistry} account={account} />
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Tab.Pane>
            )}

            <Tab.Pane eventKey="dip">
              <Accordion flush>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Diploma Ekle</Accordion.Header>
                  <Accordion.Body>
                    <DiplomaForm
                      contract={dipRegistry}
                      account={account}
                      isAdmin={isAdmin}
                    />
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Diploma Onaylama</Accordion.Header>
                  <Accordion.Body>
                    <ValidateDiploma contract={dipRegistry} account={account} />
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>Sistemdeki Diplomalar</Accordion.Header>
                  <Accordion.Body>
                    <ListDiplomas contract={dipRegistry} account={account} />
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
