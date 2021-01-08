const { get } = require('axios')
// require('./') // runs server
function hammer () {
  console.log(`---  hammer --- ${process.pid}`)
  return get('http://localhost:8000')
    .then(res => console.log(res.data))
    .then(() => hammer())
    .catch(err => console.error(err))
}

setTimeout(() => hammer(), 500)
