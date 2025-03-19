export const daysUntilDueDate = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    
    const diffInMs = due - now;
    
    return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
}
  