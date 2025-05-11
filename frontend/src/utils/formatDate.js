export const formatDate = (date) => {
  const formattedDate = new Date(date);
  const year = formattedDate.getFullYear();
  const month = (formattedDate.getMonth() + 1).toString().padStart(2, "0"); // Add leading zero if month is single-digit
  const day = formattedDate.getDate().toString().padStart(2, "0"); // Add leading zero if day is single-digit

  return `${year}-${month}-${day}`;
};
