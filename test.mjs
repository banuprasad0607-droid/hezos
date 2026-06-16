const stats = null;
try {
  console.log(stats?.attendanceToday.total);
} catch (e) {
  console.log("Error 1:", e.message);
}
try {
  console.log(stats?.attendanceToday.present / stats.attendanceToday.total);
} catch (e) {
  console.log("Error 2:", e.message);
}
