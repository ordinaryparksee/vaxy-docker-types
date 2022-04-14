const { Docker, Container } = require('../index').default

// It must be called firs
Docker.connect()

Container.list({
  all: true
}).then(containers => {
  containers.forEach(container => {
    console.log(container.id)
  })
}).catch(response => {
  console.log(response)
})
