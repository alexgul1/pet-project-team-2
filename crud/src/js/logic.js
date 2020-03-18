// some logic functions for crud

function People(obj) {
  this.defal = obj;
  this.array = [];
  this.init();
}

module.exports = People;

People.prototype.createPerson = function(id, firstName, secondName, age) {
  if (this.checkerPeople(id)) {
    const person = {
      id,
      firstName,
      lastName: secondName,
      age,
    };
    this.array.push(person);
  }
};

People.prototype.updatePerson = function(id, firstName, secondName, age) {
  for (let i = 0; i < this.array.length; i++) {
    if (this.array[i].id === id) {
      if (firstName.trim()) {
        this.array[i].firstName = firstName.trim();
      }
      if (secondName.trim()) {
        this.array[i].lastName = secondName.trim();
      }
      if (Number.isFinite(age) && age > 0) {
        this.array[i].age = age;
      }
      break;
    }
  }
};

People.prototype.deletePerson = function(id) {
  for (let i = 0; i < this.array.length; i++) {
    if (this.array[i].id === id) {
      this.array.splice(i, 1);
      break;
    }
  }
};

People.prototype.checkerPeople = function(id) {
  for (let i = 0; i < this.array.length; i++) {
    if (this.array[i].id === id) {
      return false;
    }
  }
  return true;
};

// для удобства тестов

People.prototype.init = function() {
  this.array = [];
  for (let i = 0; i < this.defal.length; i++) {
    this.array[i] = {};
    this.array[i].id = this.defal[i].id;
    this.array[i].firstName = this.defal[i].firstName;
    this.array[i].lastName = this.defal[i].lastName;
    this.array[i].age = this.defal[i].age;
  }
};
