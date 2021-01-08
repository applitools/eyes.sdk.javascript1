// this middleware causes /stream to be served without ever closing the connection
module.exports = (req, res, next) => {
    if (req.url === '/stream') {
        res.writeHead(200, {'Content-Type': 'audio/mp3'})
        write()
        // process.on('SIGTERM', (code) => {
        //   res.end() // otherwise the process hangs
        // });
    } else {
      next()
    }

    function write() {
        res.write('hello world')
        setTimeout(write, 50)
    }
  }
  