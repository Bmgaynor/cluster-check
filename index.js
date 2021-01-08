const cluster = require('cluster')
const http = require('http')
const numCPUs = require('os').cpus().length

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`)
  console.log(`Adding ${numCPUs} processes`)

  const processScore = {}
  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork()

    worker.on('message', () => {
      processScore[worker.id] = processScore[worker.id] ? processScore[worker.id] + 1 : 1
      console.log('score', processScore)
    })
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`)
  })
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http
    .createServer((req, res) => {
      res.writeHead(200)
      console.log(`worker ${process.pid} responding`)
      res.end(`worker ${process.pid} responded`)
      process.send({ cmd: 'notifyRequest' })
    })
    .listen(8000)

  console.log(`Worker ${process.pid} started`)
}
