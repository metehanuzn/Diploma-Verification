const UniversityRegistry = artifacts.require("UniversityRegistry");
const DiplomaRegistry = artifacts.require("DiplomaRegistry");

contract("DiplomaRegistry", accounts => {
  let universityRegistryInstance;
  let diplomaRegistryInstance;

  const owner = accounts[0];         
  const university = accounts[1];    
  const nonUniversity = accounts[2]; 

  before(async () => {
    universityRegistryInstance = await UniversityRegistry.new({ from: owner });
    
    await universityRegistryInstance.addUniversity(university, "Test University", { from: owner });
    
    diplomaRegistryInstance = await DiplomaRegistry.new(universityRegistryInstance.address, { from: owner });
  });

  it("kayıtlı üniversite, diploma ekleyebilmeli", async () => {
    const studentName = "John Doe";
    const degree = "Bachelor of Science";
    const ipfsHash = "QmTestHash123"; 

    await diplomaRegistryInstance.addDiploma(studentName, degree, ipfsHash, { from: university });
    
    const diplomaCount = await diplomaRegistryInstance.diplomaCount();
    assert.equal(diplomaCount.toNumber(), 1, "Diploma sayısı 1 olmalı");

    const diploma = await diplomaRegistryInstance.diplomas(1);
    assert.equal(diploma.studentName, studentName, "Öğrenci adı uyuşmuyor");
    assert.equal(diploma.degree, degree, "Diploma derecesi uyuşmuyor");
    assert.equal(diploma.isValid, true, "Diploma geçerli olmalı");
    assert.equal(diploma.ipfsHash, ipfsHash, "IPFS hash uyuşmuyor");
  });

  it("kayıtlı olmayan üniversite diploma ekleyememeli", async () => {
    try {
      await diplomaRegistryInstance.addDiploma("Jane Doe", "Master of Arts", "QmTestHash456", { from: nonUniversity });
      assert.fail("Kayıtlı olmayan üniversitenin diploma eklemesine izin verilmemeli");
    } catch (error) {
      assert(
        error.message.includes("Sadece kayitli universite bu islemi yapabilir"),
        "Beklenen revert mesajı alınamadı"
      );
    }
  });

  it("kayıtlı üniversite, diplomanın geçerliliğini iptal edebilmeli", async () => {
    await diplomaRegistryInstance.invalidateDiploma(1, { from: university });
    const diploma = await diplomaRegistryInstance.diplomas(1);
    assert.equal(diploma.isValid, false, "Diploma geçersiz olmalı");
  });

  it("kayıtlı üniversite, diplomanın geçerliliğini onaylayabilmeli", async () => {
    await diplomaRegistryInstance.validateDiploma(1, { from: university });
    const diploma = await diplomaRegistryInstance.diplomas(1);
    assert.equal(diploma.isValid, true, "Diploma geçerli olmalı");
  });
});
