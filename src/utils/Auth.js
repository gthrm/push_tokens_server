import * as db from './DataBaseUtils';
const bcrypt = require('bcrypt');

/**
 * Функция авторизации пользователя из базы
 * @param {string} username - имя пользователя
 * @param {string} password - пароль
 * @param {string} cb - callback
 */
export default function myAsyncAuthorizer(username, password, cb) {
  db.listUsers()
      .then(
          (data) => {
            const itemList = data.map(async (item) => ({
              ...item,
              valid: await bcrypt.compare(password, item.password),
            }));
            Promise.all(itemList)
                .then(
                    (completed) => {
                      const itemOkList = completed.find((item) => item.valid === true && item._doc.name === username);
                      if (itemOkList) {
                        return cb(null, true);
                      }
                      return cb(null, false);
                    });
          },
      )
      .catch(
          (err) => console.error(err),
      );
}
