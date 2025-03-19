import { createContext, useContext } from 'react'


const SocketContext = createContext()


export const useSocketContext = () => {
  return useContext(SocketContext)
}


export const SocketProvider = ({ children, socket }) => {
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}
