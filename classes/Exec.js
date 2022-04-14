"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var vaxy_http_types_1 = require("vaxy-http-types");
var Docker_1 = __importStar(require("./Docker"));
var Exec = /** @class */ (function () {
    function Exec(id) {
        this.id = id;
    }
    Exec.create = function (containerId, data) {
        return new Promise(function (resolve, reject) {
            Docker_1["default"].getConnection().post("/containers/" + containerId + "/exec", {}, data, {}, function (request, response) {
                var data = '';
                response.on('data', function (chunk) {
                    data += chunk;
                });
                response.on('end', function () {
                    var _response = new Docker_1.DockerResponse(response, data);
                    if (!_response.statusCode || _response.statusCode >= 400) {
                        reject(_response);
                    }
                    else {
                        resolve(new Exec(_response.data.Id));
                    }
                    request.end();
                });
            }).then(function (response) {
                resolve(new Exec(response.data.Id));
            })["catch"](reject);
        });
    };
    Exec.prototype.start = function (data) {
        var _this = this;
        if (data === void 0) { data = {}; }
        return new Promise(function (resolve, reject) {
            if (data.Tty) {
                Docker_1["default"].getConnection().post("/exec/" + _this.id + "/start", {}, data, {}).then(function (response) {
                    resolve(response);
                })["catch"](reject);
            }
            else {
                Docker_1["default"].getConnection().post("/exec/" + _this.id + "/start", {}, data, {}, function (request, response) {
                    var stdout = '';
                    var stderr = '';
                    response.on('data', function () {
                        var chunk;
                        while (chunk = response.read()) {
                            var size = (chunk[4] << 24) | (chunk[5] << 16) | (chunk[6] << 8) | chunk[7];
                            if (chunk[0] == 1) {
                                stdout += chunk.slice(8, 8 + size).toString();
                            }
                            if (chunk[0] == 2) {
                                stderr += chunk.slice(8, 8 + size).toString();
                            }
                        }
                    });
                    response.on('end', function () {
                        resolve(new vaxy_http_types_1.HttpResponse(response, stdout));
                    });
                });
            }
        });
    };
    return Exec;
}());
exports["default"] = Exec;
var StreamType;
(function (StreamType) {
    StreamType[StreamType["stdin"] = 0] = "stdin";
    StreamType[StreamType["stdout"] = 1] = "stdout";
    StreamType[StreamType["stderr"] = 2] = "stderr";
})(StreamType = exports.StreamType || (exports.StreamType = {}));
