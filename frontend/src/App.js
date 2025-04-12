import './App.css';
import React, { useState, useEffect } from "react";
import Web3 from "web3";
import UniversityRegistryJSON from "./contracts/UniversityRegistry.json";
import DiplomaRegistryJSON from "./contracts/DiplomaRegistry.json";
import UniversityForm from "./components/UniversityForm";
import DiplomaForm from "./components/DiplomaForm";
import RevokeUniversityForm from "./components/RevokeUniversityForm";
import IsUniversity from "./components/IsUniversity";
import ValidateDiploma from "./components/ValidateDiploma";
import ListDiplomas from './components/ListDiplomas';

function App() {
  const [account, setAccount] = useState("");
  const [universityRegistry, setUniversityRegistry] = useState(null);
  const [diplomaRegistry, setDiplomaRegistry] = useState(null);
  const [networkId, setNetworkId] = useState(null);

  useEffect(() => {
    loadBlockchainData();
  }, []);

  async function loadBlockchainData() {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(window.ethereum);

        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        const networkIdTemp = await web3.eth.net.getId();
        setNetworkId(networkIdTemp);

        const universityNetworkData = UniversityRegistryJSON.networks[networkIdTemp];
        if (universityNetworkData) {
          const uniRegistry = new web3.eth.Contract(
            UniversityRegistryJSON.abi,
            universityNetworkData.address
          );
          setUniversityRegistry(uniRegistry);
        } else {
          window.alert("UniversityRegistry kontratı bu ağda bulunamadı!");
        }

        const diplomaNetworkData = DiplomaRegistryJSON.networks[networkIdTemp];
        if (diplomaNetworkData) {
          const dipRegistry = new web3.eth.Contract(
            DiplomaRegistryJSON.abi,
            diplomaNetworkData.address
          );
          setDiplomaRegistry(dipRegistry);
        } else {
          window.alert("DiplomaRegistry kontratı bu ağda bulunamadı!");
        }

      } catch (error) {
        console.error("Metamask bağlantı hatası:", error);
      }
    } else {
      alert("Lütfen Metamask veya uyumlu bir cüzdan yükleyin.");
    }
  }

  return (
    <div className="container">
      <h1>Diploma Doğrulama Sistemi</h1>
      <p>Aktif Hesap: {account}</p>
      <p>Network ID: {networkId}</p>

      {universityRegistry && (
        <>
          <UniversityForm contract={universityRegistry} account={account} />
          <RevokeUniversityForm contract={universityRegistry} account={account} />
          <IsUniversity contract={universityRegistry} account={account} />
        </>
      )}
      {diplomaRegistry && (
        <>
          <DiplomaForm contract={diplomaRegistry} account={account} />
          <ValidateDiploma contract={diplomaRegistry} account={account} />
          <ListDiplomas contract={diplomaRegistry} account={account} />
        </>
      )}
    </div>
  );
}

export default App;
