import * as FS from "node:fs";

const getAllData = (path) => {
  const data = JSON.parse(FS.readFileSync(path));
  return data;
};

const insertData = (path, payload) => {
  const data = getAllData(path);
  data.push(payload);
  FS.writeFileSync(path, JSON.stringify(data));
  return data;
};

const setData = (path, id, data) => {
  const other = getAllData(path).filter((e) => e.id !== id);
  const datadb = [...other, data];
  FS.writeFileSync(path, JSON.stringify(datadb));
  return datadb;
};

const deleteData = (path, id) => {
  const db = getAllData(path);
  const other = db.filter((e) => e.id !== id);
  FS.writeFileSync(path, JSON.stringify(other));
  return other;
};

export { getAllData, insertData, setData, deleteData };
