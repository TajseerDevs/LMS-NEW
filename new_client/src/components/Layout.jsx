import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'


const Layout = () => {

  const [openSideBar, setopenSideBar] = useState(false)

  return (
    <div className="flex w-full min-h-screen">

      <Sidebar openSideBar={openSideBar} setopenSideBar={setopenSideBar} />

        <div className={`flex-1 flex flex-col transition-all duration-300 max-w-full`}>

          <Header openSideBar={openSideBar} setopenSideBar={setopenSideBar} />

          <main className={`flex-1 p-5 overflow-x-hidden overflow-y-auto bg-[#FAFAFF] ${openSideBar ? "ml-20" : "lg:ml-64"}`}>
            <Outlet context={{ openSideBar , setopenSideBar }} />
          </main>

        </div>

    </div>

  )

}


export default Layout
