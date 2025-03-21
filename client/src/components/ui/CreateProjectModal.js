import { useState } from "react";
import Modal from "./Modal";

const generateProjectId = () => {
    const randomID = Math.floor(100000 + Math.random() * 900000);
    return new String(randomID);
};

export default function CreateProjectModal({ isOpen, onClose, onProjectCreated, userEmail }) {
    const [projectName, setProjectName] = useState("");
    const [domainName, setDomainName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const handleCreateProject = async () => {
        if (!projectName.trim() || !domainName.trim()) {
            setErrorMessage("Project Name and Domain Name are required.");
            return;
        }

        setIsLoading(true);

        const projectID = generateProjectId();

        try {
            const response = await fetch("/api/post-project", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: userEmail,
                    projectName,
                    domainName,
                    projectID
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage("Project successfully created!"); // Show success message
                onProjectCreated({ id: projectID, name: projectName, domain: domainName, favourites: 0 });
                setProjectName("");
                setDomainName("");
                onClose();
            } else {
                setErrorMessage(data.message || "Error creating project.");
            }
        } catch (error) {
            setErrorMessage("An error occurred while creating the project.");
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Project" hideOKButton={true}>
            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Enter Project Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-slate-800 dark:text-white"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter Domain Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-slate-800 dark:text-white"
                    value={domainName}
                    onChange={(e) => setDomainName(e.target.value)}
                />

                {errorMessage && <p className="text-red-500">{errorMessage}</p>}

                <div className="flex space-x-2">
                    <button
                        className="flex-1 px-3 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md hover:from-blue-600 hover:to-purple-600"
                        onClick={handleCreateProject}
                        disabled={isLoading}
                    >
                        {isLoading ? "Creating..." : "Create New Project"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
