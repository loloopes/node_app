const { ObjectId } = require('mongodb')

const connection = require('./connection');

const isValid = (firstName, middleName, lastName) => {
  if (!firstName || typeof firstName !== 'string') return false;
  if (!lastName || typeof lastName !== 'string') return false;
  if (middleName && typeof middleName!== 'string') return false;

  return true;
};


// Create Author NoSQL
const create = async (firstName, middleName, lastName) => connection()
  .then((db) => db.collection('authors').insertOne({firstName, middleName, lastName}))
  .then((result) => getFullNameAuthor({id: result.insertedId, firstName, middleName, lastName}))


// Create Author SQL
// const create = async (firstName, middleName, lastName) => connection.execute(
//   'INSERT INTO model_example.authors (first_name, middle_name, last_name) VALUES (?, ?, ?)', [firstName, middleName, lastName]
// )

const getFullNameAuthor = ({_id, firstName, middleName, lastName}) => {
  const fullName = [firstName, middleName, lastName]
    .filter((name) => name)
    .join(" ")

  return fullName;
}

// findByID SQL
// const findById = async (id) => {
//   const [authorData] = await connection.execute(
//     `SELECT id, first_name, middle_name, last_name FROM authors WHERE id=?`, [id]
//   );

//   if (authorData.length === 0) return null;

//   const { firstName, middleName, lastName } = authorData.map(serialize)[0];

//   return getFullNameAuthor({
//     id,
//     firstName,
//     middleName,
//     lastName,
//   })
// }

// FindById NoSQL
const findById = async (id) => {
  if (!ObjectId.isValid(id)) {
    return null
  };

  const authorData = await connection()
    .then((db) => db.collection('authors').findOne({_id: new ObjectId(id)}));

  if (!authorData) return null;

  const { firstName, middleName, lastName } = authorData;

  return getFullNameAuthor({id, firstName, middleName, lastName})

}

const serialize = ({id, first_name, middle_name, last_name}) => ({
  id,
  firstName: first_name,
  middleName: middle_name,
  lastName: last_name,
  fullName: getFullNameAuthor(first_name, middle_name, last_name),
});

// Get alll authors (MySQL)
// const getAll = async () => {
//   const [authors] = await connection.execute(
//     `SELECT id, first_name, middle_name, last_name FROM model_example.authors;`
//   );

//   return authors.map(serialize);
// };

const getAll = async () => {
  return connection()
    .then((db) => db.collection('authors').find().toArray())
      .then((authors) => 
        authors.map(({_id, firstName, middleName, lastName}) =>
        getFullNameAuthor({
          id: _id,
          firstName,
          middleName,
          lastName,
        })
        ))
}

module.exports = {
  getAll,
  findById,
  isValid,
  create,
}