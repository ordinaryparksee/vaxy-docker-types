Docker client for typescript

# Usage

## Initialize
``` javascript
const { Docker } = require('vaxy-docker-types')

// It must be called first
Docker.connect()
```

## Get containers
``` javascript
const { Docker, Container } = require('../index').default

// It must be called first
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
```

## Create/Start/Execute/Delete combination
``` javascript
const { Docker, Container } = require('../index').default

// It must be called first
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
```

## Create container instance
``` javascript
const { Docker, Container } = require('../index').default

// It must be called first
Docker.connect()

let container = new Container('{CONTAINER_ID}')
container.exec(['ls', '/']).then(stdout => {
  console.log(stdout)
})
```
