'use client'

import { useState, useEffect } from 'react';

function EscrowForm() {
    const [names, setNames] = useState([{
      firstName: '',
      lastName: ''
    }]);
    
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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleNameChange = (index, event) => {
      const { name, value } = event.target; // Destructure name and value from the event
      const updatedNames = [...names]; // Make a shallow copy of the names array
      updatedNames[index][name] = value; // Update the specific field
      console.log(updatedNames)
      setNames(updatedNames); // Update state
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
        setNames([...names, { firstName: "", lastName: "" }])
    }

    return (
        <>
        
        <div className="max-w-screen-xl mx-auto px-4  flex flex-col">
  <header className="flex justify-between items-center py-4">
    <div className="flex items-center gap-1">
      
      <h1 className="text-2xl font-normal text-[#19332c]">FormApp</h1>
    </div>
  </header>

  <main className="flex flex-col gap-8 p-4">
    <h2 className="text-2xl font-normal text-center">Add Signing</h2>

    <div className="flex flex-col gap-4">

      <div className='flex flex-col'>
        <div className='flex'>
          <h3 className='flex-1'>Buer Name</h3>
          <h3 className='flex-1'>Last Name</h3>
        </div>
        <div className='flex'>
          <h3 className='flex-1'>First Name</h3>
          <h3 className='flex-1'>Last Name</h3>
        </div>

      </div>
      
    <label className="flex flex-col text-2xl">
        Buyer/Seller
        <div className='text-xl'>
        <button className={` text-black rounded-full py-1 px-2 ${formData.role === 'buyer' ? 'bg-green-700' : 'bg-white'}`} onClick={HandleClick} value={'buyer'}>Buyer</button>
        <button className={` text-black rounded-full py-1 px-2 ${formData.role === 'seller' ? 'bg-green-700' : 'bg-white'}`} onClick={HandleClick} value={'seller'}>Seller</button>
        </div>
        
      </label>

      <div className='flex flex-col gap-4'>

        
        {names.map((name, index) => (

          <>
          
          <div className='flex gap-12'>
          <h3 className='flex-1'>First Name</h3>
          <h3 className='flex-1'>Last Name</h3>
        </div>

        <div className="flex gap-12 mb-4" key={index}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={name.firstName} // Controlled input
            onChange={(event) => handleNameChange(index, event)} // Handle change
            className="border p-2 flex-1"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={name.lastName} // Controlled input
            onChange={(event) => handleNameChange(index, event)} // Handle change
            className="border p-2 flex-1"
          />
        </div>
        </>
      ))}
       

      </div>

      <div className='flex justify-center'>

      <button onClick={addNameField} className="group relative h-12 overflow-hidden overflow-x-hidden rounded-md bg-neutral-50 hover:text-neutral-50 duration-300 px-8 py-2 max-w-64 transition-all"><span class="relative z-10"></span>Add Another Signing<span class="absolute inset-0 overflow-hidden rounded-md"><span class="absolute left-0 aspect-square w-full origin-center -translate-x-full rounded-full bg-[#2a5a49]  transition-all duration-500 group-hover:-translate-x-0 group-hover:scale-150"></span></span></button>
      
      
      

      </div>

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
        <textarea placeholder="Enter any additional notes" name='notes' className="mt-1 p-2 bg-white border rounded-full" rows="3" onChange={handleChange}></textarea>
      </label>

      <button className="w-full py-2 bg-[#19332c] text-white rounded-full">Submit</button>
    </div>
  </main>
</div>


        </>
    );
}

export default EscrowForm;
