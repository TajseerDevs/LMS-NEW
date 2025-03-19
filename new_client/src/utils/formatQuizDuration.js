export const formatQuizDuration = (duration) => {
    const { value, unit } = duration;
  
    if (unit === "minutes") {
      if (value <= 60) {
        return `${value} minutes`;
      } else {
        const hours = (value / 60).toFixed(0)
        return `${hours} hours`;
      }
    }
    return `${value} ${unit}`;
  };