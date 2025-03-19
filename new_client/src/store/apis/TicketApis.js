import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const ticketsApi = createApi({
    reducerPath: "ticketApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5500/api/v1/tickets" }),
    endpoints: (builder) => ({
        getAllUserTickets: builder.query({
            query: ({token , page}) => ({
                url: `/?page=${page}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` }
            })
        }),
        addNewTicket: builder.mutation({
            query: ({ token , regarding, subject, details, info , courseId}) => {
                return {
                    url: '/new-ticket',
                    method: 'POST',
                    body: {regarding, subject, details, info , courseId},
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
    })
})



const {
    useGetAllUserTicketsQuery,
    useAddNewTicketMutation,
    useDeleteTicketMutation,
} = ticketsApi


export {
    useGetAllUserTicketsQuery,
    useAddNewTicketMutation,
    useDeleteTicketMutation,
    ticketsApi
} 