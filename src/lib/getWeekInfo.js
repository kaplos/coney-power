

 const startOfWeek = new Date();
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday

  // const endOfWeek = new Date(startOfWeek);
  // endOfWeek.setDate(startOfWeek.getDate() + 7); // next Sunday

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6)

  export { startOfWeek, endOfWeek };