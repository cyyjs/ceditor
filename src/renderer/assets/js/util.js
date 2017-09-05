'use strict'
export default class Util {
  static promisify (fn) {
    return function (...argument) {
      return new Promise((resolve, reject) => {
        fn.bind(this)(...argument, (err, ...result) => {
          if (err) {
            return reject(err)
          }
          resolve(...result)
        })
      })
    }
  }
}
