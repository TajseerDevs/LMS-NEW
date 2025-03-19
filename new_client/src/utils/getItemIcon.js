import { FaPlayCircle, FaFileAlt, FaImage, FaTasks } from "react-icons/fa"


const getItemIcon = (type) => {
    switch (type) {
      case "Video":
        return <FaPlayCircle className="text-orange-300" size={20} />;
      case "Document":
        return <FaFileAlt className="text-blue-500" size={20} />;
      case "Image":
        return <FaImage className="text-green-500" size={20} />;
      case "Activity":
        return <FaTasks className="text-purple-500" size={20} />;
      default:
        return null;
    }
  }


export default getItemIcon
