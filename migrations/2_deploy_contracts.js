const UniversityRegistry = artifacts.require("UniversityRegistry");
const DiplomaRegistry = artifacts.require("DiplomaRegistry");

module.exports = async function (deployer) {
  await deployer.deploy(UniversityRegistry);
  const universityRegistryInstance = await UniversityRegistry.deployed();
  await deployer.deploy(DiplomaRegistry, universityRegistryInstance.address);
};