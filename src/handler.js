import * as NANO from "nanoid";
import * as util from "./util.js";

const { env } = process;

const addBookHandler = (request, h) => {
  // eslint-disable-next-line max-len
  const {
    name, pageCount, readPage, year = "_", author = "", summary = "", publisher = "", reading = false,
  } = request.payload;
  const data = util.getAllData(env.db);

  if (!name) {
    const response = h
      .response({
        status: "fail",
        message: "Gagal menambahkan buku. Mohon isi nama buku",
      })
      .code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h
      .response({
        status: "fail",
        message:
          "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400);

    return response;
  }
  const newBook = {
    id: NANO.nanoid(14),
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished: readPage === pageCount,
    reading,
    insertedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (data.filter((e) => e.id === newBook.id).length > 0) {
    const response = h
      .response({
        status: "error",
        message: "Buku gagal ditambahkan, kesalahan server",
      })
      .code(500);

    return response;
  }

  util.insertData(env.db, newBook);

  const response = h
    .response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: { bookId: newBook.id },
    })
    .code(201);
  return response;
};

const getBooksHandler = (request, h) => {
  let data = util.getAllData(env.db);
  const { name, reading, finished } = request.query;
  if (name) {
    data = data.filter((e) => e.name.toLowerCase().includes(name.toLowerCase()));
  }
  if (reading) {
    const rd = Number(reading) === 1;
    data = data.filter((e) => e.reading === rd);
  }
  if (finished) {
    const fs = Number(finished) === 1;
    data = data.filter((e) => e.finished === fs);
  }

  data = data.map((e) => ({
    id: e.id,
    name: e.name,
    publisher: e.publisher,
  }));

  const response = h
    .response({
      status: "success",
      data: { books: data },
    })
    .code(200);
  return response;
};

const getBookDetailHandler = (request, h) => {
  const { bookId } = request.params;
  const data = util.getAllData(env.db).find((e) => e.id === bookId);
  if (data) {
    const response = h
      .response({
        status: "success",
        data: { book: data },
      })
      .code(200);
    return response;
  }
  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  }).code(404);
  return response;
};

const updateBookHandler = (request, h) => {
  const { bookId } = request.params;
  // eslint-disable-next-line max-len
  const data = util.getAllData(env.db);
  const book = data.find((e) => e.id === bookId);
  if (!book) {
    const response = h
      .response({
        status: "fail",
        message: "Gagal memperbarui buku. Id tidak ditemukan",
      })
      .code(404);
    return response;
  }
  // eslint-disable-next-line max-len
  const {
    name, readPage = 0, pageCount = 0, year, author, summary, publisher, reading,
  } = request.payload;

  if (!name) {
    const response = h
      .response({
        status: "fail",
        message: "Gagal memperbarui buku. Mohon isi nama buku",
      })
      .code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h
      .response({
        status: "fail",
        message:
          "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400);

    return response;
  }
  const update = {
    id: bookId,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished: readPage === pageCount,
    reading,
    insertedAt: book.insertedAt,
    updatedAt: new Date().toISOString(),
  };
  util.setData(env.db, bookId, update);
  const response = h.response({
    status: "success",
    message: "Buku berhasil diperbarui",
    book: update,
  });
  return response;
};

const deleteBookHandler = (request, h) => {
  const { bookId } = request.params;
  const book = util.getAllData(env.db).find((e) => e.id === bookId);
  if (book) {
    const response = h
      .response({
        status: "success",
        message: "Buku berhasil dihapus",
      })
      .code(200);
    util.deleteData(env.db, bookId);
    return response;
  }
  const response = h
    .response({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
    })
    .code(404);
  return response;
};

export {
  addBookHandler,
  getBooksHandler,
  getBookDetailHandler,
  updateBookHandler,
  deleteBookHandler,
};
