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
  // Clear existing content in accordion bodies
  document.querySelectorAll('.list-group').forEach(group => {
      group.innerHTML = '';
  });

  // Populate accordion bodies with assignments
  data.forEach(assignment => {
      let course = assignment.course.toLowerCase().replace(/\s+/g, '-');
      let accordionBody = document.getElementById(`${course}-assignments`);

      if (accordionBody) {
          accordionBody.innerHTML += `
              <a href="#" class="list-group-item list-group-item-action" aria-current="true">
                  <div class="d-flex w-100 justify-content-between">
                      <h5 class="mb-1">${assignment.title}</h5>
                      <small>${assignment.dueDate}</small>
                  </div>
                  <p class="mb-1">${assignment.description}</p>

                  <span class="options">
                    <i onClick="tryEditAssignment(${assignment.id})" data-bs-toggle="modal" data-bs-target="#modal-edit" class="fas fa-edit"></i>
                    <i onClick="deleteAssignment(${assignment.id})" class="fas fa-trash-alt"></i>
              </a>
          `;
      }
  });

  resetForm();
};


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
