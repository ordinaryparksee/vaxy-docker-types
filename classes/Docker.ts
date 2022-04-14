// Global
import * as http from 'http'

// Major
import * as _ from 'lodash'

// Miner
import HttpClient, { HttpResponse, RequestAttach } from 'vaxy-http-types'

// Local
import * as Container from './Container'

export default class Docker extends HttpClient {

  static client?: Docker

  static connect(options?: http.RequestOptions) {
    Docker.client = new Docker(options)
    return Docker.client
  }

  static getConnection(): Docker {
    if (!Docker.client) {
      throw Error('No available connection. you must call `Docker.connect()` at the first')
    }
    return Docker.client
  }

  constructor (options?: http.RequestOptions) {
    super(options)
    this.options.headers = Object.assign({
      'content-type': 'application/json'
    }, this.options.headers)
    if (!this.options.socketPath) {
      this.options.socketPath = '/var/run/docker.sock'
    }
  }

  request(method: string, entrypoint: string, query?: object,
      data?: string | object, options?: http.RequestOptions,
      attach?: RequestAttach): Promise<DockerResponse> {
    return new Promise((resolve, reject) => {
      super.request(method, entrypoint, query, data, options, attach).then((response: DockerResponse) => {
        resolve(response)
      }).catch(reject)
    })
  }

  get (entrypoint: string, query?: object, options?: http.RequestOptions,
      attach?: RequestAttach): Promise<DockerResponse> {
    return this.request('GET', entrypoint, query, undefined, options, attach)
  }

  post (entrypoint: string, query?: object, data?: string | object, options?: http.RequestOptions,
      attach?: RequestAttach): Promise<DockerResponse> {
    return this.request('POST', entrypoint, query, data, options, attach)
  }

  put (entrypoint: string, query?: object, data?: string | object, options?: http.RequestOptions,
      attach?: RequestAttach): Promise<DockerResponse> {
    return this.request('PUT', entrypoint, query, data, options, attach)
  }

  delete (entrypoint: string, query?: object, data?: string | object, options?: http.RequestOptions,
      attach?: RequestAttach): Promise<DockerResponse> {
    return this.request('DELETE', entrypoint, query, data, options, attach)
  }

}

export class DockerResponse extends HttpResponse {
  data: any
}
