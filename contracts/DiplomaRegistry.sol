// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

/*
    Diploma Kayıt Kontratı:
    - Bu kontrat, üniversiteler tarafından oluşturulan diplomaları saklar.
    - Sadece kayıtlı üniversiteler diploma ekleyebilir, geçerlilik durumunu değiştirebilir.
    - Yeni eklenen ipfsHash alanı, IPFS üzerinde saklanan diploma PDF dosyasının hash değerini tutar.
*/
import "./UniversityRegistry.sol";

contract DiplomaRegistry {
    // UniversityRegistry kontratına referans
    UniversityRegistry public universityRegistry;
    
    // Diploma bilgilerini tutan yapı
    struct Diploma {
        uint id;
        string studentName;
        string degree;
        bool isValid;
        string ipfsHash;
    }
    
    // Diplomalari saklamak için mapping
    mapping(uint => Diploma) public diplomas;
    uint public diplomaCount;
    
    // Diploma ekleme ve durum değişikliği eventleri
    event DiplomaAdded(uint id, string studentName, string degree, string ipfsHash);
    event DiplomaStatusChanged(uint id, bool isValid);
    
    // Sadece kayıtlı üniversitelerin işlem yapabilmesi için modifier
    modifier onlyUniversity() {
        require(universityRegistry.isUniversity(msg.sender), "Sadece kayitli universite bu islemi yapabilir");
        _;
    }
    
    // DiplomaRegistry kontratı deploy edilirken UniversityRegistry kontratının adresi verilmelidir.
    constructor(address _universityRegistryAddress) public {
        universityRegistry = UniversityRegistry(_universityRegistryAddress);
    }
    
    // Yeni diploma ekleme fonksiyonu (sadece kayıtlı üniversiteler tarafından çağrılabilir)
    function addDiploma(string memory _studentName, string memory _degree, string memory _ipfsHash) public onlyUniversity {
        diplomaCount++;
        diplomas[diplomaCount] = Diploma({
            id: diplomaCount,
            studentName: _studentName,
            degree: _degree,
            isValid: true,
            ipfsHash: _ipfsHash
        });
        emit DiplomaAdded(diplomaCount, _studentName, _degree, _ipfsHash);
    }
    
    // Belirtilen diplomanın geçerliliğini iptal eder (sadece kayıtlı üniversiteler)
    function invalidateDiploma(uint _id) public onlyUniversity {
        require(_id > 0 && _id <= diplomaCount, "Diploma bulunamadi");
        diplomas[_id].isValid = false;
        emit DiplomaStatusChanged(_id, false);
    }
    
    // Belirtilen diplomanın geçerli olduğunu onaylar (sadece kayıtlı üniversiteler)
    function validateDiploma(uint _id) public onlyUniversity {
        require(_id > 0 && _id <= diplomaCount, "Diploma bulunamadi");
        diplomas[_id].isValid = true;
        emit DiplomaStatusChanged(_id, true);
    }
}
