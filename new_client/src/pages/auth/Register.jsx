import React, { useRef, useState } from 'react';

import logo from '../../assets/register-logo.png';
import student_select_svg from '../../assets/std_svg.svg';
import instructor_select_svg from '../../assets/ins_svg.svg';
import parent_select_svg from '../../assets/par_svg.svg';

import { useRegisterUserMutation } from '../../store/apis/authApis';

import {useNavigate} from "react-router-dom"



const Register = () => {

  const navigate = useNavigate()

  const checkboxRef = useRef(null)

  const [register , {isLoading , isError}] = useRegisterUserMutation()

  const [step, setStep] = useState(1)

  const [selectedRole, setSelectedRole] = useState(null)
  const [selectedRoleValue, setselectedRoleValue] = useState(null)
  const [isChecked, setIsChecked] = useState(false)
  const [selectedCode, setSelectedCode] = useState("+1")
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: '',
    role : ''
  })



  const handleRoleSelect = (role) => {

    setSelectedRole(role)
    const selectedRoleLabel = options.find(option => option.id === role)?.label

    setFormData((prevData) => ({
      role: selectedRoleLabel.toLowerCase(), 
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      dateOfBirth: '',
      gender: '',
    })) 

    setFormData((prevData) => ({ ...prevData , role: selectedRoleLabel.toLowerCase()}))
    setselectedRoleValue(selectedRoleLabel.toLowerCase())

  } 



  const handleCheckboxChange = () => {
    setIsChecked(checkboxRef.current.checked)
  }


  const handleCountryCodeChange = (e) => {
    setSelectedCode(e.target.value);
  };




  const options = [
    {
      id: 1,
      label: 'Student',
      description:
        'Access personalized courses, track progress, and discover learning materials tailored to your goals',
      image: student_select_svg,
    },
    {
      id: 2,
      label: 'Instructor',
      description:
        'Access tools for course creation, management, and evaluation, with student progress tracking',
      image: instructor_select_svg,
    },
    {
      id: 3,
      label:
        'Parent',
      description:
        "Monitor your child's development and aid their learning journey with customized resources.",
      image: parent_select_svg,
    },
  ]



  const countryCodes = [
    { code: '+1', label: 'USA (+1)' },
    { code: '+44', label: 'UK (+44)' },
    { code: '+91', label: 'India (+91)' },
    { code: '+61', label: 'Australia (+61)' },
    { code: '+49', label: 'Germany (+49)' },
    { code: '+33', label: 'France (+33)' },
    { code: '+55', label: 'Brazil (+55)' },
    { code: '+81', label: 'Japan (+81)' },
    { code: '+34', label: 'Spain (+34)' },
    { code: '+39', label: 'Italy (+39)' },
    { code: '+7', label: 'Russia (+7)' },
    { code: '+52', label: 'Mexico (+52)' },
    { code: '+234', label: 'Nigeria (+234)' },
    { code: '+27', label: 'South Africa (+27)' },
    { code: '+971', label: 'United Arab Emirates (+971)' },
    { code: '+65', label: 'Singapore (+65)' },
    { code: '+86', label: 'China (+86)' },
    { code: '+353', label: 'Ireland (+353)' },
    { code: '+54', label: 'Argentina (+54)' },
    { code: '+20', label: 'Egypt (+20)' },
    { code: '+92', label: 'Pakistan (+92)' },
    { code: '+48', label: 'Poland (+48)' },
    { code: '+62', label: 'Indonesia (+62)' },
    { code: '+82', label: 'South Korea (+82)' },
    { code: '+63', label: 'Philippines (+63)' },
    { code: '+60', label: 'Malaysia (+60)' },
    { code: '+233', label: 'Ghana (+233)' },
    { code: '+84', label: 'Vietnam (+84)' },
    { code: '+970', label: 'Palestine (+970)' },
    { code: '+966', label: 'Saudi Arabia (+966)' },
    { code: '+962', label: 'Jordan (+962)' },
    { code: '+227', label: 'Niger (+227)' },
  ]



  const handleInputChange = (e) => {
    const { name , value } = e.target
    setFormData((prevData) => ({ ...prevData , [name] : value }))
  }


  const handlePhoneInputChange = (e) => {
    setFormData({
      ...formData,
      phone: selectedCode + e.target.value, 
    })
  }

  

  const handleContinue = async () => {

    if (step === 1 && selectedRole !== null) {

      setStep(2)
    
    } else if (step === 2) {
    
      const isFormComplete = Object.values(formData).every((value) => value.trim() !== '')
    
      if (isFormComplete) {
        setStep(3)
      } else {
        alert('Please fill out all the fields before proceeding.')
      }

    }

    if (step === 3 && isChecked) {

      const { firstName , lastName , email , phone , dateOfBirth , gender , password , confirmPassword , role } = formData

      if (password !== confirmPassword) {
        return alert('Passwords do not match!')
      }
  
      if (!isChecked) {
        return alert('Please accept the terms and conditions.');
      }

      if (!firstName || !lastName || !email || !phone || !dateOfBirth || !gender || !password || !role) {
        return alert('Please fill in all the fields before submitting.')
      }

      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
      
      if (!emailRegex.test(email)) {
        return alert('Please enter a valid email address.')
      }

      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      
      if (!passwordRegex.test(password)) {
        return alert('Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.')
      }

      try {  
        const res = await register(formData).unwrap()
        navigate("/dashboard")
        console.log("User registered successfully:" , res)
      } catch (error) {
        alert("Registration failed. Please try again.")
      }

    }

  }



  return (
    <div className="flex justify-center items-center min-h-screen p-5">

      <div className="w-full max-w-[1400px] bg-white rounded-lg shadow-lg overflow-hidden">

        <div className="flex">

          <div className="w-1/2 bg-[#F2FBFF] flex flex-col justify-center items-center">

            <div className="flex-grow flex justify-center items-center">

              <img
                src="https://via.placeholder.com/600x600"
                alt="Register"
                className="h-[500px] w-[500px] object-cover"
              />

            </div>

          </div>

          <div className="w-1/2 flex flex-col justify-between p-8 py-10 space-y-10">

            <div className="flex-grow"></div>

            <div className="space-y-10">

              <div className="flex justify-center">
                <img src={logo} alt="Logo" className="w-40 mb-2 object-contain" />
              </div>

              <div className="flex items-center gap-2 justify-between">

                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className={`flex-1 h-1 mb-2 rounded-full ${index < step ? 'bg-blue-500' : 'bg-gray-300'} ${index > 0 ? 'ml-2' : ''}`}
                  ></div>

                ))}

              </div>

              {step === 1 && (
                <>
                  <div className="text-left text-gray-700">

                    <h2 className="text-xl font-semibold mb-4">Choose your account type</h2>

                    <p className="text-sm mb-6 text-[#434343]">
                      Select your role to get a personalized experience tailored to your needs and goals
                    </p>

                  </div>

                  <div className="space-y-4">

                    {options.map((option) => (

                      <div
                        key={option.id}
                        onClick={() => {handleRoleSelect(option.id) ; setselectedRoleValue(option.label)}}
                        className={`flex items-center p-4 border border-gray-300 transition ease-in duration-100 rounded-md cursor-pointer ${
                          selectedRole === option.id
                            ? 'bg-blue-100 shadow-[0px_4px_4px_0px_rgba(0,_0,_0,_0.15)]'
                            : 'hover:bg-gray-200 shadow-[0px_4px_4px_0px_rgba(0,_0,_0,_0.25)]'
                        }`}
                      >
                        <div className="p-6 border-2 mr-5 border-[#1B98E0] rounded-md">

                          <img src={option.image} alt={option.label} className="w-12 h-12" />

                        </div>

                        <div className="flex flex-col text-left">

                          <span className="text-gray-700 font-medium">{option.label}</span>
                          <p className="text-gray-700 mt-1 text-[12px]">{option.description}</p>

                        </div>

                      </div>

                    ))}

                  </div>

                </>

              )}

              {step === 2 && (

                <div className="space-y-12">

                  <h2 className="text-xl text-left font-semibold mb-4">Complete Your Details</h2>

                  <p className="text-sm text-left mb-6 text-[#434343]">Welcome! Begin your learning journey by creating your profile</p>

                  <div className="grid grid-cols-2 gap-5">

                    <div>

                      <label className="block text-gray-600 text-left mb-2">
                        First Name <span className="text-orange-500">*</span>
                      </label>

                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Enter your first name"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />

                    </div>

                    <div>

                      <label className="block text-gray-600 text-left mb-2">
                        Last Name <span className="text-orange-500">*</span>
                      </label>

                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Enter your last name"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />

                    </div>

                    <div>

                      <label className="block text-gray-600 text-left mb-2">
                        Email <span className="text-orange-500">*</span>
                      </label>

                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="example@gmail.com"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />

                    </div>

                    <div>

                      <label className="block text-gray-600 text-left mb-2">
                        Phone Number <span className="text-orange-500">*</span>
                      </label>

                      <div className="flex">

                        <select
                          value={selectedCode}
                          onChange={handleCountryCodeChange}
                          className="w-[30%] mr-1 px-2 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                          
                          <option defaultValue="code" value="code" disabled>Code</option> 
                          
                          {countryCodes.map((country) => (

                            <option key={`${country.code}-${country.label}`} value={country.code}>
                              {country.label}
                            </option>

                          ))}

                        </select>
                        
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone.slice(selectedCode.length)}
                          onChange={handlePhoneInputChange}
                          placeholder="xxxx xxx xx"
                          className="w-[70%] px-4 py-2 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />

                      </div> 

                    </div>

                    <div>

                      <label className="block text-gray-600 text-left mb-2">
                        Password <span className="text-orange-500">*</span>
                      </label>

                      <input  
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />

                    </div>

                    <div>

                      <label className="block text-gray-600 text-left mb-2">
                        Confirm Password <span className="text-orange-500">*</span>
                      </label>

                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm your password"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />

                    </div>

                    <div>
                      <label className="block text-gray-600 text-left mb-2">
                        Date of Birth <span className="text-orange-500">*</span>
                      </label>

                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />

                    </div>

                    <div className="flex-1">

                      <label className="block text-gray-600 text-left mb-2">
                        Gender <span className="text-orange-500">*</span>
                      </label>

                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >

                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>

                      </select>

                    </div>

                  </div>

                </div>
              )}



              {step === 3 && (

                <div className="space-y-8">

                  <h2 className="text-xl text-left font-semibold mb-2">Confirmation</h2>

                  <p className="text-sm text-left mb-2 text-[#434343]">Welcome! Begin your learning journey by creating your profile</p>

                  <div className="grid grid-cols-2 gap-5">

                    <div>
                      <label className="block text-gray-600 text-left mb-2">First Name</label>
                      <p className="block text-blue-600 font-semibold text-lg text-left mb-2">{formData.firstName}</p>
                    </div>

                    <div>
                      <label className="block text-gray-600 text-left mb-2">Last Name</label>
                      <p className="block text-blue-600 font-semibold text-lg text-left mb-2">{formData.lastName}</p>
                    </div>

                    <div>
                      <label className="block text-gray-600 text-left mb-2">Email</label>
                      <p className="block text-blue-600 font-semibold text-lg text-left mb-2">{formData.email}</p>
                    </div>

                    <div>
                      <label className="block text-gray-600 text-left mb-2">Phone Number</label>
                      <p className="block text-blue-600 font-semibold text-lg text-left mb-2">{formData.phone}</p>
                    </div>
                    
                    <div>
                      <label className="block text-gray-600 text-left mb-2">Date of Birth</label>
                      <p className="block text-blue-600 font-semibold text-lg text-left mb-2">{formData.dateOfBirth}</p>
                    </div>

                    <div className="flex-1">
                      <label className="block text-gray-600 text-left mb-2">Gender</label>
                      <p className="block text-blue-600 font-semibold text-lg text-left mb-2">{formData.gender}</p>
                    </div>

                  </div>

                  <div className="flex items-center space-x-3">

                    <input
                      type="checkbox"
                      id="terms"
                      ref={checkboxRef}
                      onChange={handleCheckboxChange}
                      className="w-5 h-5"
                    />

                    <label htmlFor="terms" className="text-gray-600 text-sm">
                      Accept to the <a href="/terms" className="text-blue-500 underline">Terms & Conditions</a>
                    </label>

                  </div>

                </div>

              )}

            </div>

            <div className={`flex ${step === 1 ? "justify-start" : "justify-end"} gap-4`}>

              {(step === 2 || step === 3) && (

                <button
                  type="button"
                  onClick={() => setStep(step === 3 ? 2 : 1)}
                  className="pt-2.5 pb-2.5 px-6 bg-white border-2 border-[#1B98E0] text-[#1B98E0] font-semibold rounded-lg w-[130px] hover:bg-blue-300 hover:text-white"
                >
                  Cancel
                </button>

              )}

              <button
                type="button"
                onClick={handleContinue}
                disabled={(step === 3 && !isChecked)}
                className={`pt-3 pb-3 px-7 disabled:bg-gray-500 disabled:cursor-not-allowed bg-[#1B98E0] text-white font-semibold rounded-lg w-[130px] transition-all hover:bg-blue-500`}
              >
                Continue
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}


export default Register






// const handleStudentInputChange = (e , index) => {

//   const { name, value } = e.target
//   const updatedStudentsData = [...studentsData]
  
//   updatedStudentsData[index] = {
//     ...updatedStudentsData[index],
//     [name]: value,
//   }

//   setStudentsData(updatedStudentsData)

// }



// const addNewStudent = () => {
//   setStudentsData([
//     ...studentsData,
//     {
//       studentConnectionType: '',
//       studentFullName: '',
//       studentId: '',
//       studentGrade: '',
//     },
//   ])
// }


// const handleStepChange = (nextStep) => {
//   if (nextStep > 0 && nextStep <= (isParent ? 4 : 3)) {
//     setStep(nextStep)
//   }
// }



// const [studentsData, setStudentsData] = useState([
//   {
//     studentConnectionType: '',
//     studentFullName: '',
//     studentId: '',
//     studentGrade: '',
//   },
// ])
