import React, { useState } from "react";

function DiplomaForm({ contract, account }) {
    const [studentName, setStudentName] = useState("");
    const [degree, setDegree] = useState("");
    const [ipfsHash, setIpfsHash] = useState("");

    async function handleAddDiploma(e) {
        e.preventDefault();
        if (!contract) return alert("Kontrat yüklenemedi!");

        try {
            await contract.methods
                .addDiploma(studentName, degree, ipfsHash)
                .send({ from: account });
            alert("Diploma başarıyla eklendi!");
        } catch (error) {
            console.error(error);
            alert("Diploma ekleme başarısız!");
        }
    }

    return (
        <div>
            <h3>Diploma Ekle</h3>
            <form onSubmit={handleAddDiploma}>
                <div className="mb-2">
                    <label>Öğrenci Adı:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-2">
                    <label>Derece (degree):</label>
                    <input
                        type="text"
                        className="form-control"
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-2">
                    <label>IPFS Hash:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={ipfsHash}
                        onChange={(e) => setIpfsHash(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Ekle</button>
            </form>
        </div>
    );
}

export default DiplomaForm;