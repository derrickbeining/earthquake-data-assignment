const convertDate = dateString => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dt = new Date(dateString);

  return `${months[dt.getMonth()]} ${dt.getDate()}, ${dt.getFullYear()} @ ${dt.getHours()}:${dt.getMinutes()}`
}

export default convertDate;
