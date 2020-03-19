import mongoose from 'mongoose';
import config from '../../etc/config.json';
import '../models/Model';

const bcrypt = require('bcrypt');
const saltRounds = 10;

const User = mongoose.model('User');
const Item = mongoose.model('Item');

/**
 * Установка соединения с базой
 */
export function setUpConnection() {
  mongoose.connect(`mongodb://${config.db.username}:${config.db.pass}@${config.db.host}:${config.db.port}/${config.db.name}`);
}

/**
 * Поиск всех юзеров в базе
 * @param {int} page - страница выдачи
 * @return {Array} - массив пользователей
 */
export function listUsers(page = 0) {
  // номер страницы с 0
  let items;
  if (page !== undefined) {
    items = page * 10;
  } else {
    items = 0;
  }

  return User.find().sort('createdAt').skip(items).limit(10);
}

/**
 * Сохранение пользователя
 * @param {object} data - Объект с данными юзера по схеме User
 * @return {object} - Объект с данными юзера по схеме User
 */
export async function createUser(data) {
  const hash = await bcrypt.hash(data.password, saltRounds);
  const user = new User({
    name: data.name,
    number: data.number,
    password: hash,
    secondName: data.secondName,
    email: data.email,
    tel: data.tel,
    org: data.org,
    createdAt: new Date(),
  });
  return user.save();
}

/**
 * Поиск всех items
 * @param {int} page - страница выдачи
 * @param {object} expiried - expiried params
 * @return {Array} - массив Image
 */
export function listItems(page = 0, expiried) {
  const item = page * 10;
  const expiredValue = expiried ? { 'expiried': expiried, 'deleted': false } : { 'deleted': false };
  return Item.find(expiredValue).sort('createdAt').skip(item).limit(10);
}

/**
 * Поиск item по id
 * @param {string} id - Item id
 * @return {object} - Item object
 */
export function getItems(id = '') {
  return Item.find({ _id: id });
}

/**
 * Поиск item по identifier
 * @param {string} identifier - Item identifier
 * @return {object} - Item object
 */
export function getItemsByIdentifier(identifier = '') {
  return Item.find({ identifier });
}

/**
 * Поиск item по identifier
 * @param {string} token - Item identifier
 * @return {object} - Item object
 */
export function getItemsByToken(token = '') {
  return Item.find({ token });
}

/**
 * Поиск item по serial
 * @param {string} serial - Item serial
 * @return {object} - Item object
 */
export function getItemsBySerial(serial = '') {
  return Item.find({ serial });
}

/**
 * Создание item
 * @param {object} data - Объект с данными по схеме Item
 * @return {object} - Объект с данными по схеме Item
 */
export async function createItems(data = {}) {
  const token = await getItemsByToken(data.token);
  console.log('token', token, token?.length);

  if (token?.length === 0) {
    const item = new Item({
      identifier: data.identifier,
      token: data.token,
      description: data.description,
      serial: data.serial,
    });
    return item.save();
  }
  return { 'message': 'token found' };
}

/**
 * Обновление Item
 * @param {string} id - страница выдачи
 * @param {object} params - обновляемые параметры
 * @return {object} - обновленный объект
 */
export function updateItems(id, params) {
  return Item.findOneAndUpdate({ _id: id }, { $set: params }, { new: true });
}
