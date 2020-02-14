const path = require('@/path.js').default;
const fs = require('@/fs.js').default;

export default function CreateDirectory(dirname) {
  if (fs.existsSync(dirname)) {
    return true
  } else {
    if (CreateDirectory(path.dirname(dirname))) {
      fs.mkdirSync(dirname)
      return true
    }
  }
}
