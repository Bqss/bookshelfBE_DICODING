import * as Handler from "./handler.js";

const route = [
  {
    path: "/books",
    method: "POST",
    handler: Handler.addBookHandler,
  },
  {
    path: "/books",
    method: "GET",
    handler: Handler.getBooksHandler,
  },
  {
    path: "/books/{bookId}",
    method: "GET",
    handler: Handler.getBookDetailHandler,
  },
  {
    path: "/books/{bookId}",
    method: "PUT",
    handler: Handler.updateBookHandler,
  },
  {
    path: "/books/{bookId}",
    method: "DELETE",
    handler: Handler.deleteBookHandler,
  },
];

export default route;
