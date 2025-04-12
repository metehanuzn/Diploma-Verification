// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract UniversityRegistry {
    address public owner;
    
    struct University {
        string name;
        address universityAddress;
        bool exists;
    }
    
    mapping(address => University) public universities;
    
    event UniversityAdded(address indexed universityAddress, string name);
    event UniversityRevoked(address indexed universityAddress);
    
    constructor() public {
        owner = msg.sender;
    }
    
    modifier onlyOwner(){
        require(msg.sender == owner, "Sadece kontrat sahibi bu islemi yapabilir");
        _;
    }

    function addUniversity(address _universityAddress, string memory _name) public onlyOwner {
        require(!universities[_universityAddress].exists, "Universite zaten kayitli");
        universities[_universityAddress] = University({
            name: _name,
            universityAddress: _universityAddress,
            exists: true
        });
        emit UniversityAdded(_universityAddress, _name);
    }

    function revokeUniversity(address _universityAddress) public onlyOwner {
        require(universities[_universityAddress].exists, "Universite kayitli degil");
        delete universities[_universityAddress];
        emit UniversityRevoked(_universityAddress);
    }

    function isUniversity(address _addr) public view returns (bool, string memory) {
        University memory uni = universities[_addr];
        return (uni.exists, uni.name);
    }
}
