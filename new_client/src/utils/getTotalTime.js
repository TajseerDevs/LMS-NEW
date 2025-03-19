const getTotalTime = (items) => {

    let totalHours = 0, totalMinutes = 0, totalSeconds = 0

    items.forEach(item => {
        totalHours += item?.estimatedTime?.hours || 0
        totalMinutes += item?.estimatedTime?.minutes || 0
        totalSeconds += item?.estimatedTime?.seconds || 0
    })

    // Convert excess seconds into minutes
    totalMinutes += Math.floor(totalSeconds / 60)
    totalSeconds = totalSeconds % 60;

    // Convert excess minutes into hours
    totalHours += Math.floor(totalMinutes / 60)
    totalMinutes = totalMinutes % 60

    return { hours: totalHours , minutes: totalMinutes, seconds: totalSeconds }

}


export default getTotalTime