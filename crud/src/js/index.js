// html элементы
const list = document.querySelector('.div_list');
const buttonCreate = document.querySelector('.create');
const buttonUpdate = document.querySelector('.update');
const buttonDelete = document.querySelector('.delete');
const field = document.getElementsByClassName('field');
const database = document.getElementsByName('database');
// переменные для логики
let divElement = {};
let checker = false;
let arrayElements = [];

// localStorage по дефолту
window.onload = () => {
  database[0].click();
};

// запуск базы данных

const request = window.indexedDB.open('MyTest', 2);
let db;
request.onsuccess = function() {
  db = request.result;
};
request.onupgradeneeded = function() {
  if (!request.result.objectStoreNames.contains('people')) {
    db = request.result;
    db.createObjectStore('people', { keyPath: 'id' });
  }
};

function readDB() {
  if (database[0].checked) {
    arrayElements.length = 0;
    const localStor = localStorage.getItem('person_state');
    if (localStor != null) {
      arrayElements = JSON.parse(localStor);
      refreshTable();
    }
  } else if (database[1].checked) {
    arrayElements.length = 0;
    const people = db.transaction('people').objectStore('people');
    people.openCursor().onsuccess = function(event) {
      const cursor = event.target.result;
      if (cursor) {
        arrayElements.push(cursor.value);
        cursor.continue();
      } else {
        refreshTable();
      }
    };
  }
}

function updateDB(action, value) {
  if (database[0].checked) {
    localStorage.setItem('person_state', JSON.stringify(arrayElements));
  } else if (database[1].checked) {
    indexeddbFunctional(action, value);
  }
}

function indexeddbFunctional(action, value) {
  const transaction = db.transaction('people', 'readwrite');
  const people = transaction.objectStore('people');
  switch (action) {
    case 'add': {
      const requestDB = people.add(divElement);
      requestDB.onsuccess = () => {
        alert('Добавлено в IndexedDB');
      };
      break;
    }
    case 'update': {
      const requestDB = people.put(value);
      requestDB.onsuccess = () => {
        alert('Обновлено');
      };
      break;
    }
    case 'delete': {
      const requestDB = people.delete(value);
      requestDB.onsuccess = () => {
        alert('Удалено с IndexedDB');
      };
      break;
    }
  }
}

// действия при нажатии кнопок
const createButton = function() {
  checker = checkerPeople(field[0].value);
  if (!checker && checkFields()) {
    createPerson();
    updateDB('add');
    refreshTable();
    clearFields();
  } else {
    alert('Check inputs');
    checker = false;
  }
};

const updateButton = function() {
  const updatingValue = updatePerson(field[0].value);
  if (updatingValue !== null) {
    updateDB('update', updatingValue);
    refreshTable();
  } else {
    alert('Такого ид не существует');
  }
  clearFields();
};

const deleteButton = function() {
  if (checkDelete()) {
    const id = deletePerson(field[0].value);
    if (id !== null) {
      updateDB('delete', id);
      refreshTable();
    } else {
      alert('ид не найдено');
    }
  } else {
    alert('only id');
  }
  clearFields();
};

// обновление таблицы
function refreshTable() {
  list.innerHTML = '';
  for (let i = 0; i < arrayElements.length; i++) {
    const div1 = document.createElement('div');
    div1.innerHTML = arrayElements[i].id;
    const div2 = document.createElement('div');
    div2.innerHTML = arrayElements[i].firstName;
    const div3 = document.createElement('div');
    div3.innerHTML = arrayElements[i].lastName;
    const div4 = document.createElement('div');
    div4.innerHTML = arrayElements[i].age;
    const div5 = document.createElement('div');
    div5.innerHTML = arrayElements[i].email;
    const div6 = document.createElement('div');
    div6.innerHTML = arrayElements[i].phone;
    const mainDiv = document.createElement('div');
    mainDiv.className = 'container';
    mainDiv.appendChild(div1);
    mainDiv.appendChild(div2);
    mainDiv.appendChild(div3);
    mainDiv.appendChild(div4);
    mainDiv.appendChild(div5);
    mainDiv.appendChild(div6);
    list.appendChild(mainDiv);
  }
}

function clearFields() {
  for (let i = 0; i < field.length; i++) {
    field[i].value = '';
  }
}

// разные проверки
function checkDelete() {
  return !(
    field[1].value !== '' ||
    field[2].value !== '' ||
    field[3].value !== '' ||
    field[4].value !== '' ||
    field[5].value !== ''
  );
}

function checkerField(fieldValue) {
  return fieldValue.trim() !== '';
}

function checkFields() {
  if (!Number.isFinite(parseInt(field[0].value, 10)) || field[0].value < 0) {
    return false;
  }
  if (field[1].value === '') {
    return false;
  }
  if (field[2].value === '') {
    return false;
  }
  if (!Number.isFinite(parseInt(field[3].value, 10)) || field[3].value < 0) {
    return false;
  }
  return true;
}

buttonCreate.addEventListener('click', createButton);
buttonUpdate.addEventListener('click', updateButton);
buttonDelete.addEventListener('click', deleteButton);
for (let i = 0; i < database.length; i++) {
  database[i].addEventListener('change', readDB);
}

// логика(?перенести в отдельный файл)
function createPerson() {
  divElement = {
    id: field[0].value,
    firstName: field[1].value,
    lastName: field[2].value,
    age: field[3].value,
    email: field[4].value,
    phone: field[5].value,
  };
  arrayElements.push(divElement);
}

function updatePerson(index) {
  for (let i = 0; i < arrayElements.length; i++) {
    if (arrayElements[i].id === index) {
      if (checkerField(field[1].value)) {
        arrayElements[i].firstName = field[1].value;
      }
      if (checkerField(field[2].value)) {
        arrayElements[i].lastName = field[2].value;
      }
      if (checkerField(field[3].value) && Number.isFinite(field[3].value) && field[3].value > 0) {
        arrayElements[i].age = field[3].value;
      }
      if (checkerField(field[4].value)) {
        arrayElements[i].email = field[4].value;
      }
      if (checkerField(field[5].value)) {
        arrayElements[i].phone = field[5].value;
      }
      return arrayElements[i];
    }
  }
  return null;
}

function deletePerson(value) {
  for (let i = 0; i < arrayElements.length; i++) {
    if (arrayElements[i].id === value) {
      const { id } = arrayElements[i];
      arrayElements.splice(i, 1);
      return id;
    }
  }
  return null;
}

function checkerPeople(id) {
  for (let i = 0; i < arrayElements.length; i++) {
    if (arrayElements[i].id === id) {
      return true;
    }
  }
  return false;
}
