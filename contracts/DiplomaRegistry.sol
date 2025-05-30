// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

import "./UniversityRegistry.sol";

contract DiplomaRegistry {
    UniversityRegistry public universityRegistry;

    struct Diploma {
        uint id;
        string studentName;
        string degree;
        bool isValid;
        string ipfsHash;
        address registeredBy;
    }

    mapping(uint => Diploma) public diplomas;
    uint public diplomaCount;

    event DiplomaAdded(
        uint id,
        string studentName,
        string degree,
        string ipfsHash
    );
    event DiplomaStatusChanged(uint id, bool isValid);

    modifier onlyUniversity() {
        (bool exists, ) = universityRegistry.isUniversity(msg.sender);
        require(exists, "Sadece kayitli universite bu islemi yapabilir");
        _;
    }

    modifier onlyAdmin() {
        require(
            msg.sender == universityRegistry.owner(),
            "Sadece admin islemi yapabilir"
        );
        _;
    }

    modifier onlyAdminOrIssuer(uint _id) {
        if (msg.sender == universityRegistry.owner()) {
            _;
            return;
        }
        (bool uniExists, ) = universityRegistry.isUniversity(msg.sender);
        require(uniExists, "Sadece kayitli universite bu islemi yapabilir");
        require(
            diplomas[_id].registeredBy == msg.sender,
            "Bu diploma yetkiniz disinda"
        );
        _;
    }

    constructor(address _universityRegistryAddress) public {
        universityRegistry = UniversityRegistry(_universityRegistryAddress);
    }

    function addDiploma(
        string memory _studentName,
        string memory _degree,
        string memory _ipfsHash
    ) public onlyUniversity {
        diplomaCount++;
        diplomas[diplomaCount] = Diploma({
            id: diplomaCount,
            studentName: _studentName,
            degree: _degree,
            isValid: true,
            ipfsHash: _ipfsHash,
            registeredBy: msg.sender
        });
        emit DiplomaAdded(diplomaCount, _studentName, _degree, _ipfsHash);
    }

    function addDiplomaFor(
        address _universityAddress,
        string memory _studentName,
        string memory _degree,
        string memory _ipfsHash
    ) public onlyAdmin {
        (bool exists, ) = universityRegistry.isUniversity(_universityAddress);
        require(exists, "Universite tanimli degil");

        diplomaCount++;
        diplomas[diplomaCount] = Diploma({
            id: diplomaCount,
            studentName: _studentName,
            degree: _degree,
            isValid: true,
            ipfsHash: _ipfsHash,
            registeredBy: _universityAddress
        });
        emit DiplomaAdded(diplomaCount, _studentName, _degree, _ipfsHash);
    }

    function invalidateDiploma(uint _id) public onlyAdminOrIssuer(_id) {
        require(_id > 0 && _id <= diplomaCount, "Diploma bulunamadi");
        diplomas[_id].isValid = false;
        emit DiplomaStatusChanged(_id, false);
    }

    function validateDiploma(uint _id) public onlyAdminOrIssuer(_id) {
        require(_id > 0 && _id <= diplomaCount, "Diploma bulunamadi");
        diplomas[_id].isValid = true;
        emit DiplomaStatusChanged(_id, true);
    }

    function getDiplomasByUniversity(
        address universityAddr
    ) public view returns (Diploma[] memory) {
        uint count = 0;
        for (uint i = 1; i <= diplomaCount; i++) {
            if (diplomas[i].registeredBy == universityAddr) {
                count++;
            }
        }
        Diploma[] memory result = new Diploma[](count);
        uint index = 0;
        for (uint i = 1; i <= diplomaCount; i++) {
            if (diplomas[i].registeredBy == universityAddr) {
                result[index] = diplomas[i];
                index++;
            }
        }
        return result;
    }
}
