import React from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import defaultImage from "../../assets/laith-img.png"
import YellowBtn from "../../components/YellowBtn"
import { useNavigate } from "react-router-dom"




const ChildrensQuizzesGrades = () => {

  const navigate = useNavigate()

  const students = [
    { 
      id : 1 ,
      name: "Sarah Allen",
      school: "School",
      img: defaultImage,
    },
    { 
      id : 2 ,
      name: "Yazan Allen",
      school: "School",
      img: defaultImage,
    },
    { 
      id : 3 ,
      name: "Zein Allen",
      school: "School",
      img: defaultImage,
    },
    { 
      id : 4 ,
      name: "Laith Allen",
      school: "School",
      img: defaultImage,
    },
    { 
      id : 3 ,
      name: "Moe Allen",
      school: "School",
      img: defaultImage,
    },
  ]


  return (
    
    <>
        
      <h1 className="text-3xl px-16 mt-10 font-semibold text-[#403685] mb-10">Quizzes and Grade</h1>

      <div className="w-[75%] mx-auto flex items-center justify-center py-16 px-6 mt-20 relative">

        <Swiper
          slidesPerView={4}
          spaceBetween={30}
          navigation
          pagination={{ clickable: true }}
          modules={[Navigation, Pagination]}
          className="student-swiper"
        >

          {students.map((student, idx) => (

            <SwiperSlide key={idx}>

              <div className="rounded-xl p-8 w-[400px] flex flex-col items-center gap-2 text-center text-[#0F0F33] font-semibold shadow-md 
                [background:radial-gradient(389.93%_239.13%_at_0.9%_2.98%,_#E2DDFF_0%,_#FFE285_100%)] 
                [backdrop-filter:blur(21px)]"
              >

                <img
                  src={student.img}
                  alt={student.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                />

                <h3 className="text-xl font-semibold text-[#002147]">{student.name}</h3>
                <p className="text-md text-[#002147]">{student.school}</p>

                <YellowBtn onClick={() => navigate(`/parent/children/course/grdaes/${student.id}`)} text="Show Quiz Grades"/> 

              </div>

            </SwiperSlide>

          ))}

        </Swiper>

      </div>
    
    </>

  )

}

 
export default ChildrensQuizzesGrades