'use client'
import { useState } from 'react';

export default function Homepage({signings}) {
    const [filter, setFilter] = useState('');
    const [selectedSigning, setSelectedSigning] = useState(null);
    const [editData, setEditData] = useState({});

    const handleSearchChange = (event) => {
        setFilter(event.target.value);
    };

    const filteredSignings = signings.filter(signing => {
        return (
            signing.fileNumber.includes(filter) ||
            `${signing.propertyAddress}`.toLowerCase().includes(filter.toLowerCase()) ||
            new Date(signing.expectedDeliveryDate).toLocaleDateString().includes(filter)
        );
    });

    const openModal = (signing) => {
        setSelectedSigning(signing);
        setEditData({
            ...signing,
            expectedDeliveryDate: new Date(signing.expectedDeliveryDate).toISOString().split('T')[0],
            expectedDeliveryTime: signing.expectedDeliveryTime
        });
    };

    const closeModal = () => {
        setSelectedSigning(null);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdate = async () => {
        // Replace this with an API call
        console.log('Update Signing:', editData);
        // Assuming the update API call is successful
        closeModal();
    };

    const handleDelete = (signingId) => {
        // Placeholder for delete logic
        console.log('Delete Signing:', signingId);
        closeModal();
    };

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold text-center my-4">Upcoming Signings</h1>
            <input
                type="text"
                placeholder="Search by File Number, Property Address or Date"
                className="w-full p-2 border border-gray-300 rounded-md"
                onChange={handleSearchChange}
            />
            {filteredSignings.length > 0 ? (
                <div className="mt-4 space-y-2">
                    {filteredSignings.map(signing => (
                        <div key={signing.id} className="p-4 border rounded-lg shadow cursor-pointer" onClick={() => openModal(signing)}>
                            <h2 className="text-xl font-semibold">Role: {signing.role}</h2>
                            <p>Property Address: {signing.propertyAddress}</p>
                            <p>File Number: {signing.fileNumber}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center mt-4">No signings found.</p>
            )}

            {selectedSigning && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
                    <div className="bg-white p-4 rounded-lg shadow-lg max-w-lg w-full">
                        <h3 className="text-xl font-bold mb-4">Edit Signing Details</h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdate();
                        }}>
                            <input
                                type="text"
                                name="role"
                                value={editData.role}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md mb-2"
                            />
                            <input
                                type="text"
                                name="propertyAddress"
                                value={editData.propertyAddress}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md mb-2"
                            />
                            <input
                                type="text"
                                name="fileNumber"
                                value={editData.fileNumber}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md mb-2"
                            />
                            <input
                                type="date"
                                name="expectedDeliveryDate"
                                value={editData.expectedDeliveryDate}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md mb-2"
                            />
                            <textarea
                                name="notes"
                                value={editData.notes}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md mb-2"
                                rows="3"
                            ></textarea>
                            <div className="flex space-x-2">
                                <button type="submit" className="flex-1 bg-blue-500 text-white py-2 px-4 rounded">Update</button>
                                <button type="button" onClick={() => handleDelete(selectedSigning.id)} className="flex-1 bg-red-500 text-white py-2 px-4 rounded">Delete</button>
                                <button type="button" onClick={closeModal} className="flex-1 bg-gray-500 text-white py-2 px-4 rounded">Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
