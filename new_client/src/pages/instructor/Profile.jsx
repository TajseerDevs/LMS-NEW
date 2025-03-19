import React, { useState } from "react";
import YellowBtn from "../../components/YellowBtn";
import PurpleBtn from "../../components/PurpleBtn";
import instructorImg from "../../assets/instructor_img.png"
import { useNavigate } from "react-router-dom";


const Profile = () => {

    const [isEditing, setIsEditing] = useState(false)
    const navigate = useNavigate()
    
    const [profile, setProfile] = useState({
      firstName: "Mohammad",
      lastName: "Ali",
      email: "Mohammad@gmail.com",
      phone: "+962 78982773",
      workingHours: "2 hr",
      status: "Available",
      bio: "I am a dedicated instructor with a passion for [subject area], bringing [X] years of experience in [teaching/industry/research]. My approach focuses on making learning interactive, practical, and engaging, helping students develop real-world skills. I specialize in [specific topics or methodologies] and aim to inspire lifelong learning. Let's explore knowledge together!",
    })


    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    }


  return (
    <div className="p-10 max-w-3xl">

        <h3 className='text-[#002147] font-semibold text-4xl'>Profile</h3>

        <div className="flex items-center gap-8 mt-12">

            <img src={instructorImg} alt="Profile" className="w-32 h-32" />

            <div className="flex items-start gap-2 flex-col">

                <p className="text-[#000] font-semibold text-xl">Upload New Picture</p>
                <p className="text-sm text-[#000]">Your photo should be in PNG or JPG format</p>

                <div className="mt-2 flex gap-3">
                    <YellowBtn text="Choose Image"/>
                    <PurpleBtn text="Remove" />
                    <PurpleBtn   text={isEditing ? "Cancel" : "Edit"}  onClick={() => setIsEditing(!isEditing)} />
                </div>

            </div>

      </div>

      <div className="mt-12 flex gap-6 flex-wrap w-[1400px] gap-y-8 p-6 ">

        {Object.entries(profile).map(([key, value], index, array) => (

            <div 
                key={key} 
                className={`w-[48%] ${key === "bio" ? "w-full" : ""}`}
            >

            <p className="text-lg mb-1 text-[#01080E] capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
            
            {isEditing ? (

                key === "bio" ? (

                <textarea 
                    name={key} 
                    value={value} 
                    onChange={handleChange} 
                    className="w-full p-6 h-44 resize-none"
                />

                ) : (

                <input 
                    name={key} 
                    value={value} 
                    onChange={handleChange} 
                    className="w-full p-4 mt-1 mr-6"
                />

                )

            ) : (
                <p className="text-[#403685] font-semibold">{value}</p>
            )}

            </div>
            
        ))}

        </div>

        <div className="mt-10 w-[1220px] flex justify-end gap-4">
            <YellowBtn text="Save Profile"/>
            <PurpleBtn onClick={() => navigate("/instructor/dashboard")} text="Cancel"/>
        </div>    


    </div>
  )
}



export default Profile