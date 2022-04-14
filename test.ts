// import { Docker, Container } from './index'

let test: any[]

test = [{ Id: "test", Names: ["1", "2"], Image: "Ubuntu"}]

// Call this at the first
// Docker.connect()

// Container.list({
//   all: true,
//   filters: {
//     ancestor: ['ubuntu']
//   }
// }).then(async containers => {
//   containers.forEach(container => {
//     console.log(container.id)
//   })
// }).catch(response => {
//   console.log(response)
// })

// Container.create('ubuntu', null, {
//     Cmd: ['tail', '-f', '/dev/null']
// }).then(container => {
//   console.log(container.id)
// }).catch(response => {
//   console.log(response)
// })

// let container = new Container('df0df148850f')

// container.inspect().then(response => {
//   console.log(response.data.Mounts)
// }).catch(response => {
//   console.error(response)
// })

// container.start().then(response => {
//   console.log(response)
// }).catch(response => {
//   console.error(response)
// })

// container.pause().then(response => {
//   console.log(response)
// }).catch(response => {
//   console.error(response)
// })

// container.resume().then(response => {
//   console.log(response)
// }).catch(response => {
//   console.error(response)
// })

// container.stop().then(response => {
//   console.log(response)
// }).catch(response => {
//   console.error(response)
// })

// container.kill().then(response => {
//   console.log(response)
// }).catch(response => {
//   console.error(response)
// })

// container.delete({
//   force: true
// }).then(response => {
//   console.log(response)
// }).catch(response => {
//   console.error(response)
// })

// container.exec([
//   'ls', '/'
// ]).then(response => {
//   console.log(response)
// }).catch(response => {
//   console.log(response)
// })
