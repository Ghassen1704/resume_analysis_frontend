import React, { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";

const ResumeUpload = () => {
    const [file, setFile] = useState(null);
    const [response, setResponse] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const { getRootProps, getInputProps } = useDropzone({
        accept: ".pdf",  // Ensure only PDF files are accepted
        onDrop: (acceptedFiles, rejectedFiles) => {
            if (rejectedFiles.length > 0) {
                setErrorMessage("Invalid file type. Please upload a PDF.");
            } else {
                setFile(acceptedFiles[0]);
                setErrorMessage("");  // Clear any previous error messages
            }
        },
    });

    const handleUpload = async () => {
        if (!file) return alert("Please select a resume file");

        const formData = new FormData();
        formData.append("resume_file", file);
        formData.append("user_name", "John Doe");
        formData.append("email", "johndoe@example.com");
        formData.append("phone", "1234567890");

        try {
            const res = await axios.post("http://127.0.0.1:8000/api/resumes/upload/", formData);
            console.log("Full backend response:", res);  // Debugging full response object
            console.log("Response data:", res.data); // Specific logging for the data

            setResponse(res.data);
        } catch (error) {
            console.error("Error uploading resume:", error);
            setErrorMessage("An error occurred while uploading the resume.");
        }
    };

    return (
        <div>
            <div
                {...getRootProps()}
                style={{ border: "2px dashed #ccc", padding: "20px", marginBottom: "20px" }}
            >
                <input {...getInputProps()} />
                <p>Drag & drop a PDF resume here, or click to select</p>
            </div>
            {file && <p>Selected file: {file.name}</p>}
            <button onClick={handleUpload}>Upload Resume</button>

            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

            {response && (
                <div style={{ marginTop: "30px", fontFamily: "Arial, sans-serif" }}>
                    <h3 style={{ color: "#333" }}>Resume Analysis</h3>

                    <section style={{ marginBottom: "20px" }}>
                        <h4 style={{ fontWeight: "bold", color: "#444" }}>Skills:</h4>
                        <pre>{response.skills}</pre> {/* Displaying skills exactly as received */}
                    </section>

                    <section style={{ marginBottom: "20px" }}>
                        <h4 style={{ fontWeight: "bold", color: "#444" }}>Experience:</h4>
                        <pre>{response.experience}</pre> {/* Displaying experience exactly as received */}
                    </section>

                    <section style={{ marginBottom: "20px" }}>
                        <h4 style={{ fontWeight: "bold", color: "#444" }}>Education:</h4>
                        <pre>{response.education}</pre> {/* Displaying education exactly as received */}
                    </section>
                </div>
            )}
        </div>
    );
};

export default ResumeUpload;
