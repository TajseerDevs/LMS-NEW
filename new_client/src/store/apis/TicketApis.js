import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const ticketsApi = createApi({
    reducerPath: "ticketApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://10.10.30.40:5500/api/v1/tickets" }),
    endpoints: (builder) => ({
        getAllUserTickets: builder.query({
            query: ({token , page}) => ({
                url: `/?page=${page}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` }
            })
        }),
        addNewTicket: builder.mutation({
            query: ({ token , regarding, subject, details, info , priority , courseId}) => {
                return {
                    url: '/new-ticket',
                    method: 'POST',
                    body: {regarding, subject, details, info , priority , courseId},
                    headers: { Authorization: `Bearer ${token}` }
                }
            }
        }),
        deleteTicket: builder.mutation({
            query: ({token ,ticketId }) => ({
                url: `/delete-ticket/${ticketId}`,
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            }),
        }),
        updateTicket: builder.mutation({
            query: ({token ,ticketId , subject , details}) => ({
                url: `/update/${ticketId}`,
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` } ,
                body : {subject , details}
            }),
        }),
    })
})




const {
    useGetAllUserTicketsQuery,
    useAddNewTicketMutation,
    useDeleteTicketMutation,
    useUpdateTicketMutation
} = ticketsApi



export {
    useGetAllUserTicketsQuery,
    useAddNewTicketMutation,
    useDeleteTicketMutation,
    useUpdateTicketMutation ,
    ticketsApi
} 