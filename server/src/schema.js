import find from "lodash.find";
import remove from "lodash.remove";

const people = [
  { id: "1", firstName: "Bill", lastName: "Gates" },
  { id: "2", firstName: "Steve", lastName: "Jobs" },
  { id: "3", firstName: "Linux", lastName: "Torvalds" },
];

const cars = [
  {
    id: "1",
    year: 2019,
    make: "Toyota",
    model: "Corolla",
    price: 40000,
    personId: "1",
  },
  {
    id: "2",
    year: 2018,
    make: "Lexus",
    model: "LX 600",
    price: 13000,
    personId: "1",
  },
  {
    id: "3",
    year: 2017,
    make: "Honda",
    model: "Civic",
    price: 20000,
    personId: "1",
  },
  {
    id: "4",
    year: 2019,
    make: "Acura",
    model: "MDX",
    price: 60000,
    personId: "2",
  },
  {
    id: "5",
    year: 2018,
    make: "Ford",
    model: "Focus",
    price: 35000,
    personId: "2",
  },
  {
    id: "6",
    year: 2017,
    make: "Honda",
    model: "Pilot",
    price: 45000,
    personId: "2",
  },
  {
    id: "7",
    year: 2019,
    make: "Volkswagen",
    model: "Golf",
    price: 40000,
    personId: "3",
  },
  {
    id: "8",
    year: 2018,
    make: "Kia",
    model: "Sorento",
    price: 45000,
    personId: "3",
  },
  {
    id: "9",
    year: 2017,
    make: "Volvo",
    model: "XC40",
    price: 55000,
    personId: "3",
  },
];

const typeDefs = `
  type Person {
    id: String!
    firstName: String!
    lastName: String!
    cars: [Car]
  }

  type Car {
    id: String!
    year: Int!
    make: String!
    model: String!
    price: Float!
    personId: String!
  }

  type Query {
    people: [Person]
    personWithCars(id: String!): Person
    cars: [Car]
  }

  type Mutation {
    addPerson(firstName: String!, lastName: String!): Person
    updatePerson(id: String!, firstName: String, lastName: String): Person
    deletePerson(id: String!): Person
    addCar(
      year: Int!
      make: String!
      model: String!
      price: Float!
      personId: String!
    ): Car
    updateCar(
      id: String!
      year: Int
      make: String
      model: String
      price: Float
      personId: String
    ): Car
    deleteCar(id: String!): Car
  }
`;

const resolvers = {
  Query: {
    people: () => people,
    personWithCars: (root, { id }) => {
      const person = find(people, { id });
      if (person) {
        person.cars = cars.filter((car) => car.personId === id);
      }
      return person;
    },
    cars: () => cars,
  },
  Mutation: {
    addPerson: (root, { firstName, lastName }) => {
      const newPerson = {
        id: (people.length + 1).toString(),
        firstName,
        lastName,
      };
      people.push(newPerson);
      return newPerson;
    },
    updatePerson: (root, { id, firstName, lastName }) => {
      const person = find(people, { id });
      if (!person) throw new Error(`Couldn't find person with id ${id}`);
      if (firstName) person.firstName = firstName;
      if (lastName) person.lastName = lastName;
      return person;
    },
    deletePerson: (root, { id }) => {
      const removedPerson = find(people, { id });
      if (!removedPerson) throw new Error(`Couldn't find person with id ${id}`);
      remove(cars, (c) => c.personId === removedPerson.id);
      remove(people, (p) => p.id === removedPerson.id);
      return removedPerson;
    },
    addCar: (root, { year, make, model, price, personId }) => {
      const newCar = {
        id: (cars.length + 1).toString(),
        year,
        make,
        model,
        price,
        personId,
      };
      cars.push(newCar);
      return newCar;
    },
    updateCar: (root, { id, year, make, model, price, personId }) => {
      const car = find(cars, { id });
      if (!car) throw new Error(`Couldn't find car with id ${id}`);
      if (year) car.year = year;
      if (make) car.make = make;
      if (model) car.model = model;
      if (price) car.price = price;
      if (personId) car.personId = personId;
      return car;
    },
    deleteCar: (root, { id }) => {
      const removedCar = find(cars, { id });
      if (!removedCar) throw new Error(`Couldn't find car with id ${id}`);
      remove(cars, (c) => c.id === removedCar.id);
      return removedCar;
    },
  },
  Person: {
    cars: (person) => cars.filter((car) => car.personId === person.id),
  },
};

export { typeDefs, resolvers };

