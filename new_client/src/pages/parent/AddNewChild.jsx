import React, { useState } from 'react'
import PurpleBtn from '../../components/PurpleBtn'
import { IoAddSharp } from "react-icons/io5"
import YellowBtn from '../../components/YellowBtn'
import { useNavigate } from 'react-router-dom'
import { useAssignStudentsToParentMutation, useGetMyStudentsQuery } from '../../store/apis/parentApis'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'



const AddNewChild = () => {

    const navigate = useNavigate()
    const {token} = useSelector((state) => state.user)

    const [formData , setFormData] = useState({
        fullName: '',
        studentId: '',
        educationLevel: '',
        specialNeeds: false,
        emergencyContact: '',
        phoneNumber: '',
        email: '',
    })


    const handleChange = (e) => {

        const { id , value , type , name } = e.target

        setFormData((prevData) => ({
          ...prevData,
          [id || name]: type === 'radio' ? value === 'yes' : value,
        }))

    }


    const {refetch} = useGetMyStudentsQuery({token})
    const [assignStudentsToParent , { isLoading , error }] = useAssignStudentsToParentMutation()



    const handleSubmit = async (e) => {

        e.preventDefault()
      
        try {
          await assignStudentsToParent({
            token,
            students: [
              {
                studentId: formData.studentId,
                fullName: formData.fullName,
                educationLevel: formData.educationLevel,
                specialNeeds: formData.specialNeeds,
                relation: {
                  role: formData.emergencyContact,
                  emergencyNumber: formData.phoneNumber,
                  emergencyEmail: formData.email,
                },
              },
            ],
          }).unwrap()
      
          await refetch()
          toast.success("Students successfully assigned to parent")
      
          setFormData({
            fullName: '',
            studentId: '',
            educationLevel: '',
            specialNeeds: false,
            emergencyContact: '',
            phoneNumber: '',
            email: '',
          });
      
          setTimeout(() => {
            navigate("/parent/children");
          }, 200);
      
        } catch (err) {
            setFormData({
                fullName: '',
                studentId: '',
                educationLevel: '',
                specialNeeds: false,
                emergencyContact: '',
                phoneNumber: '',
                email: '',
            })
          console.error("Failed to assign students: ", err);
          toast.error(err?.data?.message || "Something went wrong");
        }

    }
      
    


    if(isLoading){
        return <h1>Loading ...</h1>
    }


    
  return (

    <div className="max-w-4xl ml-10 p-10 sm:p-8 bg-gray-50">

        <h1 className="text-2xl font-bold mb-6">Add New Child</h1>

        <form className='flex flex-col gap-4'>

            <div className="mb-4">

                <label className="block text-sm font-medium mb-1" htmlFor="fullName">
                    Student's Full Name<span className="text-red-500">*</span>
                </label>

                <input
                    type="text"
                    id="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter student's full name"
                    className="w-full border border-gray-300 p-2 rounded"
                />

            </div>

            <div className="mb-4">

                <label className="block text-sm font-medium mb-1" htmlFor="studentId">
                    Student's ID<span className="text-red-500">*</span>
                </label>

                <input
                    type="text"
                    id="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    placeholder="Enter Student's ID"
                    className="w-full border border-gray-300 p-2 rounded"
                />

            </div>

            <div className="mb-4">

                <label className="block text-sm font-medium mb-1" htmlFor="educationLevel">
                    Educational Stage Level<span className="text-red-500">*</span>
                </label>

                <select  value={formData.educationLevel} onChange={handleChange} id="educationLevel" className="w-full border capitalize border-gray-300 p-2 rounded">
                    <option value="" disabled selected>Select Level</option>
                    <option value="K-12">K-12</option>
                    <option value="university">university</option>
                    <option value="training">training</option>
                </select>

            </div>

            <div className="mb-4">

                <label className="block text-sm font-medium mb-1">
                    Student Special Needs<span className="text-red-500">*</span>
                </label>

                <div className="flex items-center gap-4">

                    <label className="mr-4">
                        <input checked={formData.specialNeeds === true} onChange={handleChange} type="radio" name="specialNeeds" value="yes" className="mr-1" />
                        Yes
                    </label>

                    <label>
                        <input type="radio" checked={formData.specialNeeds === false} onChange={handleChange} name="specialNeeds" value="no" className="mr-1" />
                        No
                    </label>

                </div>

            </div>

            <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-4">

                <div>

                    <label className="block text-sm font-medium mb-1" htmlFor="emergencyContact">
                        Emergency Contact<span className="text-red-500">*</span>
                    </label>

                    <select value={formData.emergencyContact}  onChange={handleChange} id="emergencyContact" className="w-full border capitalize border-gray-300 p-2 rounded">
                        <option value="" selected hidden>Select Emergency Contact</option>
                        <option value="father">father</option>
                        <option value="mother">mother</option>
                        <option value="guardian">guardian</option>
                    </select>
                    
                </div>

                <div>

                    <label className="block text-sm font-medium mb-1" htmlFor="phoneNumber">
                        Phone Number<span className="text-red-500">*</span>
                    </label>

                    <input
                        type="text"
                        id="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="+962 xxxx xxx xx"
                        className="w-full border border-gray-300 p-2 rounded"
                    />

                </div>

                <div>

                    <label className="block text-sm font-medium mb-1" htmlFor="email">
                        Email<span className="text-red-500">*</span>
                    </label>

                    <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter Email"
                        className="w-full border border-gray-300 p-2 rounded"
                    />

                </div>

            </div>

            {/* <div className="mb-4 w-[30%]">
                <PurpleBtn icon={IoAddSharp} text="Add Emergency Contact"/>
            </div> */}

            <div className="flex mt-10 justify-end space-x-4">

                <PurpleBtn onClick={() => navigate("/parent/children")} text="Cancel"/>

                <YellowBtn onClick={handleSubmit} text="Add new child"/>

            </div>
            
            {error && <p className="text-red-500 mt-4">Error: {error?.data?.msg}</p>}

        </form>

    </div>  
  
    )

}


export default AddNewChild