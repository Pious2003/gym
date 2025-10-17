export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function isTodayValidForCourse(courseData: {
  courseStartDate: string;
  courseEndDate: string;
  dayOfWeek: string;
}): boolean {
  
  const today = new Date();
  const dayOfWeek = today.getDay();

  const courseStart = new Date(courseData.courseStartDate);
  const courseEnd = new Date(courseData.courseEndDate);
  return today >= courseStart && today <= courseEnd && DAY_OF_WEEK[dayOfWeek as keyof typeof DAY_OF_WEEK] === courseData.dayOfWeek;
}

interface CourseData {
  courseStartDate: string;
  courseEndDate: string;
  schedules: { dayOfWeek: string; startTime: string; endTime: string }[];
  currentDate: Date;
}


export function isWithinCurrentWeek(date: Date): boolean {
  const today = new Date();
  const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  const lastDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));

  return date >= firstDayOfWeek && date <= lastDayOfWeek;
}

export const DAY_OF_WEEK = {
  0: "Chủ nhật",
  1: "Thứ 2",
  2: "Thứ 3",
  3: "Thứ 4",
  4: "Thứ 5",
  5: "Thứ 6",
  6: "Thứ 7",
}

export function isWorkoutDay(courses: CourseData[]): boolean {
  return courses.some((course) => {
    const isTodayValid = isTodayValidForCourse(course);
    if (!isTodayValid) return false;

  });
}
