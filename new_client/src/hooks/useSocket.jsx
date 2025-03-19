import { useSelector } from "react-redux";
import { io } from "socket.io-client";


const useSocket = () => {

  const user = useSelector((state) => state.user)

  const socket = io("http://localhost:5000", {
    extraHeaders: {
      Authorization: `Bearer ${user?.token}`,
    },
  })

  return socket

}

export default useSocket
