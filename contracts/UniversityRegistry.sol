// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

/*
    Üniversite Kayıt Kontratı:
    - Bu kontrat, sistemde üniversitelerin kaydını tutar.
    - Sadece kontrat sahibi (deploy eden) üniversite ekleyebilir.
*/
contract UniversityRegistry {
    // Kontrat sahibi
    address public owner;
    
    // Üniversite bilgilerini tutan yapı
    struct University {
        string name;
        address universityAddress;
        bool exists;
    }
    
    // Üniversiteleri adreslerine göre saklayan mapping
    mapping(address => University) public universities;
    
    // Üniversite ekleme eventi
    event UniversityAdded(address indexed universityAddress, string name);
    event UniversityRevoked(address indexed universityAddress);
    
    // Kontrat deploy edildiğinde deploy eden kişi sahibi olur.
    constructor() public {
        owner = msg.sender;
    }
    
    // Sadece kontrat sahibinin işlem yapabilmesi için modifier
    modifier onlyOwner(){
        require(msg.sender == owner, "Sadece kontrat sahibi bu islemi yapabilir");
        _;
    }
    
    // Yeni üniversite ekleme fonksiyonu
    function addUniversity(address _universityAddress, string memory _name) public onlyOwner {
        require(!universities[_universityAddress].exists, "Universite zaten kayitli");
        universities[_universityAddress] = University({
            name: _name,
            universityAddress: _universityAddress,
            exists: true
        });
        emit UniversityAdded(_universityAddress, _name);
    }
    
    // Kayıtlı üniversiteyi sistemden kaldırma fonksiyonu
    function revokeUniversity(address _universityAddress) public onlyOwner {
        require(universities[_universityAddress].exists, "Universite kayitli degil");
        delete universities[_universityAddress];
        emit UniversityRevoked(_universityAddress);
    }

    // Bir adresin kayıtlı üniversite olup olmadığını kontrol eder
    function isUniversity(address _addr) public view returns(bool) {
        return universities[_addr].exists;
    }
}
