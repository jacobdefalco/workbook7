// Index Scripts
const coursesTbody = document.querySelector("#courses-tbody");

window.onload = function fetchCourses() {
  fetch("http://localhost:8081/api/courses")
    .then((response) => response.json())
    .then((jsoned) => displayCoursesInTable(jsoned));
};

function displayCoursesInTable(courses) {
  for (let i = 0; i < courses.length; i++) {
    let row = coursesTbody.insertRow(-1);

    let cell1 = row.insertCell(0);
    cell1.innerText = courses[i].dept;

    let cell2 = row.insertCell(1);
    cell2.innerText = courses[i].courseNum;

    let cell3 = row.insertCell(2);
    let anchor = document.createElement("a");
    anchor.href = `details.html?courseid=${courses[i].id}`;
    anchor.innerText = courses[i].courseName;
    cell3.appendChild(anchor);
  }
}
//Details Scripts
const courseNameTitle = document.querySelector("#course-name-h1");
const courseDetailsTbody = document.querySelector("#course-details-tbody");

function loadCourseDetails(course) {
  let row = courseDetailsTbody.insertRow(-1);

  let cell1 = row.insertCell(0);
  cell1.innerText = course.id;
  let cell2 = row.insertCell(1);
  cell2.innerText = course.dept;
  let cell3 = row.insertCell(2);
  cell3.innerText = course.courseNum;
  let cell4 = row.insertCell(3);
  cell4.innerText = course.instructor;
  let cell5 = row.insertCell(4);
  cell5.innerText = course.startDate;
  let cell6 = row.insertCell(5);
  cell6.innerText = course.numDays;
  courseNameTitle.innerText = course.courseName;
}

function fetchCourseDetails(id) {
  fetch(`http://localhost:8081/api/courses/${id}`)
    .then((response) => response.json())
    .then((jsoned) => loadCourseDetails(jsoned));
}

window.addEventListener("load", (event) => {
  const urlParams = new URLSearchParams(location.search);

  let id = -1;
  if (urlParams.has("courseid") === true) {
    id = urlParams.get("courseid");

    fetchCourseDetails(id);
  }
});
