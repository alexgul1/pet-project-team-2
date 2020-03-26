const People = require('../logic');

describe('Логика crud', function() {
  const arrayPeople = new People([
    {
      id: 1,
      firstName: 'Vasya',
      lastName: 'Pupkin',
      age: 35,
    },
    {
      id: 23,
      firstName: 'Sanya',
      lastName: 'Pushkin',
      age: 28,
    },
  ]);
  describe("Добавим персону с id: 3, firstName: 'Kolia' lastName: 'Vorotila' age: 29", function() {
    it('проверим длину arrayPeople, и наличие созданой персоны в массиве', function() {
      arrayPeople.createPerson(3, 'Kolia', 'Vorotila', 29);
      assert.equal(arrayPeople.array.length, 3);
      assert.deepEqual(arrayPeople.array[2], {
        id: 3,
        firstName: 'Kolia',
        lastName: 'Vorotila',
        age: 29,
      });
      arrayPeople.init();
    });
  });
  describe("Добавим персону с id: 1, firstName: 'Kolia' lastName: 'Vorotila' age: 29", function() {
    it('проверим длину arrayPeople, и наличие созданой персоны в массиве', function() {
      arrayPeople.createPerson(1, 'Kolia', 'Vorotila', 29);
      assert.equal(arrayPeople.array.length, 2);
    });
  });

  describe("Обновим персону с id: 1, firstName: 'Anatolii' lastName: 'Mafioznik' age: 36", function() {
    it('проверим длину arrayPeople, и наличие персоны в массиве', function() {
      arrayPeople.updatePerson(1, 'Anatolii', 'Mafioznik', 36);
      assert.equal(arrayPeople.array.length, 2);
      assert.deepEqual(arrayPeople.array[0], {
        id: 1,
        firstName: 'Anatolii',
        lastName: 'Mafioznik',
        age: 36,
      });
      arrayPeople.init();
    });
  });

  describe("Обновим персону с id: 1, firstName: '     ' lastName: 'Mafioznik' age: 33", function() {
    it('проверим длину arrayPeople, и наличие персоны в массиве', function() {
      arrayPeople.updatePerson(1, '     ', 'Mafioznik', 36);
      assert.equal(arrayPeople.array.length, 2);
      assert.deepEqual(arrayPeople.array[0], {
        id: 1,
        firstName: 'Vasya',
        lastName: 'Mafioznik',
        age: 36,
      });
      arrayPeople.init();
    });
  });
  describe("Обновим персону с id: 2, firstName: '' lastName: 'Mafioznik' age: 33", function() {
    it('проверим длину arrayPeople', function() {
      arrayPeople.updatePerson(2, '', 'Mafioznik', 33);
      assert.equal(arrayPeople.array.length, 2);
      arrayPeople.init();
    });
  });

  describe("Обновим персону с id: 1, firstName: '     ' lastName: '' age: -15", function() {
    it('проверим длину arrayPeople, и наличие персоны в массиве', function() {
      arrayPeople.updatePerson(1, '     ', '', -15);
      assert.equal(arrayPeople.array.length, 2);
      arrayPeople.init();
    });
  });

  describe('Удалим персону с id: 1', function() {
    it('проверим длину arrayPeople', function() {
      arrayPeople.deletePerson(1);
      assert.equal(arrayPeople.array.length, 1);
      arrayPeople.init();
    });
  });

  describe('Удалим персону с id: 15', function() {
    it('проверим длину arrayPeople', function() {
      arrayPeople.deletePerson(15);
      assert.equal(arrayPeople.array.length, 2);
      arrayPeople.init();
    });
  });
});