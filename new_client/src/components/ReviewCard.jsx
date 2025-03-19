import React from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import laithImg from "../assets/laith-img.png"
import { MdModeEditOutline } from "react-icons/md";


const review = {
  name: "Laith",
  rating: 4,
  time: "3 weeks ago",
  avatar: laithImg,
  review:
    "The Course is good, I've been using [platform/system name] for [duration], and my experience has been [positive/negative/mixed]. The interface is [describe UI – intuitive, user-friendly, cluttered, etc.], and the features are [helpful/confusing/missing key functions]. One thing I really like is [mention a feature or aspect you enjoy]. It makes [explain how it improves your experience]. However, I found that [mention any challenges or issues, if any], which can be improved by [suggest a fix or improvement]."
}


const StarRating = ({ rating }) => {
  return (
    <div className="flex text-yellow-400">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i}>{i < rating ? <FaStar /> : <FaRegStar />}</span>
      ))}
    </div>
  )
}



const ReviewCard = ({isOwned , setIsFeedbackReportModalOpen}) => {
  return (
    <div className="w-2xl  p-4  rounded-lg">

      <div className="flex items-center">

        <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full" />

        <div className="ml-3">

          <h4 className="font-semibold">{review.name}</h4>

          <div className="flex gap-2 items-center">
            <span>{review.rating}</span>
            <StarRating rating={review.rating} />
          </div>

        </div>

        <div className="ml-auto flex items-center gap-4 text-[#6555BC]">
            {isOwned && <MdModeEditOutline className="cursor-pointer" size={25}/>}
            <span className="ml-auto text-gray-500 text-sm">{review.time}</span>
        </div>

      </div>

      <p className="mt-2 text-gray-700">{review.review}</p>
      <button onClick={() => setIsFeedbackReportModalOpen(true)} className="text-[#403685] font-semibold underline mt-2">Report</button>

    </div>
  )
};

export default ReviewCard;
