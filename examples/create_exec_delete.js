const { Docker, Container } = require('../index').default

// It must be called firs
Docker.connect()

Container.create('ubuntu', null, {
    Cmd: ['tail', '-f', '/dev/null']
}).then(async container => {
  await container.start()
  container.exec(['ls', '/']).then(stdout => {
      console.log(stdout)
      container.delete({
        force: true
      })
    }).catch(response => {
      console.log(response)
      container.delete({
        force: true
      })
    })
}).catch(response => {
  console.log(response)
})
