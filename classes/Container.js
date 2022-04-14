"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var Docker_1 = __importDefault(require("./Docker"));
var Exec_1 = __importDefault(require("./Exec"));
var _ = __importStar(require("lodash"));
var Container = /** @class */ (function () {
    function Container(id) {
        this.id = id;
    }
    Container.list = function (query) {
        if (query === void 0) { query = {}; }
        if (typeof query.filters !== 'string') {
            query.filters = JSON.stringify(query.filters);
        }
        return new Promise(function (resolve, reject) {
            Docker_1["default"].getConnection().get('/containers/json', query).then(function (response) {
                var containers = [];
                response.data.forEach(function (value) {
                    containers.push(new Container(value.Id));
                });
                resolve(containers);
            })["catch"](reject);
        });
    };
    Container.create = function (image, name, body) {
        body = _.merge(body, {
            Image: image
        });
        return new Promise(function (resolve, reject) {
            Docker_1["default"].getConnection().post('/containers/create', {
                name: name
            }, body).then(function (response) {
                resolve(new Container(response.data.Id));
            })["catch"](reject);
        });
    };
    Container.prototype.inspect = function (query) {
        var _this = this;
        if (query === void 0) { query = {}; }
        return new Promise(function (resolve, reject) {
            Docker_1["default"].getConnection().get("/containers/" + _this.id + "/json", query).then(function (response) {
                resolve(response);
            })["catch"](reject);
        });
    };
    Container.prototype.start = function (detachKeys) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            Docker_1["default"].getConnection().post("/containers/" + _this.id + "/start", {
                detachKeys: detachKeys
            }).then(function (response) {
                resolve(response);
            })["catch"](reject);
        });
    };
    Container.prototype.pause = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            Docker_1["default"].getConnection().post("/containers/" + _this.id + "/pause").then(function (response) {
                resolve(response);
            })["catch"](reject);
        });
    };
    Container.prototype.unpause = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            Docker_1["default"].getConnection().post("/containers/" + _this.id + "/unpause").then(function (response) {
                resolve(response);
            })["catch"](reject);
        });
    };
    Container.prototype.resume = function () {
        return this.unpause();
    };
    Container.prototype.stop = function (interval) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            Docker_1["default"].getConnection().post("/containers/" + _this.id + "/stop", {
                t: interval
            }).then(function (response) {
                resolve(response);
            })["catch"](reject);
        });
    };
    Container.prototype.kill = function (signal) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            Docker_1["default"].getConnection().post("/containers/" + _this.id + "/kill", {
                signal: signal
            }).then(function (response) {
                resolve(response);
            })["catch"](reject);
        });
    };
    Container.prototype["delete"] = function (query) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            Docker_1["default"].getConnection()["delete"]("/containers/" + _this.id, query).then(function (response) {
                resolve(response);
            })["catch"](reject);
        });
    };
    Container.prototype.attach = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            Docker_1["default"].getConnection().post("/containers/" + _this.id + "/attach");
        });
    };
    Container.prototype.exec = function (cmd, createBody, startBody) {
        var _this = this;
        if (createBody === void 0) { createBody = {}; }
        if (startBody === void 0) { startBody = {}; }
        return new Promise(function (resolve, reject) {
            Exec_1["default"].create(_this.id, Object.assign({
                AttachStdout: true,
                Cmd: cmd
            }, createBody)).then(function (exec) {
                exec.start(Object.assign({
                    Tty: true
                }, startBody)).then(function (response) {
                    resolve(response.data);
                })["catch"](reject);
            })["catch"](reject);
        });
    };
    return Container;
}());
exports["default"] = Container;
var LogConfigType;
(function (LogConfigType) {
    LogConfigType["JSON_FILE"] = "json-file";
    LogConfigType["SYSLOG"] = "syslog";
    LogConfigType["JOURNALD"] = "journald";
    LogConfigType["GELF"] = "gelf";
    LogConfigType["FLUENTD"] = "fluentd";
    LogConfigType["AWSLOGS"] = "awslogs";
    LogConfigType["SPLUNK"] = "splunk";
    LogConfigType["ETWLOGS"] = "etwlogs";
    LogConfigType["NONE"] = "none";
})(LogConfigType = exports.LogConfigType || (exports.LogConfigType = {}));
var RestartPolicyName;
(function (RestartPolicyName) {
    RestartPolicyName["EMPTY"] = "";
    RestartPolicyName["ALWAYS"] = "always";
    RestartPolicyName["UNLESS_STOPPED"] = "unless-stopped";
    RestartPolicyName["ON_FAILURE"] = "on-failure";
})(RestartPolicyName = exports.RestartPolicyName || (exports.RestartPolicyName = {}));
var MountType;
(function (MountType) {
    MountType["BIND"] = "bind";
    MountType["VOLUME"] = "volume";
    MountType["TMPFS"] = "tmpfs";
})(MountType = exports.MountType || (exports.MountType = {}));
var MountConsistency;
(function (MountConsistency) {
    MountConsistency["DEFAULT"] = "default";
    MountConsistency["CONSISTENT"] = "consistent";
    MountConsistency["CACHED"] = "cached";
    MountConsistency["DELEGATED"] = "delegated";
})(MountConsistency = exports.MountConsistency || (exports.MountConsistency = {}));
var BindOptionPropagation;
(function (BindOptionPropagation) {
    BindOptionPropagation["PRIVATE"] = "private";
    BindOptionPropagation["RPRIVATE"] = "rprivate";
    BindOptionPropagation["SHARED"] = "shared";
    BindOptionPropagation["RSHARED"] = "rshared";
    BindOptionPropagation["SLAVE"] = "slave";
    BindOptionPropagation["RSLAVE"] = "rslave";
})(BindOptionPropagation = exports.BindOptionPropagation || (exports.BindOptionPropagation = {}));
var IpcMode;
(function (IpcMode) {
    IpcMode["NONE"] = "none";
    IpcMode["PRIVATE"] = "private";
    IpcMode["SHAREABLE"] = "shareable";
    IpcMode["HOST"] = "host";
})(IpcMode = exports.IpcMode || (exports.IpcMode = {}));
var Isolation;
(function (Isolation) {
    Isolation["DEFAULT"] = "default";
    Isolation["PROCESS"] = "process";
    Isolation["HYPERV"] = "hyperv";
})(Isolation = exports.Isolation || (exports.Isolation = {}));
var NetworkProtocol;
(function (NetworkProtocol) {
    NetworkProtocol["TCP"] = "tcp";
    NetworkProtocol["UDP"] = "udp";
    NetworkProtocol["SCTP"] = "sctp";
})(NetworkProtocol = exports.NetworkProtocol || (exports.NetworkProtocol = {}));
var Status;
(function (Status) {
    Status["CREATED"] = "created";
    Status["RESTARTING"] = "restarting";
    Status["RUNNING"] = "running";
    Status["REMOVING"] = "removing";
    Status["PAUSED"] = "paused";
    Status["EXITED"] = "exited";
    Status["DEAD"] = "dead";
})(Status = exports.Status || (exports.Status = {}));
var Health;
(function (Health) {
    Health["STARTING"] = "starting";
    Health["HEALTHY"] = "healthy";
    Health["UNHEALTHY"] = "unhealthy";
    Health["NONE"] = "none";
})(Health = exports.Health || (exports.Health = {}));
