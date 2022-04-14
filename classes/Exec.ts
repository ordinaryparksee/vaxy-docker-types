import * as http from 'http'
import { RequestAttach, HttpResponse } from 'vaxy-http-types'
import Docker, { DockerResponse } from './Docker'

export default class Exec {

  static create (containerId: string, data?: ExecCreateBody): Promise<Exec> {
    return new Promise((resolve, reject) => {
      Docker.getConnection().post(`/containers/${containerId}/exec`, {}, data, {},
        (request: http.ClientRequest, response: http.IncomingMessage) => {
        let data = ''
        response.on('data', (chunk) => {
          data += chunk
        })
        response.on('end', () => {
          let _response = new DockerResponse(response, data)
          if (!_response.statusCode || _response.statusCode >= 400) {
            reject(_response as ExecCreateResponse)
          } else {
            resolve(new Exec(_response.data.Id))
          }
          request.end()
        })
      }).then((response : ExecCreateResponse) => {
        resolve(new Exec(response.data.Id))
      }).catch(reject)
    })
  }

  readonly id: string

  constructor (id: string) {
    this.id = id
  }

  start (data: ExecStartBody = {}): Promise<HttpResponse> {
    return new Promise((resolve, reject) => {
      if (data.Tty) {
        Docker.getConnection().post(`/exec/${this.id}/start`, {}, data, {}).then(response => {
          resolve(response)
        }).catch(reject)
      } else {
        Docker.getConnection().post(`/exec/${this.id}/start`, {}, data, {}, (request, response) => {
          let stdout = ''
          let stderr = ''
          response.on('data', () => {
            let chunk
            while(chunk = response.read()) {
              let size = (chunk[4] << 24) | (chunk[5] << 16) | (chunk[6] << 8) | chunk[7]
              if (chunk[0] == 1) {
                stdout += chunk.slice(8, 8 + size).toString()
              }
              if (chunk[0] == 2) {
                stderr += chunk.slice(8, 8 + size).toString()
              }
            }
          })
          response.on('end', () => {
            resolve(new HttpResponse(response, stdout))
          })
        })
      }
    })
  }

}

export interface ExecCreateBody {
  AttachStdin?: boolean
  AttachStdout?: boolean
  AttachStderr?: boolean
  DetachKeys?: string
  Tty?: boolean
  Env?: Array<string>
  Cmd?: Array<string>
  Privileged?: boolean
  User?: string
  WorkingDir?: string
}

export interface ExecCreateResponse extends DockerResponse {
  data: {
    Id: string
  }
}

export interface ExecStartBody {
  Detach?: boolean
  Tty?: boolean
}

export enum StreamType {
  stdin = 0,
  stdout = 1,
  stderr = 2
}
