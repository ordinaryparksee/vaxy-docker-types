"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
// Miner
var vaxy_http_types_1 = __importStar(require("vaxy-http-types"));
var Docker = /** @class */ (function (_super) {
    __extends(Docker, _super);
    function Docker(options) {
        var _this = _super.call(this, options) || this;
        _this.options.headers = Object.assign({
            'content-type': 'application/json'
        }, _this.options.headers);
        if (!_this.options.socketPath) {
            _this.options.socketPath = '/var/run/docker.sock';
        }
        return _this;
    }
    Docker.connect = function (options) {
        Docker.client = new Docker(options);
        return Docker.client;
    };
    Docker.getConnection = function () {
        if (!Docker.client) {
            throw Error('No available connection. you must call `Docker.connect()` at the first');
        }
        return Docker.client;
    };
    Docker.prototype.request = function (method, entrypoint, query, data, options, attach) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _super.prototype.request.call(_this, method, entrypoint, query, data, options, attach).then(function (response) {
                resolve(response);
            })["catch"](reject);
        });
    };
    Docker.prototype.get = function (entrypoint, query, options, attach) {
        return this.request('GET', entrypoint, query, undefined, options, attach);
    };
    Docker.prototype.post = function (entrypoint, query, data, options, attach) {
        return this.request('POST', entrypoint, query, data, options, attach);
    };
    Docker.prototype.put = function (entrypoint, query, data, options, attach) {
        return this.request('PUT', entrypoint, query, data, options, attach);
    };
    Docker.prototype["delete"] = function (entrypoint, query, data, options, attach) {
        return this.request('DELETE', entrypoint, query, data, options, attach);
    };
    return Docker;
}(vaxy_http_types_1["default"]));
exports["default"] = Docker;
var DockerResponse = /** @class */ (function (_super) {
    __extends(DockerResponse, _super);
    function DockerResponse() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DockerResponse;
}(vaxy_http_types_1.HttpResponse));
exports.DockerResponse = DockerResponse;
