// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

contract UniversityRegistry {
    address public owner;

    struct University {
        string name;
        address universityAddress;
        bool exists;
    }

    mapping(address => University) public universities;
    address[] public universityList;

    event UniversityAdded(address indexed universityAddress, string name);
    event UniversityRevoked(address indexed universityAddress);

    modifier onlyOwner() {
        require(msg.sender == owner, "Sadece kontrat sahibi bu islemi yapabilir");
        _;
    }

    constructor() public{
        owner = msg.sender;
    }

    function addUniversity(address _universityAddress, string memory _name) public onlyOwner {
        require(_universityAddress != owner, "Admin kendini ekleyemez");
        require(!universities[_universityAddress].exists, "Universite zaten kayitli");

        universities[_universityAddress] = University({
            name: _name,
            universityAddress: _universityAddress,
            exists: true
        });
        universityList.push(_universityAddress);
        emit UniversityAdded(_universityAddress, _name);
    }

    function revokeUniversity(address _universityAddress) public onlyOwner {
        require(universities[_universityAddress].exists, "Universite kayitli degil");
        delete universities[_universityAddress];

        for (uint i = 0; i < universityList.length; i++) {
            if (universityList[i] == _universityAddress) {
                universityList[i] = universityList[universityList.length - 1];
                universityList.pop();
                break;
            }
        }
        emit UniversityRevoked(_universityAddress);
    }

    function isUniversity(address _addr) public view returns (bool, string memory) {
        University memory uni = universities[_addr];
        return (uni.exists, uni.name);
    }

    function getAllUniversities() public view returns (University[] memory) {
        University[] memory list = new University[](universityList.length);
        for (uint i = 0; i < universityList.length; i++) {
            list[i] = universities[universityList[i]];
        }
        return list;
    }
}
