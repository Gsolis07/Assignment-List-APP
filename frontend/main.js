let titleInput = document.getElementById('title');
let descInput = document.getElementById('desc');
let courseInput = document.getElementById('course');
let dueDateInput = document.getElementById("dueDate")

let assignmentId = document.getElementById('assignment-id');

let titleEditInput = document.getElementById('title-edit');
let descEditInput = document.getElementById('desc-edit');
let courseEditInput = document.getElementById('course-edit');
let dueDateEditInput = document.getElementById('dueDate-edit')

let assignments = document.getElementById('assignments');
let data = [];
let selectedAssignment = {};

const api = 'http://localhost:8000';

function tryAdd() {
    let msg = document.getElementById('msg');
    msg.innerHTML = '';
}

document.getElementById('form-add').addEventListener('submit', (e) => {
    e.preventDefault();
  
    if (!titleInput.value) {
        document.getElementById('msg').innerHTML = 'Assignment cannot be blank';
    } else {
      addAssignment(titleInput.value, courseInput.value, descInput.value, dueDateInput.value);
  
      // close modal
      let add = document.getElementById('add');
      add.setAttribute('data-bs-dismiss', 'modal');
      add.click();
      (() => {
        add.setAttribute('data-bs-dismiss', '');
      })();
    }
});

let addAssignment = (title, course, description, dueDate) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 201) {
        const newAssignment = JSON.parse(xhr.responseText);
        data.push(newAssignment);
        refreshAssignments();
      }
    };
    xhr.open('POST', `${api}/assignments`, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify({ title, course, description, dueDate }));
};

let refreshAssignments = () => {
  // Clear the content of each accordion body
  document.querySelectorAll('.accordion-body').forEach(body => {
      body.innerHTML = '';
  });

  // Group assignments by course
  let assignmentsByCourse = {};
  data.forEach(assignment => {
      if (!assignmentsByCourse.hasOwnProperty(assignment.course)) {
          assignmentsByCourse[assignment.course] = [];
      }
      assignmentsByCourse[assignment.course].push(assignment);
  });

  // Iterate over assignments by course and populate the accordion bodies
  for (let course in assignmentsByCourse) {
      let accordionBody = document.querySelector(`.${course}-accordion-body`);

      // Add assignments to the corresponding accordion body
      assignmentsByCourse[course].forEach(assignment => {
          let assignmentElement = document.createElement('div');
          assignmentElement.classList.add(`${course}-list-group`);
          assignmentElement.innerHTML = `
              <a href="#" class="list-group-item list-group-item-action">
                  <div class="d-flex w-100 justify-content-between">
                      <h5 class="mb-1">${assignment.title}</h5>
                      <small>${assignment.dueDate}</small>
                  </div>
                  <p class="mb-1">${assignment.description}</p>
              </a>
          `;
          accordionBody.appendChild(assignmentElement);
      });
  }

  resetForm(); // Reset form after adding
};






// let refreshAssignments = () => {
//   assignments.innerHTML = '';
//     data
//       .sort((a, b) => b.id - a.id)
//       .map((x) => {
//         return (assignments.innerHTML += `
//           <div id="assignment-${x.id}" class="assignment-entry">
//             <div class="assignment-header">
//               <span class="fw-bold fs-4">${x.title}</span>
//               <span class="course">${x.course}</span>
//               <pre class="text-secondary ps-3">${x.description}</pre>
//               <span class="due-date">${x.dueDate}</span>
//             </div>
        
//             <div class="options">
//               <i onClick="tryEditAssignment(${x.id})" data-bs-toggle="modal" data-bs-target="#modal-edit" class="fas fa-edit"></i>
//               <i onClick="deleteAssignment(${x.id})" class="fas fa-trash-alt"></i>
//             </div>
//           </div>
//     `);
//     });
//     resetForm();
// };


// // Refresh assignments function
// let refreshAssignments = () => {
//   // Clear accordion bodies
//   document.querySelectorAll('.accordion-collapse').forEach((collapse) => {
//       collapse.innerHTML = '';
//   });

//   // Group assignments by course
//   for (let course in assignmentsByCourse) {
//       let accordionBody = document.querySelector(`.${course}-accordion-body`);
//       let assignmentListGroup = document.createElement('div');
//       assignmentListGroup.classList.add(`${course}-list-group`);

//       // Add assignments to list group
//       assignmentsByCourse[course].forEach(assignment => {
//           let assignmentItem = document.createElement('a');
//           assignmentItem.classList.add('list-group-item', 'list-group-item-action');
//           assignmentItem.href = '#';
//           assignmentItem.innerHTML = `
//               <div class="d-flex w-100 justify-content-between">
//                   <h5 class="mb-1">${assignment.title}</h5>
//                   <small>${assignment.dueDate}</small>
//               </div>
//               <p class="mb-1">${assignment.description}</p>
//           `;
//           // Append assignment item to list group
//           assignmentListGroup.appendChild(assignmentItem);
//       });

//       // Append list group to accordion body
//       accordionBody.appendChild(assignmentListGroup);
//   }

//   resetForm(); // Reset form after adding
// };













let tryEditAssignment = (id) => {
    const assignment = data.find((x) => x.id === id);
    selectedAssignment = assignment;
    assignmentId.innerText = assignment.id;
    titleEditInput.value = assignment.title;
    descEditInput.value = assignment.description;
    courseEditInput.value = assignment.course;
    dueDateEditInput.value = assignment.dueDate;
    document.getElementById('msg').innerHTML = '';
};

document.getElementById('form-edit').addEventListener('submit', (e) => {
    e.preventDefault();
  
    if (!titleEditInput.value) {
      msg.innerHTML = 'Assignment cannot be blank';
    } else {
      editAssignment(titleEditInput.value, courseEditInput.value, descEditInput.value, dueDateEditInput.value);
  
      // close modal
      let edit = document.getElementById('edit');
      edit.setAttribute('data-bs-dismiss', 'modal');
      edit.click();
      (() => {
        edit.setAttribute('data-bs-dismiss', '');
      })();
    }
  });
  let editAssignment = (title, course, description, dueDate) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        selectedAssignment.title = title;
        selectedAssignment.course = course;
        selectedAssignment.description = description;
        selectedAssignment.dueDate = dueDate;
        refreshAssignments();
      }
    };
    xhr.open('PUT', `${api}/assignments/${selectedAssignment.id}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify({ title, course, description, dueDate }));
  };
  
  let deleteAssignment = (id) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        data = data.filter((x) => x.id !== id);
        refreshAssignments();
      }
    };
    xhr.open('DELETE', `${api}/assignments/${id}`, true);
    xhr.send();
  };
  
  let resetForm = () => {
    titleInput.value = '';
    courseInput.value = '';
    descInput.value = '';
    dueDateInput.value = '';
  };
  
  let getAssignments = () => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        data = JSON.parse(xhr.responseText) || [];
        refreshAssignments();
      }
    };
    xhr.open('GET', `${api}/assignments`, true);
    xhr.send();
  };
  
  (() => {
    getAssignments();
  })();
