import React, { useRef, useState } from "react";

import loginImg from "../../assets/register-logo.png";
import logo from "../../assets/register-logo.png" 
import { useLoginUserMutation } from "../../store/apis/authApis";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/slices/userSlice";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";


const Login = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passState, setPassState] = useState(false)

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login , {isLoading , isError}] = useLoginUserMutation()
  
  const handlePassState = (e) => {
    if (e.target.classList.length) {
      if (!passState) {
        setPassState(true);
      } else {
        setPassState(false);
      } 
    }
  };


  
  const handleSubmit = async (e) => {

    e.preventDefault()

    try {
      const res = await login({email , password}).unwrap()
      dispatch(setUser({ user: res.user, token: res.token }))
      localStorage.setItem("token", JSON.stringify(res.token))
      res.user.role === "instructor" ? navigate("/instructor/dashboard") : navigate("/dashboard")
    } catch (error) {
      console.log(error)
    }

  }



  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full lg:w-3/4 flex flex-col items-center justify-between gap-24">
        <div className="text-center">
          <img src={logo} alt="Logo" className="mx-auto mb-8" />
          <h2 className="text-2xl font-bold mb-4">Welcome Back</h2>
          <p className="text-gray-600">
            welcome back! Please enter your details
          </p>
        </div>

        <form
          className="w-full sm:w-3/4 mx-20 text-start px-5 sm:px-0 lg:px-10 select-none"
          onSubmit={handleSubmit}
        >
          <div className="my-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="
                Email
                "
            >
              Email
            </label>
            <input
              type="email"
              className="block w-full px-2 py-2 mt-2 text-gray-700 bg-white border-2"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="my-6 relative">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="
              Email
              "
            >
              Password
            </label>
            <input
              type={passState ? "text" : "password"}
              className="block w-full px-2 py-2 mt-2 text-gray-700 bg-white border-2"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={handlePassState}
              className="absolute top-3/4 right-0 -translate-y-2/4 p-3 cursor-pointer"
            >
              {/* {passState ? (
                <FontAwesomeIcon
                  icon={faEyeSlash}
                  className="text-gray-400 hover:text-gray-500"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faEye}
                  className="text-gray-400 hover:text-gray-500"
                />
              )} */}
            </button>
          </div>
          <div className="text-right my-5">
            <a href="" className="text-link-dark hover:underline">
              Forget Password?
            </a>
          </div>
          <button className="w-full bg-primary-normal hover:bg-secondary-light-hover hover:text-primary-dark text-primary-text-light px-6 py-3 rounded">
            Login
          </button>
        </form>
        <p>
          Don't have an account?{" "}
          <a href="" className="text-link-dark hover:underline">
            Sign up
          </a>
        </p>
      </div>
      <div className="w-1/2 h-full  rounded-s-[5%] bg-primary-light hidden lg:flex">
        <img src={loginImg} alt="" className="max-w-full self-center" />
      </div>
    </div>
  );
};

export default Login;
