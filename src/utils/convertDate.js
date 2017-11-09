const convertDate = dateString => {
  return new Date(dateString).toUTCString().split(', ')[1];
}

export default convertDate;
