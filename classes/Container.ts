import qs from 'qs'
import Docker, { DockerResponse } from './Docker'
import Exec, { ExecCreateBody, ExecCreateResponse, ExecStartBody } from './Exec'
import * as _ from 'lodash'
import { request } from 'http'

export default class Container {

  static list(query: ListQuery = {}): Promise<Array<Container>> {
    if (typeof query.filters !== 'string') {
      query.filters = JSON.stringify(query.filters)
    }

    return new Promise((resolve, reject) => {
      Docker.getConnection().get('/containers/json', query).then((response: ListResponse) => {
        let containers: Array<Container> = []
        response.data.forEach(value => {
          containers.push(new Container(value.Id))
        })
        resolve(containers)
      }).catch(reject)
    })
  }

  static create (image: string, name?: string, body?: CreateBody): Promise<Container> {
    body = _.merge(body, {
      Image: image
    })
    return new Promise((resolve, reject) => {
      Docker.getConnection().post('/containers/create', {
        name: name
      }, body).then((response: CreateResponse) => {
        resolve(new Container(response.data.Id))
      }).catch(reject)
    })
  }

  readonly id: string

  constructor (id: string) {
    this.id = id
  }

  inspect (query: InspectQuery = {}): Promise<InpectResponse> {
    return new Promise((resolve, reject) => {
      Docker.getConnection().get(`/containers/${this.id}/json`, query).then((response: DockerResponse) => {
        resolve(response as InpectResponse)
      }).catch(reject)
    })
  }

  start (detachKeys?: string): Promise<DockerResponse>  {
    return new Promise((resolve, reject) => {
      Docker.getConnection().post(`/containers/${this.id}/start`, {
        detachKeys: detachKeys
      }).then((response: DockerResponse) => {
        resolve(response)
      }).catch(reject)
    })
  }

  pause (): Promise<DockerResponse> {
    return new Promise((resolve, reject) => {
      Docker.getConnection().post(`/containers/${this.id}/pause`).then((response: DockerResponse) => {
        resolve(response)
      }).catch(reject)
    })
  }

  unpause (): Promise<DockerResponse> {
    return new Promise((resolve, reject) => {
      Docker.getConnection().post(`/containers/${this.id}/unpause`).then((response: DockerResponse) => {
        resolve(response)
      }).catch(reject)
    })
  }

  resume (): Promise<DockerResponse> {
    return this.unpause()
  }

  stop (interval?: number): Promise<DockerResponse> {
    return new Promise((resolve, reject) => {
      Docker.getConnection().post(`/containers/${this.id}/stop`, {
        t: interval
      }).then((response: DockerResponse) => {
        resolve(response)
      }).catch(reject)
    })
  }

  kill (signal?: string): Promise<DockerResponse> {
    return new Promise((resolve, reject) => {
      Docker.getConnection().post(`/containers/${this.id}/kill`, {
        signal: signal
      }).then((response: DockerResponse) => {
        resolve(response)
      }).catch(reject)
    })
  }

  delete (query?: DeleteQuery): Promise<DockerResponse> {
    return new Promise((resolve, reject) => {
      Docker.getConnection().delete(`/containers/${this.id}`, query).then((response: DockerResponse) => {
        resolve(response)
      }).catch(reject)
    })
  }

  attach () {
    return new Promise((resolve, reject) => {
      Docker.getConnection().post(`/containers/${this.id}/attach`)
    })
  }

  exec (cmd?: Array<string>, createBody: ExecCreateBody = {}, startBody: ExecStartBody = {}): Promise<string> {
    return new Promise((resolve, reject) => {
      Exec.create(this.id, Object.assign({
        AttachStdout: true,
        Cmd: cmd
      }, createBody)).then((exec: Exec) => {
        exec.start(Object.assign({
          Tty: true
        }, startBody)).then((response: DockerResponse) => {
          resolve(response.data)
        }).catch(reject)
      }).catch(reject)
    })
  }

}

export interface ListQuery {
  all?: boolean
  limit?: number
  size?: boolean
  filters?: ListQueryFilters | string
}

export interface ListQueryFilters {
  ancestor?: Array<string>
  before?: Array<string>
  expose?: Array<string>
  exited?: Array<string>
  health?: Array<Health>
  id?: Array<string>
  isolation?: Array<Isolation>
  'is-task'?: Array<string>
  label?: Array<string>
  name?: Array<string>
  network?: Array<string>
  publish?: Array<string>
  since?: Array<string>
  status?: Array<Status>
  volume?: Array<string>
}

export interface ListResponse extends DockerResponse {
  data: [{
    Id: string
    Names: Array<string>
    Image: string
    ImageID: string
    Command: string
    Created: number
    Ports: [{
      IP?: string
      PrivatePort: number
      PublicPort?: number
      Type: NetworkProtocol
    }]
    SizeRw?: number
    SizeRootFs?: number
    Labels: object
    State: string
    Status: string
    HostConfig: {
      NetworkMode: string
    }
    NetworkSettings: {
      Networks: EndpointsConfig
    }
    Mounts: [Mount]
  }]
}

export interface CreateQuery {
  name?: string
}

export interface CreateBody extends ContainerConfig {
}

export interface ContainerConfig {
  Hostname?: string
  Domainname?: string
  User?: string
  AttachStdin?: boolean
  AttachStdout?: boolean
  AttachStderr?: boolean
  ExposedPorts?: {[expose: string]: object}
  Tty?: boolean
  OpenStdin?: boolean
  StdinOnce?: boolean
  Env?: Array<string>
  Cmd?: Array<string>
  Healthcheck?: HealthConfig
  ArgsEscaped?: boolean
  Image?: string
  Volumes?: {[location: string]: object}
  WorkingDir?: string
  Entrypoint?: Array<string>
  NetworkDisabled?: boolean
  MacAddress?: string
  OnBuild?: Array<string>
  Labels?: object
  StopSignal?: string
  StopTimeout?: number
  Shell?: Array<string>
  HostConfig?: HostConfig
  NetworkingConfig?: NetworkingConfig
}

export interface CreateResponse extends DockerResponse {
  data: {
    Id: string
    Warnings: Array<string>
  }
}

export interface HealthConfig {
  Test?: Array<string>
  Interval?: number
  Timeout?: number
  Retries?: number
  StartPeriod?: number
}

export interface HostConfig {
  CpuShares?: number
  Memory?: number
  CgroupParent?: string
  BlkioWeight?: number
  BlkioWeightDevice?: Array<BlkioWeightDevice>
  BlkioDeviceReadBps?: Array<ThrottleDevice>
  BlkioDeviceWriteBps?: Array<ThrottleDevice>
  BlkioDeviceReadIOps?: Array<ThrottleDevice>
  BlkioDeviceWriteIOps?: Array<ThrottleDevice>
  CpuPeriod?: number
  CpuQuota?: number
  CpuRealtimePeriod?: number
  CpuRealtimeRuntime?: number
  CpusetCpus?: string
  CpusetMems?: string
  Devices?: Array<DeviceMapping>
  DeviceCgroupRules?: string
  DiskQuota?: number
  KernelMemory?: number
  MemoryReservation?: number
  MemorySwap?: number
  MemorySwappiness?: number
  NanoCPUs?: number
  OomKillDisable?: boolean
  Init?: boolean | null
  PidsLimit?: number
  Ulimits?: Array<Ulimit>
  CpuCount?: number
  CpuPercent?: number
  IOMaximumIOps?: number
  IOMaximumBandwidth?: number
  Binds?: Array<string>
  ContainerIDFile?: string
  LogConfig?: LogConfig
  NetworkMode?: string
  PortBindings?: PortMap
  RestartPolicy?: RestartPolicy
  AutoRemove?: boolean
  VolumeDriver?: string
  VolumesFrom?: Array<string>
  Mounts?: Array<Mount>
  CapAdd?: Array<string>
  CapDrop?: Array<string>
  Dns?: Array<string>
  DnsOptions?: Array<string>
  DnsSearch?: Array<string>
  ExtraHosts?: Array<string>
  GroupAdd?: Array<string>
  IpcMode?: IpcMode | string
  Cgroup?: string
  Links?: Array<string>
  OomScoreAdj?: number
  PidMode?: string
  Privileged?: boolean
  PublishAllPorts?: boolean
  ReadonlyRootfs?: boolean
  SecurityOpt?: Array<string>
  StorageOpt?: object
  Tmpfs?: object
  UTSMode?: string
  UsernsMode?: string
  ShmSize?: number
  Sysctls?: object
  Runtime?: string
  ConsoleSize?: number
  Isolation?: Isolation
  MaskedPaths?: Array<string>
  ReadonlyPaths?: Array<string>
}

export interface BlkioWeightDevice {
  Path: string
  Weight: number
}

export interface ThrottleDevice {
  Path: string
  Rate: number
}

export interface DeviceMapping {
  PathOnHost: string
  PathInContainer: string
  CgroupPermissions: string
}

export interface Ulimit {
  Name: string
  Soft: number
  Hard: number
}

export interface LogConfig {
  Type: LogConfigType,
  Config: object
}

export enum LogConfigType {
  JSON_FILE = "json-file",
  SYSLOG = "syslog",
  JOURNALD = "journald",
  GELF = "gelf",
  FLUENTD = "fluentd",
  AWSLOGS = "awslogs",
  SPLUNK = "splunk",
  ETWLOGS = "etwlogs",
  NONE = "none"
}

export type PortMap = {[portAndProtocol: string]: Array<PortBinding>}
export interface PortBinding {
  HostIp: string
  HostPort: string
}

export interface RestartPolicy {
  Name: RestartPolicyName
  MaximumRetryCount: number
}

export enum RestartPolicyName {
  EMPTY = "",
  ALWAYS = "always",
  UNLESS_STOPPED = "unless-stopped",
  ON_FAILURE = "on-failure"
}

export interface Mount {
  Target: string
  Source: string
  Type: MountType
  ReadOnly: boolean
  Consistency: MountConsistency
  BindOptions?: BindOptions
  VolumeOptions?: VolumeOptions
  TmpfsOptions?: TmpfsOptions
}

export enum MountType {
  BIND = "bind",
  VOLUME = "volume",
  TMPFS = "tmpfs"
}

export enum MountConsistency {
  DEFAULT = "default",
  CONSISTENT = "consistent",
  CACHED = "cached",
  DELEGATED = "delegated"
}

export interface VolumeOptions {
  NoCopy: boolean
  Labels: object
  DriverConfig: DriverConfig
}

export interface BindOptions {
  Propagation: BindOptionPropagation
}

export enum BindOptionPropagation {
  PRIVATE = "private",
  RPRIVATE = "rprivate",
  SHARED = "shared",
  RSHARED = "rshared",
  SLAVE = "slave",
  RSLAVE = "rslave"
}

export interface DriverConfig {
  Name: string
  Options: object
}

export interface TmpfsOptions {
  SizeBytes: number
  Mode: number
}

export enum IpcMode {
  NONE = "none",
  PRIVATE = "private",
  SHAREABLE = "shareable",
  HOST = "host"
}

export enum Isolation {
  DEFAULT = "default",
  PROCESS = "process",
  HYPERV = "hyperv"
}

export interface NetworkingConfig {
  EndpointsConfig: EndpointsConfig
}

export type EndpointsConfig = {[portAndProtocol: string]: EndpointSettings}

export interface EndpointSettings {
  IPAMConfig: EndpointIPAMConfig | null
  Links?: Array<string>
  Aliases?: Array<string>
  NetworkID?: string
  EndpointID?: string
  Gateway?: string
  IPAddress?: string
  IPPrefixLen?: number
  IPv6Gateway?: string
  GlobalIPv6Address?: string
  GlobalIPv6PrefixLen?: number
  MacAddress?: string
  DriverOpts?: object | null
}

export interface EndpointIPAMConfig {
  IPv4Address?: string
  IPv6Address?: string
  LinkLocalIPs?: Array<string>
}

export enum NetworkProtocol {
  TCP = "tcp",
  UDP = "udp",
  SCTP = "sctp"
}

export enum Status {
  CREATED = "created",
  RESTARTING = "restarting",
  RUNNING = "running",
  REMOVING = "removing",
  PAUSED = "paused",
  EXITED = "exited",
  DEAD = "dead"
}

export enum Health {
  STARTING = "starting",
  HEALTHY = "healthy",
  UNHEALTHY = "unhealthy",
  NONE = "none"
}

export interface InspectQuery {
  size?: boolean
}

export interface InpectResponse extends DockerResponse {
  data: {
    Id: string
    Created: string
    Path: string
    Args: Array<string>
    State: State
    Image: string
    ResolvConfPath: string
    HostnamePath: string
    HostsPath: string
    LogPath: string
    Node: object
    Name: string
    RestartCount: number
    Driver: string
    MountLabel: string
    ProcessLabel: string
    AppArmorProfile: string
    ExecIDs: Array<string> | null
    HostConfig: HostConfig
    GraphDriver: GraphDriverData
    SizeRw: number
    SizeRootFs: number
    Mounts: [MountPoint]
    Config: ContainerConfig
    NetworkSettings: NetworkSettings
  }
}

export interface State {
  Status: Status
  Running: boolean
  Paused: boolean
  Restarting: boolean
  OOMKilled: boolean
  Dead: boolean
  Pid: number
  ExitCode: number
  Error: string
  StartedAt: string
  FinishedAt: string
}

export interface GraphDriverData {
  Name: string
  Data: object
}

export interface MountPoint {
  Type: string
  Name: string
  Source: string
  Destination: string
  Driver: string
  Mode: string
  RW: boolean
  Propagation: string
}

export interface NetworkSettings {
  Bridge: string
  SandboxID: string
  HairpinMode: boolean
  LinkLocalIPv6Address: string
  LinkLocalIPv6PrefixLen: number
  Ports: PortMap
  SandboxKey: string
  SecondaryIPAddresses?: [Address] | null
  SecondaryIPv6Addresses?: [Address] | null
  EndpointID?: string // Deprecated
  Gateway?: string // Deprecated
  GlobalIPv6Address?: string // Deprecated
  GlobalIPv6PrefixLen?: number // Deprecated
  IPAddress?: string // Deprecated
  IPPrefixLen?: number // Deprecated
  IPv6Gateway?: string // Deprecated
  MacAddress?: string // Deprecated
  Networks: EndpointsConfig
}

export interface Address {
  Addr: string
  PrefixLen: number
}

export interface DeleteQuery {
  v?: boolean
  force?: boolean
  link?: boolean
}
