import React, { useState } from "react"
import MessagesPanel from "./MessagesPanel"



const MessagingWidget = () => {

  const [isOpen, setIsOpen] = useState(false)

  const togglePanel = () => setIsOpen(!isOpen)

  return (
    <>
      <div
        className={`fixed bottom-0 right-0 w-80 h-[70%] bg-white border border-gray-300 shadow-lg rounded-t-lg transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="p-4 border-b border-gray-300 flex justify-between items-center">

          <div className="flex items-center gap-3">

            <img
              src="https://via.placeholder.com/40"
              alt="User Avatar"
              className="w-8 h-8 rounded-full"
            />

            <h3 className="text-lg font-semibold">Messaging</h3>

          </div>

          <button
            className="text-gray-600 hover:text-black"
            onClick={togglePanel}
          >
            <span>&#x25B2;</span>

          </button>

        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-gray-500">Your recent conversations will appear here.</p>
        </div>

      </div>

      <div
        className="fixed bottom-4 right-4 flex items-center gap-2 bg-white border border-gray-300 shadow-lg rounded-full px-4 py-2 cursor-pointer hover:bg-gray-100"
        onClick={togglePanel}
      >

        <img
          src="https://via.placeholder.com/40"
          alt="User Avatar"
          className="w-8 h-8 rounded-full"
        />

        <span className="font-medium">Messaging</span>

        <button className="text-gray-600 hover:text-black">
          {isOpen ? <span>&#x25B2;</span> : <span>&#x25BC;</span>}
        </button>

      </div>

    </>
  )
}

export default MessagingWidget
