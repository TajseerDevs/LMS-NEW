import { format } from 'date-fns';



export const formatLastLogin = (lastLoginDate) => {
    
  const parsedDate = Date.parse(lastLoginDate);
  
  if (isNaN(parsedDate)) {
    return "Invalid date"
  }

  const formattedDate = format(new Date(parsedDate), 'MMMM dd , yyyy | h:mm a');
  return `Last Login ${formattedDate}`

}
