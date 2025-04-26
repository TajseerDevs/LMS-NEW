import React from 'react'
import PaymentCard from '../../components/PaymentCard'



const payments = [
    {
      title: "Total Outstanding Balance",
      amount: "$ 500 Due",
      button: "Pay Now"
    },
    {
      title: "Next Payment Due",
      date: "March 15,2025",
      amount: "$ 200"
    },
    {
      title: "Last Payment Made",
      date: "$ 300 on February 10, 2025",
      button: "View Receipt"
    }
  ]
  
  
  const courses = [
    {
      title: "Biology Course",
      image: "/biology.png",
      student: "Sarah Allen",
      amount: "$ 500",
      status: "Paid",
      dueDate: "March 15,2025",
      method: "VISA",
      action: "View receipt"
    },
    {
      title: "Chemistry Course",
      image: "/chemistry.png",
      student: "Michael Johnson",
      amount: "$ 600",
      status: "Pending",
      dueDate: "April 10,2025",
      method: "MasterCard",
      action: "Pay Now"
    }
  ]



const PaymentAndFees = () => {

  return (

    <div className='p-10'>

        <h2 className="text-4xl font-semibold mb-2 capitalize p-8 text-[#002147]">Payments & Fees</h2>

        <h3 className="text-2xl font-semibold mb-4 capitalize p-6 text-[#002147]">My payments & fees Overview</h3>

        <div className='flex gap-24 p-6'>
            <PaymentCard amountText="$ 500 Due" buttonText="Pay Now" title="Total Outstanding Balance" />
            <PaymentCard amountText="$ 500 Due" buttonText="Pay Now" title="Total Outstanding Balance" />
            <PaymentCard amountText="$ 500 Due" buttonText="Pay Now" title="Total Outstanding Balance" />
        </div>

        <div>

          <h3 className="text-3xl font-semibold mb-4 capitalize p-6 text-[#002147]">Child Learning Fee</h3>
            
        </div>

    </div>

  )

}


export default PaymentAndFees