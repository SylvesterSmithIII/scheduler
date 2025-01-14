'use client'

import { useState, useEffect } from 'react';

function EscrowForm() {
    const [names, setNames] = useState(['']);
    const [formData, setFormData] = useState({
        role: '',
        propertyAddress: '',
        fileNumber: '',
        signingLocation: '',
        deliveryOption: 'fedex',
        expectedDeliveryDate: '',
        expectedDeliveryTime: '',
        notes: '',
    });

    useEffect(() => {
        console.log(formData)
    }, [formData])

    const handleInputChange = (e) => {
        const { name, type, value, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleNameChange = (index, event) => {
        const newNames = [...names]; // Create a new copy of the names array
        console.log(index, event)
        newNames[index] = event.target.value; // Update the value at the specified index
        setNames(newNames); // Set the new array to state
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting form:', formData);
        // POST data to a server or handle it accordingly
    };

    const HandleClick = (e) => {
        setFormData({
            ...formData,
            role: e.target.value
        })
    }

    const addNameField = () => {
        setNames([...names, ''])
    }

    return (
        <>
        
        <div className="max-w-screen-xl mx-auto px-4 bg-[#f2f6f5] flex flex-col">
  <header className="flex justify-between items-center py-4">
    <div className="flex items-center gap-1">
      <img className="w-8 h-8" src="https://via.placeholder.com/27x27" alt="Logo" />
      <h1 className="text-2xl font-normal text-[#19332c]">FormApp</h1>
    </div>
  </header>

  <main className="flex flex-col gap-4 p-4">
    <h2 className="text-2xl font-normal">Real Estate Transaction Form</h2>

    <div className="flex flex-col gap-4">
      <label className="flex flex-col">
        Buyer/Seller
        <div>
        <button className={` text-black rounded-full py-1 px-2 ${formData.role === 'buyer' ? 'bg-green-700' : 'bg-white'}`} onClick={HandleClick} value={'buyer'}>Buyer</button>
        <button className={` text-black rounded-full py-1 px-2 ${formData.role === 'seller' ? 'bg-green-700' : 'bg-white'}`} onClick={HandleClick} value={'seller'}>Seller</button>
        </div>
        
      </label>

      <label className="flex flex-col">
        Name
        {
            names.map((name, index) => 
            <input key={index} type="text" placeholder="Enter Name" className="mt-1 p-2 bg-white border rounded-full" onChange={(e) => handleNameChange(index, e)} />
        )}
        <button onClick={addNameField} className='hover:scale-125  transition-all duration-300'>Add Another Signer</button>
      </label>

      <label className="flex flex-col">
        Property Address
        <input type="text" name='propertyAddress' placeholder="Enter Property Address" className="mt-1 p-2 bg-white border rounded-full" onChange={handleChange} />
      </label>

      <label className="flex flex-col">
        File Number
        <input type="text" name='fileNumber' placeholder="Enter File Number" className="mt-1 p-2 bg-white border rounded-full" onChange={handleChange} />
      </label>

      <label className="flex flex-col">
        Signing Location
        <input type="text" name='signingLocation' placeholder="Enter Signing Location" className="mt-1 p-2 bg-white border rounded-full" onChange={handleChange} />
      </label>

      <label className="flex flex-col">
        Document Delivery Option
        <select className="mt-1 p-2 bg-white border rounded-full">
          <option value="fedex">FedEx</option>
          <option value="courier">Courier</option>
        </select>
      </label>

      <label className="flex flex-col">
        Expected Delivery Date
        <input type="date" name='expectedDeliveryDate' className="mt-1 p-2 bg-white border rounded-full" onChange={handleChange} />
      </label>

      <label className="flex flex-col">
        Expected Delivery Time
        <input type="time" name='expectedDeliveryTime' className="mt-1 p-2 bg-white border rounded-full" onChange={handleChange} />
      </label>

      <label className="flex flex-col">
        Notes
        <textarea placeholder="Enter any additional notes" name='' className="mt-1 p-2 bg-white border rounded-full" rows="3" onChange={handleChange}></textarea>
      </label>

      <button className="w-full py-2 bg-[#19332c] text-white rounded-full">Submit</button>
    </div>
  </main>
</div>


        </>
    );
}

export default EscrowForm;
