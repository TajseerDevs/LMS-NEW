import React from 'react'
import YellowBtn from '../../components/YellowBtn'
import PurpleBtn from '../../components/PurpleBtn'



const ChildSubmissions = () => {

  return (

    <div className="bg-[#f9f9ff] p-12">

        {/* Header Card */}
        <div className="bg-white rounded-2xl w-[90%] shadow-md p-6 flex flex-col sm:flex-row sm:items-center justify-between mb-16">

            <div className="flex items-center space-x-8">

                <img
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt="Profile"
                    className="w-36 h-36 rounded-full border-2 border-[#403685] shadow-md object-cover"
                />

                <div className='flex flex-col items-start gap-1'>

                    <h1 className="text-2xl font-bold text-[#002147]">Sarah Allen</h1>
                    <p className="text-[#403685] font-semibold text-lg">5th Grade</p>
                    
                    <YellowBtn text="Show Profile"/>

                </div>

            </div>
        
            <div className="flex gap-12 mt-6 mr-10 sm:mt-0 text-sm text-gray-700">

                <div className='flex text-lg flex-col gap-2'>
                    <p className="font-semibold">Enrollment Date : <span className='text-[#6E6E71]'>September 20,2023</span></p>
                    <p className="font-semibold">Educational Student Level : <span className='text-[#6E6E71]'>University</span></p>
                </div>

                <div className="border-l-2 text-lg border-gray-300 flex flex-col gap-2 pl-12">
                    <p className="font-semibold">Number of Courses : <span className='text-[#6E6E71]'>6</span></p>
                    <p className="font-semibold">Student special Needs : <span className='text-[#6E6E71]'>No</span></p>
                </div>

            </div>
        
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-4 mt-4">

            <input
                type="text"
                placeholder="Search"
                className="px-4 py-2 bg-[#ECEBF3] w-[300px] border rounded-md shadow-sm"
            />

            <select className="px-4 w-[300px] py-2 border rounded-md shadow-sm">
                <option>Course name</option>
            </select>

            <select className="px-4 w-[270px] py-2 border rounded-md shadow-sm">
                <option>Type Of Submission</option>
            </select>

            <select className="px-4 w-[270px] py-2 border rounded-md shadow-sm">
                <option>Status</option>
            </select>

        </div>

        {/* Table */}
        <div className="overflow-auto mt-16">

            <table className="min-w-[90%] bg-white rounded-xl overflow-hidden">

                <thead className="bg-gray-100 text-left text-gray-600 text-sm">

                    <tr>
                        <th className="px-4 font-semibold text-lg py-3">Course Name</th>
                        <th className="px-4 font-semibold text-lg py-3">Type Of Submission</th>
                        <th className="px-4 font-semibold text-lg py-3">Submitted</th>
                        <th className="px-4 font-semibold text-lg py-3">Date Of Submission</th>
                        <th className="px-4 font-semibold text-lg py-3">Overall Grade</th>
                        <th className="px-4 font-semibold text-lg py-3">Status</th>
                        <th className="px-4 font-semibold text-lg py-3">Feedback</th>
                    </tr>

                </thead>

                <tbody className="text-sm">

                    {[
                        {
                            course: "Biology Course",
                            type: "Quiz",
                            submitted: "Yes",
                            date: "March 3,2025",
                            grade: "15/20",
                            status: "Good",
                        },
                        {
                            course: "Biology Course",
                            type: "Quiz",
                            submitted: "Yes",
                            date: "March 3,2025",
                            grade: "15/20",
                            status: "Good",
                        },
                        {
                            course: "Biology Course",
                            type: "Quiz",
                            submitted: "Yes",
                            date: "March 3,2025",
                            grade: "15/20",
                            status: "Good",
                        },
                        {
                            course: "Biology Course",
                            type: "Quiz",
                            submitted: "Yes",
                            date: "March 3,2025",
                            grade: "15/20",
                            status: "Good",
                        },
                        {
                            course: "Biology Course",
                            type: "Quiz",
                            submitted: "Yes",
                            date: "March 3,2025",
                            grade: "15/20",
                            status: "Good",
                        },
                        {
                            course: "Math Course",
                            type: "Assignment",
                            submitted: "No",
                            date: "No Submission",
                            grade: "-",
                            status: "Week",
                        },
                        {
                            course: "Science Course",
                            type: "Activity",
                            submitted: "No",
                            date: "No Submission",
                            grade: "-",
                            status: "Week",
                        },
                        {
                            course: "Biology Course",
                            type: "Assignment",
                            submitted: "Yes",
                            date: "February 5 ,2025",
                            grade: "7/15",
                            status: "Week",
                        },
                        {
                            course: "Arabic Course",
                            type: "Assignment",
                            submitted: "Yes",
                            date: "March 15 ,2025",
                            grade: "5/10",
                            status: "Week",
                        },
                        {
                            course: "English Course",
                            type: "Quiz",
                            submitted: "No",
                            date: "No Submission",
                            grade: "-",
                            status: "Week",
                        },
                    ].map((row, i) => (
                        <tr key={i} className="border-t border-gray-100">

                            <td className="px-4 capitalize py-3">{row.course}</td>
                            <td className="px-4 py-3">{row.type}</td>
                            <td className="px-4 py-3">{row.submitted}</td>
                            <td className="px-4 py-3">{row.date}</td>
                            <td className="px-4 py-3">{row.grade}</td>

                            <td className="px-4 py-3">

                                {row.status === "Good" ? (

                                    <span className="px-3 py-1 bg-[#FFF4D2] text-[#FFC200] rounded-full text-xs font-semibold">
                                        Good
                                    </span>
                                        ) : (
                                    <span className="px-3 py-1 bg-[#FBC2C2] text-[#FF0909] rounded-full text-xs font-semibold">
                                        Week
                                    </span>

                                )}

                            </td>

                            <td className="px-4 py-3">
                                <button className="border border-gray-400 px-3 py-1 rounded text-sm text-[#403685] font-semibold hover:bg-gray-100">
                                    No Feedback
                                </button>
                            </td>

                        </tr>
                        
                    ))}

                </tbody>

            </table>

        </div>

        <div className="flex justify-end w-[90%] items-center mt-10 gap-6">
            
            <PurpleBtn text="Previous"/>
            
            <p className="text-sm text-gray-600">Page 1 of 5</p>
            
            <PurpleBtn text="Next"/>

        </div>

    </div>

    )
}


export default ChildSubmissions