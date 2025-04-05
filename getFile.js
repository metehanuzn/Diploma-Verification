
const { Web3Storage } = require('web3.storage');
require('dotenv').config();

// web3.storage erişim tokeninizi .env dosyanızda WEB3STORAGE_TOKEN olarak tanımlayın.
function getAccessToken() {
  return process.env.WEB3STORAGE_TOKEN;
}

// web3.storage client'ınızı oluşturun
function makeStorageClient() {
  return new Web3Storage({ token: getAccessToken() });
}

// Belirli bir CID'ye sahip dosyayı çekmek için fonksiyon
async function getFile(cid) {
  const client = makeStorageClient();
  const res = await client.get(cid);
  if (!res.ok) {
    throw new Error(`Failed to get ${cid}`);
  }
  const files = await res.files();
  for (const file of files) {
    console.log(`Dosya: ${file.name} (${file.size} bytes)`);
  }
}

// Örnek kullanım: getFile fonksiyonuna IPFS dosyanızın CID'sini girin.
const cid = "YOUR_CID_HERE"; // web3.storage'a yüklediğiniz dosyanın CID'si
getFile(cid).catch(console.error);