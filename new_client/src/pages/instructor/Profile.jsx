import React, { useRef, useState } from "react";
import YellowBtn from "../../components/YellowBtn";
import PurpleBtn from "../../components/PurpleBtn";
import instructorImg from "../../assets/instructor_img.png"
import { useNavigate } from "react-router-dom";
import { useGetInstructorProfileQuery } from "../../store/apis/instructorApis";
import { useSelector } from "react-redux";
import { useDeleteProfileImgMutation, useUploadProfileImageMutation } from "../../store/apis/authApis";
import { toast } from "react-toastify";


const baseUrl = `http://10.10.30.40:5500`;


const Profile = () => {

    const {token} = useSelector((state) => state.user)
    const navigate = useNavigate()

    const fileInputRef = useRef();

    
    const {data , refetch , isLoading , isFetching} = useGetInstructorProfileQuery({token})

    const [uploadProfileImage] = useUploadProfileImageMutation()
    const [deleteProfileImg] = useDeleteProfileImgMutation()

    const [isEditing, setIsEditing] = useState(false)
    
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
        setProfile({ ...profile, [name]: value })
    }



    const handleImageChange = async (e) => {
        
        try {
            
            const file = e.target.files[0]
            
            if (!file) {
                toast.info("You must choose a profile image file")
                return
            }
    
            const validImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
            const maxSizeInMB = 5
            const maxSizeInBytes = maxSizeInMB * 1024 * 1024
    
            if (!validImageTypes.includes(file.type)) {
                return toast.error("Only JPG, JPEG, PNG, or WEBP images are allowed")
            }
    
            if (file.size > maxSizeInBytes) {
                return toast.error(`Image size should not exceed ${maxSizeInMB}MB`)
            }
            
            const formData = new FormData()
            formData.append("profilePic", file)
    
            await uploadProfileImage({ token, formData }).unwrap()
            await refetch()
        
        } catch (error) {
            toast.error(error)    
        }


    }




    const handleRemoveImage = async () => {
        try {
          await deleteProfileImg({ token }).unwrap()
          await refetch()
          toast.success("Profile image removed successfully");
        } catch (error) {
          toast.error("Failed to remove image");
        }
      }


    const profilePicUrl = data?.profilePic ? `${baseUrl}${data?.profilePic}` : instructorImg
    

    if(isLoading || isFetching){
        return <h1 className="text-2xl p-10">Loading ...</h1>
    }



  return (

    <div className="p-10 max-w-3xl">

        <h3 className='text-[#002147] font-semibold text-4xl'>Profile</h3>

        <div className="flex items-center gap-8 mt-12">

            <img src={profilePicUrl} alt="Profile" className="w-32 h-32 rounded-full" />

            <div className="flex items-start gap-2 flex-col">

                <p className="text-[#000] font-semibold text-xl">Upload New Picture</p>
                <p className="text-sm text-[#000]">Your photo should be in PNG or JPG format</p>

                <div className="mt-2 flex gap-3">

                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleImageChange}
                    />
    
                    <YellowBtn text="Choose Image" onClick={() => fileInputRef.current.click()} />

                    {data?.profilePic && (
                        <PurpleBtn text="Remove" onClick={handleRemoveImage} />
                    )}                    
                    
                    <PurpleBtn text={isEditing ? "Cancel" : "Edit"}  onClick={() => setIsEditing(!isEditing)} />

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