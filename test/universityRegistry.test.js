const UniversityRegistry = artifacts.require("UniversityRegistry");

contract("UniversityRegistry", accounts => {
  let registry;
  const owner = accounts[0];         
  const nonOwner = accounts[1];      
  const universityAddress = accounts[2];
  const universityName = "Test University";

  before(async () => {
    registry = await UniversityRegistry.new({ from: owner });
  });

  it("kontrat deploy edildiğinde deploy eden sahibi olmalı", async () => {
    const registryOwner = await registry.owner();
    assert.equal(registryOwner, owner, "Deploy eden sahibi değil");
  });

  it("sadece kontrat sahibi üniversite ekleyebilmeli", async () => {
    const tx = await registry.addUniversity(universityAddress, universityName, { from: owner });
    assert.equal(tx.logs[0].event, "UniversityAdded", "UniversityAdded eventi tetiklenmedi");

    const uni = await registry.universities(universityAddress);
    assert.equal(uni.name, universityName, "Üniversite adı yanlış");
    assert.equal(uni.universityAddress, universityAddress, "Üniversite adresi yanlış");
    assert.equal(uni.exists, true, "Üniversite kaydı oluşturulamadı");
  });

  it("aynı üniversitenin iki kez eklenmesine izin verilmemeli", async () => {
    try {
      await registry.addUniversity(universityAddress, universityName, { from: owner });
      assert.fail("Aynı üniversitenin iki kez eklenmesine izin verildi");
    } catch (error) {
      assert(error.message.includes("Universite zaten kayitli"), "Beklenen hata mesajı alınamadı");
    }
  });

  it("sahibi olmayan hesap üniversite ekleyememeli", async () => {
    try {
      await registry.addUniversity(accounts[3], "Another University", { from: nonOwner });
      assert.fail("Sahibi olmayan hesap üniversite ekleyebildi");
    } catch (error) {
      assert(error.message.includes("Sadece kontrat sahibi bu islemi yapabilir"), "Beklenen revert mesajı alınamadı");
    }
  });

  it("sadece kontrat sahibi üniversiteyi kaldırabilmeli", async () => {
    const newUniversity = accounts[4];
    const newUniversityName = "Another University";
    await registry.addUniversity(newUniversity, newUniversityName, { from: owner });
    let uni = await registry.universities(newUniversity);
    assert.equal(uni.exists, true, "Üniversite eklenemedi");

    const tx = await registry.revokeUniversity(newUniversity, { from: owner });
    assert.equal(tx.logs[0].event, "UniversityRevoked", "UniversityRevoked eventi tetiklenmedi");

    uni = await registry.universities(newUniversity);
    assert.equal(uni.exists, false, "Üniversite kaldırılmadı");
  });

  it("sahibi olmayan hesap üniversiteyi kaldıramamalı", async () => {
    try {
      await registry.revokeUniversity(universityAddress, { from: nonOwner });
      assert.fail("Sahibi olmayan hesap üniversiteyi kaldırabildi");
    } catch (error) {
      assert(error.message.includes("Sadece kontrat sahibi bu islemi yapabilir"), "Beklenen revert mesajı alınamadı");
    }
  });
});
