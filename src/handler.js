import * as NANO from "nanoid";
import * as util from "./util.js";

const { env } = process;

const addBookHandler = (request, h) => {
  const { name, pageCount, readPage, ...other } = request.payload;
  const data = util.getAllData();

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
    ...other,
    finishd: false,
    insertedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (data.filter((e) => e.id === newBook.id).length > 0) {
    const response = h
      .response({
        status: "fail",
        message: "Gagal menambahkan buku, kesalahan server",
      })
      .code(500);

    return response;
  }

  util.insertData(env.db, newBook);

  const response = h
    .response({
      status: "succes",
      message: "Buku berhasil ditambahkan",
      data: { bookId: newBook.id },
    })
    .code(201);
  return response;
};

const getBooksHandler = (request, h) => {
  const data = util.getAllData(env.db);
  const response = h
    .response({
      status: "succes",
      data: { notes: data },
    })
    .code(200);
  return response;
};

const getBookDetailHandler = (request, h) => {
  const { bookId } = request.params;
  const data = util.getAllData(env.db).filter((e) => e.id === bookId);
  if (data.length > 0) {
    const response = h
      .response({
        status: "succes",
        data: { book: data },
      })
      .code(200);
    return response;
  }
  const response = h.response({
    status: "fail",
    messagee: "Buku tidak ditemukan",
  });
  return response;
};

const updateBookHandler = (request, h) => {
  const { bookId } = request.params;
  const { name, readPage, pageCount, ...other } = request.payload;
  const data = util.getAllData(env.db);
  const book = data.find((e) => e.id === bookId);

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
  if (!book) {
    const response = h
      .response({
        status: "fail",
        message: "Gagal memperbarui buku. Id tidak ditemukan",
      })
      .code(404);
    return response;
  }
  const update = {
    id: bookId,
    name,
    readPage,
    pageCount,
    updatedAt: new Date().toISOString(),
    insertedAt: book.insertedAt,
    ...other,
  };
  util.setData(env.db, bookId, update);
  const response = h.response({
    status: "succes",
    message: "Buku berhasil diperbarui",
  });
  return response;
};

const deleteBookHandler = (request, h) => {
  const { bookId } = request.params;
  const book = util.getAllData(env.db).find((e) => e.id === bookId);
  if (book) {
    const response = h.response({
      status: "succes",
      message: "Buku berhasil dihapus",
    }).code(200);
    util.deleteData(env.db, bookId);
    return response;
  }
  const response = h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  }).code(400);
  return response;
};

export {
  addBookHandler,
  getBooksHandler,
  getBookDetailHandler,
  updateBookHandler,
  deleteBookHandler,
};
