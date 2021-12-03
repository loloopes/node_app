const express = require('express');

const Author = require('./models/Author');
const Book = require('./models/Book');

const app = express();

app.use(express.json());


// Get all authors
app.get('/authors', async (_req, res) => {
  const authors = await Author.getAll(); 

  res.status(200).json(authors);
});


// Get author by id
app.get('/authors/:id', async (req, res) => {
  const { id } = req.params;

  const author = await Author.findById(id);

  if (!author) return res.status(404).json({message: "Not found"});

  res.status(200).json(author);
})


// Get all books
app.get('/books', async (_req, res) => {
  const books = await Book.getAllBooks();

  res.status(200).json(books)
})

// Get book by ID
app.get('/book/:id', async (req, res) => {
  const { id } = req.params;
  
  const book = await Book.getBookById(id);

  if (!book) return res.status(404).json({message: "Not found"});

  res.status(200).json(book[0])
})

// ALters author
app.post('/authors', async (req, res) => {
  const {first_name, middle_name, last_name } = req.body;

  if (!Author.isValid(first_name, middle_name, last_name)) {
    return res.status(400).json({message: 'Invalid data'})
  };

  await Author.create(first_name, middle_name, last_name);

  res.status(201).json({ message: 'Author successfully created!'})
})

app.post('/books', async (req, res) => {
  const { title, author_id } = req.body;

  if(!await Book.isValid(title, author_id)) {
    return res.status(400).json({message: 'Invalid data'});
  };

  await Book.create(title, author_id);

  res.status(201).json({message: "Book created successfully"})
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Ouvindo a porta ${PORT}`));