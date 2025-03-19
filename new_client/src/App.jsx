import { useEffect, useState } from 'react'

import './App.css'

import { BrowserRouter as Router , Route , Routes , useNavigate , Navigate , useLocation , Outlet } from "react-router-dom"

import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'

import { useGetUserMutation } from './store/apis/authApis'
import { setUser } from './store/slices/userSlice'

import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import MyLearning from './pages/courses/MyLearning'

import ProtectedRoute from './components/ProtectedRoute'
import AdminProtectedRoute from './components/AdminProtectedRoute'
import InstructorProtectedRoute from './components/InstructorProtectedRoute'

import useSocket from './hooks/useSocket'
import { SocketProvider } from './context/SocketContext'

import ExploreCourses from './pages/courses/ExploreCourses'
import SingleCourse from './pages/courses/SingleCourse'
import InstructorProfile from './pages/instructor/InstructorProfile'
import OrderSummary from './pages/payment/OrderSummary'
import EnrolledCourse from './pages/courses/EnrolledCourse'
import InstructorCourses from './pages/instructor/InstructorCourses'
import CreateCourse from './pages/instructor/CreateCourse'
import CourseStructure from './pages/instructor/CourseStructure'
import WishList from './pages/wishlist/WishList'
import BookMark from './pages/bookmark/BookMark'
import Quizzes from './pages/quiz/Quizzes'
import CreateQuiz from './pages/quiz/CreateQuiz'
import EditQuiz from './pages/quiz/EditQuiz'
import CreateAssigment from './pages/assigment/CreateAssigment'
import SupportTickets from './pages/tickets/SupportTickets'
import CourseEnrolledStudnetsInsights from './pages/instructor/CourseEnrolledStudnetsInsights'
import CreateLiveSession from './pages/live-session/CreateLiveSession'
import InstructorCoursesTickets from './pages/instructor/InstructorCoursesTickets'
import InstructorCourseTickets from './pages/instructor/InstructorCourseTickets'
import Grades from './pages/instructor/Grades'
import Assigments from './pages/assigment/Assigments'
import AssigmentSubmissions from './pages/assigment/AssigmentSubmissions'
import CourseAssigments from './pages/assigment/CourseAssigments'
import StudentAssigmentsSubmissions from './pages/assigment/StudentAssigmentsSubmissions'
import CourseEnrolledStudnets from './pages/instructor/CourseEnrolledStudnets'
import CourseEnrolledStudnetQuizzesProgress from './pages/instructor/CourseEnrolledStudnetQuizzesProgress'
import CourseFeedbacks from './pages/instructor/CourseFeedbacks'
import Profile from './pages/instructor/Profile'
import InstructorDashboard from './components/InstructorDashboard'
import AssignmentDetails from './pages/assigment/AssignmentDetails'
import SubmitAssignmentSubmission from './pages/assigment/SubmitAssignmentSubmission'
import MyCertificates from './pages/certificate/MyCertificates'
import EnrolledCourses from './pages/courses/EnrolledCourses'
import { useGetCartItemsQuery } from './store/apis/cartApis'
import { setCartItems } from './store/slices/cartSlice'
import PurchaseSucces from './pages/purchase/PurchaseSucces'
import QuizDetails from './pages/quiz/QuizDetails'
import QuizSubmission from './pages/quiz/QuizSubmission'
import QuizResult from './pages/quiz/QuizResult'

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import StudentGrades from './pages/grades/StudentGrades'




function App() {

  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const socket = useSocket()

  useEffect(() => {

    if (socket) {

      socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
      });
  
      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });
  
      return () => {
        socket.off("connect");
        socket.off("disconnect");
      }

    }

  }, [socket])
  


  useEffect(() => {
    
    if(user){
      socket.emit("addUser" , user?.user?._id)
    }
    
    return () => {
      socket.disconnect() 
    }
  
  }, [user])


  const {data : cartItems , isLoading : isLoadingCartItems , refetch : refetchCartItems} = useGetCartItemsQuery({ token : user?.token , page : 1 } , {skip : !user?.token})

  const [getUser , getUserResponse] = useGetUserMutation()
  
  
  useEffect(() => {
  
    if (user.token && user.user === null) {
      getUser({ token: user?.token })
      dispatch(setCartItems({cartItems : cartItems?.cartItems}))
    }
  
  }, [user?.token , user?.user])



  useEffect(() => {

    if (!getUserResponse.isLoading && !getUserResponse.isUninitialized) {

      if (getUserResponse.isError) {

        dispatch(setUser({ user : null , token: null }))

      } else {

        dispatch(setUser({ user : { ...getUserResponse.data } , token : user.token }))
        dispatch(setCartItems({cartItems : cartItems?.cartItems}))

      }

    }

  }, [getUserResponse])



  // if (getUserResponse.isLoading || isLoadingCartItems) {
  //   return <Spinner/> 
  // }

  useEffect(() => {
    window.scrollTo(0, 0) // Scrolls to the top of the page on mount
  }, [])




  return (

    <DndProvider backend={HTML5Backend}> 

      <SocketProvider socket={socket}>

        <Router>

          <Routes>

            <Route path='/login' element={user?.user ? <Navigate to="/dashboard"/> : <Login/>}/>
            <Route path='/register' element={user?.user ? <Navigate to="/dashboard"/> : <Register />} />

            <Route path="/" element={<ProtectedRoute> <Layout  /> </ProtectedRoute>}>    
              <Route path="dashboard" element={user?.user?.role === "instructor" ? <InstructorDashboard/> : <Dashboard />} />
              <Route path="my-learning" element={<MyLearning />} />
              <Route path="explore-courses" element={<ExploreCourses />} />
              <Route path="enrolled-courses" element={<EnrolledCourses />} />
              <Route path="courses/single-course/:courseId" element={<SingleCourse />} />
              <Route path="instructor/:instructorId" element={<InstructorProfile />} />
              <Route path="order-summary" element={<OrderSummary />} />
              <Route path="course/main-page/:courseId" element={<EnrolledCourse />} /> 
              <Route path="wishlist" element={<WishList />} /> 
              <Route path="bookmark" element={<BookMark />} /> 
              <Route path="certificate" element={<MyCertificates />} /> 
              <Route path="student-tickets" element={<SupportTickets />} /> 
              <Route path="view-assignment-details/:assignmentId/:courseId" element={<AssignmentDetails />} /> 
              <Route path="submit-assignment-submission/:assignmentId/:courseId" element={<SubmitAssignmentSubmission />} /> 
              <Route path="purchase-success" element={<PurchaseSucces />} />
              <Route path="quiz-details/:quizId" element={<QuizDetails />} />
              <Route path="quiz-submission/:quizId" element={<QuizSubmission />} />
              <Route path="quiz-result/:quizId" element={<QuizResult />} />
              <Route path="student-grades" element={<StudentGrades />} />
            </Route>


            <Route path="/instructor" element={<InstructorProtectedRoute> <Layout  /> </InstructorProtectedRoute>}>

              {/* todo */} 
              <Route path="dashboard" element={<InstructorDashboard />} /> 

              <Route path="create-course" element={<CreateCourse />} /> 
              <Route path="courses" element={<InstructorCourses />} /> 
              <Route path="course/structure/:courseId" element={<CourseStructure />} />

              <Route path="course/enrolled-students/:courseId" element={<CourseEnrolledStudnets />} />

              <Route path="course/enrolled-students-progress/:courseId" element={<CourseEnrolledStudnetsInsights />} /> 
              <Route path="course/student-quizzes-progress/:courseId/:quizId/:studentId" element={<CourseEnrolledStudnetQuizzesProgress />} /> 

              <Route path="quizzes" element={<Quizzes />} /> 
              <Route path="create-quiz" element={<CreateQuiz />} /> 
              <Route path="edit-quiz/:quizId" element={<EditQuiz />} /> 

              <Route path="assigments" element={<Assigments />} />  
              <Route path="course/assigments/:courseId" element={<CourseAssigments />} />  

              <Route path="assigment/:assigmentId/:courseId" element={<AssigmentSubmissions />} />  
              
              <Route path="assigment/:studentId/:courseId/student" element={<StudentAssigmentsSubmissions />} />  

              <Route path="create-assigment" element={<CreateAssigment />} />  

              <Route path="create-live-session" element={<CreateLiveSession />} />  

              <Route path="courses-tickets" element={<InstructorCoursesTickets />} />  
              <Route path="course-tickets/:courseId" element={<InstructorCourseTickets />} />  

              <Route path="grades" element={<Grades/>} />

              <Route path="course/feedbacks/:courseId" element={<CourseFeedbacks/>} />

              <Route path="profile" element={<Profile/>} />

            </Route>  

          </Routes>

          <ToastContainer/>
        
        </Router>

      </SocketProvider>

    </DndProvider>

  )
}

export default App
 