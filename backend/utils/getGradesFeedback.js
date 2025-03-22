function getQuizComment(totalScore, maxPossibleScore, passStatus) {
  if (!passStatus) {
    return "Bad";
  } else if (totalScore === maxPossibleScore) {
    return "Very Good";
  } else if (totalScore >= maxPossibleScore - 2) {
    return "Very Good";
  } else {
    return "Good";
  }
}


function getAssignmentComment(marks , assignmentMark) {
  if (marks === 0) {
    return "Bad";
  } else if (marks === assignmentMark) {
    return "Very Good";
  } else if (marks >= assignmentMark - 2) {
    return "Very Good";
  } else {
    return "Good";
  }
}


module.exports = {getQuizComment , getAssignmentComment}