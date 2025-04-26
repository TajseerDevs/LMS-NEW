import React from 'react';
import paymentIcon from "../assets/payment-svg.svg"
import YellowBtn from './YellowBtn';


const PaymentCard = ({ title , amountText , buttonText , nextPaymentText }) => {

  return (

    <div className="bg-[#F3F2FC] rounded-lg p-7 w-[480px] shadow-sm">

      <div className="flex gap-5">

        <img src={paymentIcon} alt="icon" className="w-14 bg-[#998BFA80] object-contain p-3 rounded-full h-14" />

        <div>

          <h3 className="text-[#002147] font-semibold text-lg">{title}</h3>
          <p className="text-[#929292] font-semibold text-lg mt-1">{amountText}</p>

          {buttonText && (
            <div className='mb-3 mt-3'>
              <YellowBtn text={buttonText}/>
            </div>
          )}

          {nextPaymentText && (
            <span className='mt-4'>{nextPaymentText}</span>
          )}

        </div>

      </div>

    </div>

  )

}


export default PaymentCard
