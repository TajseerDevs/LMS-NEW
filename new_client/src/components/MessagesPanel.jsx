import React, { useEffect, useRef, useState } from "react"
import testImage from "../assets/test.png"
import editIcon from "../assets/edit-icon.png"
import { FaFile, FaPaperclip, FaPaperPlane, FaSearch } from "react-icons/fa"
import { FaMicrophoneLines } from "react-icons/fa6"
import { useSendMessageMutation , useGetAllMessagesQuery, useGetAllPrevMessagesQuery } from "../store/apis/messageApis"
import { useSelector } from "react-redux"
import { useGetAllUsersQuery } from "../store/apis/authApis"
import { useCreateConversationMutation, useGetUserConversationsQuery } from "../store/apis/conversationApis"
import { useSocketContext } from '../context/SocketContext';
import { FiFile } from "react-icons/fi"



const MessagesPanel = () => {

  const baseUrl = `http://localhost:5500`
  
  const {token , user} = useSelector((state) => state.user)
  const socket = useSocketContext()

  const [page, setPage] = useState(1)
  const [selectedChat , setSelectedChat] = useState(null) // as the current chat
  const [firstMessage , setFirstMessage] = useState(null)

  const {data : userConversations , refetch : refetchUserConversations} = useGetUserConversationsQuery({token})
  const {data : allUsers , isLoading : isLoadingGetUsers} = useGetAllUsersQuery({token , page})
  const { data: userMessages , isLoading, isError , refetch : refetchUserMessages } = useGetAllMessagesQuery({ token , conversationId : selectedChat?._id} , {skip: !selectedChat })
  
  const { data: userPrevMessages , refetch : refetchUserPrevMessages } = useGetAllPrevMessagesQuery({ token , conversationId : selectedChat?._id , messageId : firstMessage?._id} , {skip: !selectedChat })

  const [sendMessage , {isError : isErrorSendMessage , isLoading : isLoadingSendMessage}] = useSendMessageMutation()
  const [createConversation , {isError : isErrorCreateConversation , isLoading : isLoadingCreateConversation}] = useCreateConversationMutation()


  useEffect(() => {

    if (socket) {

      socket.on("startConversation", ({ conversationId , senderId }) => {
        refetchUserConversations()
      })
  
      return () => {
        socket.off("startConversation")
      }

    }

  }, [socket , refetchUserConversations])



  // ! TODO add case to update the last message , delete message , update message , send file message , make the messages pagination in the scroll
  useEffect(() => {

    if (socket) {

      socket.on("getMessage" , (message) => {

        console.log(message)
  
        setMessages((prevMessages) => [
          ...prevMessages ,
          message ,
        ])

        if(selectedChat){
          refetchUserMessages()
          messageEndRef.current.scrollIntoView({ behavior: "smooth" })
        }

        refetchUserConversations()

      })
  
      return () => {
        socket.off("getMessage")
      }

    }

  }, [socket , refetchUserMessages])



  const [isExpanded, setIsExpanded] = useState(false)
  const [conversations , setConversations] = useState([])
  const [messages , setMessages] = useState([])

  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([]); 
  const [hasMore, setHasMore] = useState(true) 
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("")
  const [columnType, setColumnType] = useState("messages")
  const [file , setFile] = useState(null)
  const [selectedFileHint, setSelectedFileHint] = useState(null);
  const [loadingOlderMessages, setLoadingOlderMessages] = useState(false)
  

  const messageEndRef = useRef(null)
  const messageContainerRef = useRef(null)
  const fileInputref = useRef(null)


  useEffect(() => {

    if (userConversations) {
      setConversations(userConversations)
    }

  } , [userConversations , refetchUserConversations , socket , selectedChat])



  useEffect(() => {

    if (userMessages) {
      setMessages(userMessages?.messages || [])
    }

  } , [userMessages])


  useEffect(() => {

    if (messages?.length > 0) {
      setFirstMessage(messages[0])
    }

  }, [messages])



  useEffect(() => {

    if (allUsers?.users?.length) {

      setUsers((prev) => {
        const existingIds = new Set(prev.map((user) => user._id))
        const uniqueUsers = allUsers.users.filter((user) => !existingIds.has(user._id))
        return [...prev , ...uniqueUsers]
      })

      setHasMore(allUsers.page < allUsers.totalPages)

    }

  }, [allUsers])



  const handleScroll = (e) => {

    const { scrollTop, scrollHeight, clientHeight } = e.target

    if (scrollHeight - scrollTop === clientHeight && hasMore && !isLoadingGetUsers) {
      setPage((prev) => prev + 1)
    }

  }


  useEffect(() => {
    const filtered = users.filter((user) => `${user?.firstName} ${user?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredUsers(filtered)
  }, [searchTerm, users])


  // find a way to handle the auto scroll on the initial only , then make on sending messages
  // useEffect(() => {
  //   if (messageEndRef.current) {
  //    messageEndRef.current.scrollIntoView({ behavior: "smooth" })
  //   }
  // }, [messages])



  useEffect(() => {

    if (selectedFileHint) {
      messageEndRef.current?.scrollIntoView({ behavior : "smooth" })
    }

  }, [selectedFileHint])



  const handlePaperclipClick = () => {
    fileInputref.current.click()
  }



  const handleFileChange = (event) => {

    const selectedFile = event.target.files[0]
    setSelectedFileHint(selectedFile)
    
    if (selectedFile) {
      setFile(selectedFile)
    }

  }



  const handleSendMessage = async (e) => {

    e.preventDefault()

    if(!selectedChat){
      return alert("you can't send an message without select a chat")
    }
    
    if(!message.trim() && !file){
      return alert("you can't send an empty message")
    }
    
    const formData = new FormData()
    
    formData.append("sender" , user?._id)
    formData.append("text" , message.trim())
    formData.append("conversationId" , selectedChat?._id)
    
    if (file) {
      formData.append("file" , file)
    }

    try {

      const response = await sendMessage({messageData : formData , token}).unwrap()

      const otherPerson = !selectedChat?.isGroup ? selectedChat?.members?.filter((member) => member?._id !== user?._id)[0] : null

      socket.emit("sendMessage" , {
        senderId : user?._id ,
        receiverId : otherPerson?._id ,
        text : response.text ,
        file : response.file ,
        convId : response.conversationId ,
        _id: response._id,
        createdAt: response.createdAt,
        senderAvatar: user?.profilePic ? `${baseUrl}${user?.profilePic}` : null ,
      })

      await refetchUserConversations()
      await refetchUserMessages()

      messageEndRef?.current?.scrollIntoView({ behavior: "smooth" })

      setMessage("")
      setFile(null)
      setSelectedFileHint(null)

    } catch (error) {
      console.log(error)
    }
 

  }
  


  const createChatWithUser = async (e ,  singleUser) => {

    e.preventDefault()

    try {

      const conversationAlreadyExist = conversations?.find((conversation) => {
        const userInConversation = conversation?.members?.some((member) => member._id === user?._id)
        const singleUserInConversation = conversation?.members?.some((member) => member._id === singleUser?._id)
        return userInConversation && singleUserInConversation && !conversation?.isGroup
      })

      if(conversationAlreadyExist){
        return setSelectedChat(conversationAlreadyExist)
      }

      const conversationData = {
        senderId : user?._id ,
        receiverId : singleUser?._id ,
      }

      const response = await createConversation({conversationData , token}).unwrap()

      setSelectedChat(response)

      await refetchUserConversations()
      
      socket?.emit("startConversation" , {
        senderId : user?._id ,
        receiverId : singleUser?._id ,
        conversationId : response?._id ,
      })
      
    } catch (error) {
      console.log(error)
    }

  }


  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return `${date.toLocaleDateString()} | ${date.toLocaleTimeString()}`
  }


  const [hasScrolled, setHasScrolled] = useState(false)
  const [prevScrollTop, setPrevScrollTop] = useState(0);
  
  console.log(firstMessage)
  console.log(messages)




  const loadMoreMessages = async () => {

    if (!firstMessage) return;
    
    setLoadingOlderMessages(true)

    try {

      const { data } = await refetchUserPrevMessages({
        token,
        conversationId: selectedChat?._id,
        messageId: firstMessage?._id, 
      })
  
      setMessages([...data?.messages])  

    } catch (error) {
      console.error("Error loading more messages", error);
    }finally{
      setLoadingOlderMessages(false)
    }

  }



const handleScrollMessages = () => {

  const container = messageContainerRef.current

  if (container) {

    if (!hasScrolled) {

      if (container.scrollTop > 50) {
        setHasScrolled(true)
      }

      return

    }

    if (container.scrollTop <= 40 && !isLoading) {
      loadMoreMessages()
    }

  }

}


  useEffect(() => {

    const container = messageContainerRef.current
  
    if (container) {
      container.addEventListener("scroll" , handleScrollMessages)
    }
  
    return () => {
    
      const container = messageContainerRef.current
    
      if (container) {
        container.removeEventListener("scroll" , handleScrollMessages)
      }

    }

  }, [isLoading, hasScrolled])





  return (
    <div className="flex space-x-4 p-4">

      <div className={`fixed bottom-0 right-10 w-[480px] bg-white border border-gray-300 shadow-lg rounded-t-lg transition-all duration-300 ${ isExpanded ? "min-h-[50%] max-h-[80vh]" : "h-16"}`}>

        <div onClick={() => setIsExpanded(!isExpanded)} className="p-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center cursor-pointer">

          <div className="flex items-center">

            <img src={testImage} className="w-10 h-10 rounded-full mr-3" alt="User" />
            <h3 className="text-lg font-semibold">Messaging</h3>

          </div>

          <div className="flex items-center gap-5">

            <button onClick={(e) => {e.stopPropagation() ; setColumnType("contacts") ; setSelectedChat(null)}} className="text-gray-600 hover:text-black">
              <img src={editIcon} alt="Edit" />
            </button>

            <button className="text-gray-600 hover:text-black">
              {isExpanded ? <span>&#x25BC;</span> : <span>&#x25B2;</span>}
            </button>

          </div>
          
        </div>

        {isExpanded && (

          <div className="flex-1 overflow-y-auto p-4">

            <div className="relative mb-4">

              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500">
                <FaSearch size={20} />
              </div>

              <input
                type="text"
                placeholder="Search or start a new chat"
                className="w-full pl-10 pr-4 py-4 border text-[18px] bg-[#F8F9FD] border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 placeholder:text-[18px]"
              />

            </div>

            <div className="flex-1 overflow-y-auto p-2 pt-2 max-h-[800px]">

            {conversations?.length > 0 ? (

              conversations.map((conversation) => {

                const isGroup = conversation?.isGroup
                const otherPerson = !isGroup ? conversation?.members?.filter((member) => member?._id !== user?._id)[0] : null

                return (

                  <div
                    key={conversation?._id}
                    className={`flex items-start p-4 mb-3 rounded-lg cursor-pointer ${selectedChat?._id !== conversation?._id && "hover:bg-gray-100"} ${selectedChat?._id === conversation?._id ? "bg-gray-300" : "bg-white"}`}
                    onClick={() => {setSelectedChat(conversation) ; setColumnType("messages") ; setFirstMessage(null)}}
                  >
                    {!isGroup ? (

                      <>

                      <img
                        src={otherPerson?.profilePic ? `${baseUrl}${otherPerson?.profilePic}` : testImage}
                        alt={otherPerson?.firstName}
                        className="w-12 h-12 rounded-full mr-4 mt-2"
                      />

                      <div className="flex-1">

                        <h4 className="text-[18px] ml-2 font-bold">
                          {otherPerson?.firstName} {otherPerson?.lastName}
                        </h4>

                        <div className="flex items-center justify-start">

                          <p className="text-[16px] ml-2 text-gray-600 flex-1">
                            {conversation?.lastMessage ? conversation?.lastMessage?.text ? conversation?.lastMessage?.text : "File message" : "No messages..."}
                          </p>
                          
                          {conversation?.lastMessage && conversation?.lastMessage?.createdAt && (
                            <span className="text-[16px] mt-1 text-gray-400">
                              | {new Date(conversation?.lastMessage?.createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                            </span>
                          )}

                        </div>

                      </div>

                      </>

                    ) : (
                      <>
                        <div className="w-12 h-12 flex justify-center items-center rounded-full bg-gray-200 mr-4 mt-2">

                          <span className="text-[20px] font-bold text-gray-500">
                            {conversation?.group?.name?.[0]?.toUpperCase() || "G"}
                          </span>

                        </div>

                        <div className="flex-1">

                          <h4 className="text-[18px] ml-2 font-bold">
                            {conversation?.group?.name || "Unnamed Group"}
                          </h4>

                          <p className="text-[16px] ml-2 text-gray-600">
                            {conversation?.lastMessage ? conversation?.lastMessage?.text : "No messages..."}
                          </p>

                          <div className="flex flex-wrap mt-1">
                          
                            {conversation?.members?.slice(0, 3).map((member) => (
                          
                              <span key={member?._id} className="text-[14px] text-gray-500 mr-2">
                                {member?.firstName} {member?.lastName}
                              </span>

                            ))}

                            {conversation?.members?.length > 3 && (
                              <span className="text-[14px] text-gray-500">
                                +{conversation.members.length - 3} more
                              </span>
                            )}

                          </div>

                        </div>

                      </>

                    )}

                  </div>
                );
              })
            ) : (
              <div className="text-center text-gray-500 text-[16px] py-6">
                No Conversations found. Try adjusting your search <br /> or start a new conversation.
              </div>
            )}

            </div>

          </div>

        )}

      </div>

      {selectedChat && columnType === "messages" && (

        <div className="w-[480px] fixed bottom-0 right-[525px] bg-[#F8F9FD] border border-gray-300 shadow-lg rounded-lg">

        <div className="p-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">

          <div className="flex items-center">

            {selectedChat?.isGroup ? (

              <div className="flex items-center">
                <img src={selectedChat.avatar} className="w-10 h-10 rounded-full mr-4" alt="Group" />
                <h3 className="text-[22px] font-semibold">{selectedChat.name}</h3>
              </div>

            ) : (
              (() => {

                const otherPerson = selectedChat?.members?.filter((member) => member?._id !== user?._id)[0]

                return (
                  <div className="flex items-center">
                    <img src={otherPerson?.profilePic ? `${baseUrl}${otherPerson?.profilePic}`: testImage} className="w-10 h-10 rounded-full mr-4" alt="User" />
                    <h3 className="text-[18px] font-semibold">{otherPerson?.firstName} {otherPerson?.lastName}</h3>
                  </div>
                )

              })()

            )}

          </div>  

          <div className="flex items-center gap-6 mt-1 px-1">

            <button onClick={() => { setSelectedChat(null) ; setColumnType("contacts"); }} className="text-gray-600 hover:text-black">
              <FaSearch size={20} />
            </button>

            <button onClick={() => {setSelectedChat(null) ; setFirstMessage(null) }} className="text-gray-600 hover:text-black">
              <span className="text-[22px]">&#x2715;</span>
            </button>
            
          </div>

        </div>

          <div ref={messageContainerRef} className="flex-1 bg-[#F8F9FD] max-h-[500px] overflow-y-auto p-3">

          {loadingOlderMessages && (
            <div className="flex justify-center items-center py-4">
              <div className="spinner-border animate-spin border-4 border-t-4 border-yellow-300-200 rounded-full w-14 h-14"></div>
            </div>
          )}

          {isLoading ? (

            <div className="flex justify-center items-center py-10">
              <div className="spinner-border animate-spin border-4 border-t-4 border-yellow-300-200 rounded-full w-14 h-14"></div>
              {/* <div className="text-[16px] w-14 h-14">Loading messages ...</div> */}
            </div>
            ) : (
            messages && messages?.length > 0 ? (

              messages?.map((message) => (

                <div key={message?._id}>

                  <div className={`flex ${message?.sender?._id === user?._id ? "justify-end" : "justify-start"} px-3 py-2`}>
                    
                    <div className="flex-col items-center">

                      {message?.file?.filePath ? (

                        <div className={`flex items-center gap-2 max-w-xs p-3 ${message?.sender?._id === user?._id ? "bg-[#FFC200] text-white rounded-[32px_32px_0px_32px]": "bg-[#403685] text-white rounded-[32px_32px_32px_0px]"}`}
                        >
                          <FiFile size={20} />

                            <a
                              href={message.filePath}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[16px] text-white underline break-words"
                            >
                              {message?.file?.originalName || "Unnamed File"}
                            </a>

                        </div>

                      ) : (
                        <div className={`max-w-xs p-1 ${message?.sender?._id === user?._id ? "bg-[#FFC200] text-white rounded-[32px_32px_0px_32px]" : "bg-[#403685] text-white rounded-[32px_32px_32px_0px]"}`}>
                          <p className="text-[16px] p-3">{message?.text}</p>

                        </div>
                      )}

                      <div
                        className={`${
                          message?.sender?._id === user?._id ? "text-right" : "text-left"
                        }`}
                      >
                        <span className="text-[12px] text-gray-400">

                          {new Date(message?.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}

                        </span>

                      </div>

                    </div>

                  </div>

                </div>
                ))
              ) : (
                <div className="text-center text-gray-600">No messages yet...</div>
              )
            )}

            {selectedFileHint && (

              <div className="flex items-center justify-between bg-gray-100 border border-gray-300 rounded-lg py-2 px-4 shadow-sm">

                <div className="flex items-center space-x-2">

                  <FaFile size={20} className="text-yellow-500" />

                  <span className="text-gray-800 font-medium text-sm truncate">
                    {selectedFileHint.name}
                  </span>

                </div>

                <button
                  onClick={() => setSelectedFileHint(null)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium transition"
                >
                  Clear
                </button>

              </div>

            )}

            <div ref={messageEndRef} />

          </div>

          <div className="p-4 border-t border-gray-300 bg-gray-100 flex gap-2 items-center">

            <div className="relative p-3 px-1 w-full flex flex-col space-y-3">
              
              <div className="flex items-center space-x-2">

                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here"
                  className="w-full max-w-md py-3 px-5 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none pr-12"
                />

                <button onClick={handlePaperclipClick} className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-black">
                  <FaPaperclip size={20} />
                </button>

              </div>

              <input
                type="file"
                ref={fileInputref}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              
            </div>

            <div className="flex items-center gap-4 mr-5">

              <button className="text-gray-600 hover:text-black">
                <FaMicrophoneLines size={24} />
              </button>

              <button onClick={(e) => handleSendMessage(e)}  className="text-gray-600 hover:text-black">
                <FaPaperPlane size={24} />
              </button>

            </div>

          </div>

        </div>

      )}


      {!selectedChat && columnType === "contacts" && (

        <div className="w-[480px] fixed bottom-0 right-[525px] bg-[#F8F9FD] border border-gray-300 shadow-lg rounded-lg">
            
            <div className="p-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">

                <div className="flex-1 relative">

                    <input
                      type="text"
                      placeholder="Search contacts..."
                      className="w-[350px] py-2 px-4 rounded-[12px] border border-gray-300 pr-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600" />

                </div>

                <button onClick={() => setColumnType("messages")} className="text-gray-600 hover:text-black">
                  <span className="text-[22px]">&#x2715;</span>
                </button>

            </div>

            <div
              onScroll={handleScroll}
              className="flex-1 bg-[#F8F9FD] overflow-y-auto p-3"
              style={{ maxHeight: hasMore ? "500px" : "auto" }}
            >
              {filteredUsers?.length > 0 ? (

                filteredUsers.map((user) => (

                  <div
                    key={user?._id}
                    onClick={(e) => {createChatWithUser(e , user) ; setColumnType("messages")}} // here add the function that create new chat or open it if it was already exist 
                    className={`flex items-center gap-4 px-3 py-3 hover:bg-gray-200 cursor-pointer rounded-lg`}
                  >

                    <img
                      src={user?.profilePic ? `${baseUrl}${user?.profilePic}` : testImage}
                      alt={user?.firstName}
                      className="w-10 h-10 rounded-full"
                    />

                    <div className="flex-1">

                      <h4 className="text-[16px] font-semibold text-gray-700">
                        {user?.firstName} {user?.lastName}
                      </h4>

                    </div>

                  </div>

                ))

              ) : (
                <div className="text-center text-gray-500 text-sm py-6">
                  No users found. Try adjusting your search or filters.
                </div>
              )}

            </div>

            <div className="p-4 border-t border-gray-300 bg-gray-100 flex gap-2 items-center">

            <p className="text-[18px] text-gray-400">Select a contact to start a conversation</p>

            </div>

        </div>

      )}

    </div>

  )

}


export default MessagesPanel
