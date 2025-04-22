import React from 'react'
import layerImg from "../../assets/layer-image.png"
import defaultImage from "../../assets/laith-img.png"
import { MdOutlineWatchLater } from 'react-icons/md'
import { HiDocumentText } from 'react-icons/hi'
import { BsFillPeopleFill } from 'react-icons/bs'



const ChildrenSingleCourse = () => {

  return (

    <div className='p-10'>

        <div className="bg-[#F0EEF8] p-6 pl-10 flex justify-between items-center relative">

            <div className='flex flex-col gap-4 p-8 items-start'>

                <div className='flex items-center gap-4'>
                    <img src={defaultImage} alt="" />
                    <span className='text-xl font-semibold text-[#6E6E71]'>Mr. Jad Smih</span>
                </div>

                <h2 className="text-4xl font-semibold mb-12 capitalize text-[#002147]">Biology Course</h2>
            
            </div>
        
            <img
                src={layerImg}
                alt="Design Pattern"
                className="h-[250px] rounded-lg opacity-95 object-contain"
            />
        
            <div className="absolute -bottom-12 left-0 w-full flex justify-center gap-8 p-6">
            
                <div className="bg-white text-indigo-900 px-8 py-5 rounded-lg flex items-center gap-2 shadow-md">
                    <HiDocumentText className="text-xl" /> <span className='font-semibold'>5 Modules</span>
                </div>
            
                <div className="bg-white text-indigo-900 px-8 py-5 rounded-lg flex items-center gap-2 shadow-md">
                    <MdOutlineWatchLater className="text-xl" /> <span className='font-semibold'>30 Hours</span>
                </div>
            
                <div className="bg-white text-indigo-900 px-8 py-5 rounded-lg flex items-center gap-2 shadow-md">
                    <BsFillPeopleFill className="text-xl" /> <span className='font-semibold'>250 already enrolled</span>
                </div>
            
            </div>
            
        </div>


        <div className='p-10 mt-10'>

            <h3 className='text-[#403685] text-2xl font-semibold'>Course Description</h3>

            <p className='text-[#002147] mt-6 text-lg font-semibold'>Explore the fundamentals of life, from cells to ecosystems, in this comprehensive biology course.</p>

        </div>

        <div className='p-10'>

            <h3 className='text-[#403685] text-2xl font-semibold'>Course Content</h3>

            <div className='mt-4 bg-white flex flex-col items-start max-w-[900px] gap-2'>
            
                {/* {course?.sections?.map((section, index) => (
            
                    <div key={section._id} className='bg-white border-b w-full border-gray-300 p-4'>
                          
                        <div onClick={() => toggleSection(section._id)} className='flex justify-between cursor-pointer items-center'>
            
                            <div className='flex cursor-pointer flex-col gap-2'>
                            
                              <span className='font-semibold capitalize text-[18px]' onClick={async () => {
                                try {
                                  toggleSection(section._id)
                                } catch (error) {
                                  console.log(error)
                                }
                              }}>
                                Module {index + 1} : {section.name}
                              </span>
            
                              <div className="section-info text-[16px] text-gray-600">
                                {formatTimeWithLabels(getTotalTime(section?.items || []))} - {section.items?.length} Lessons
                              </div>
            
                            </div>
            
                            <FaAngleDown className={`transition-transform duration-300 ${expandedSections.includes(section._id) ? 'transform rotate-180' : ''}`} size={25}/>
                          
                        </div>
            
                        {expandedSections?.includes(section._id) && (
                            
                            <div className='w-full'>
            
                              {section?.items?.map((item , itemIndex) => (
                                
                                <div key={item._id} className='flex cursor-pointer justify-between items-center w-full mt-8 mb-4'>
            
                                  <div className='flex items-center gap-4'>
                                    {getItemIcon(item.type)}
                                    <span className='font-semibold text-[16px]'>{item.name}</span>
                                  </div>
            
                                  <span className='ml-auto text-[16px] font-semibold mr-2 text-gray-600'>{formatTimeWithLabels(item?.estimatedTime)}</span>
                                  
                                </div>
            
                              ))}
            
                            </div>
            
                          )}
            
                        </div>
            
                    ))} */}
            
                </div>

            </div>

    </div>

  )

}


export default ChildrenSingleCourse