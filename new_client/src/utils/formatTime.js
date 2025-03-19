export const formatTimeWithLabels = ({ hours, minutes, seconds }) => {
  let formattedTime = "";

  if (hours > 0) {
    formattedTime += `${hours} hr${hours > 1 ? 's' : ''} `;
  }

  if (minutes > 0) {
    formattedTime += `${minutes} min${minutes > 1 ? 's' : ''} `;
  }

  if (seconds > 0 || formattedTime === "") {
    formattedTime += `${seconds} sec${seconds > 1 ? 's' : ''}`;
  }

  return formattedTime.trim();
};
