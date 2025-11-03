"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsS3Service = void 0;
var common_1 = require("@nestjs/common");
var AwsS3Service = /** @class */ (function () {
    function AwsS3Service() {
        this.mockMode = !process.env.AWS_S3_BUCKET;
        this.bucket = process.env.AWS_S3_BUCKET || 'neuroplan-demo-bucket';
    }
    /**
     * Upload file to AWS S3
     */
    AwsS3Service.prototype.uploadFile = function (fileBuffer_1, filename_1, mimetype_1) {
        return __awaiter(this, arguments, void 0, function (fileBuffer, filename, mimetype, folder) {
            if (folder === void 0) { folder = 'reports'; }
            return __generator(this, function (_a) {
                if (this.mockMode) {
                    return [2 /*return*/, this.mockUploadFile(filename, folder)];
                }
                // PRODUCTION: Real AWS S3 upload implementation
                // Requires: npm install @aws-sdk/client-s3
                // const s3 = new S3Client({ region: 'eu-west-1' });
                // const key = `${folder}/${Date.now()}-${filename}`;
                // const command = new PutObjectCommand({
                //   Bucket: this.bucket,
                //   Key: key,
                //   Body: fileBuffer,
                //   ContentType: mimetype,
                //   ServerSideEncryption: 'AES256'
                // });
                // const result = await s3.send(command);
                // const url = `https://${this.bucket}.s3.eu-west-1.amazonaws.com/${key}`;
                // return { url, key, bucket: this.bucket };
                return [2 /*return*/, this.mockUploadFile(filename, folder)];
            });
        });
    };
    /**
     * Get signed URL for temporary download
     */
    AwsS3Service.prototype.getSignedUrl = function (key_1) {
        return __awaiter(this, arguments, void 0, function (key, expiresIn) {
            if (expiresIn === void 0) { expiresIn = 3600; }
            return __generator(this, function (_a) {
                if (this.mockMode) {
                    return [2 /*return*/, this.mockGetSignedUrl(key)];
                }
                // PRODUCTION: Real AWS S3 signed URL generation
                // Requires: npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
                // const s3 = new S3Client({ region: 'eu-west-1' });
                // const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
                // return getSignedUrl(s3, command, { expiresIn });
                return [2 /*return*/, this.mockGetSignedUrl(key)];
            });
        });
    };
    /**
     * Delete file from S3
     */
    AwsS3Service.prototype.deleteFile = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.mockMode) {
                    return [2 /*return*/, true];
                }
                // PRODUCTION: Real AWS S3 deletion
                // Requires: npm install @aws-sdk/client-s3
                // const s3 = new S3Client({ region: 'eu-west-1' });
                // const command = new DeleteObjectCommand({ Bucket: this.bucket, Key: key });
                // await s3.send(command);
                // return true;
                return [2 /*return*/, false];
            });
        });
    };
    /**
     * List files in folder
     */
    AwsS3Service.prototype.listFiles = function (folder) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.mockMode) {
                    return [2 /*return*/, this.mockListFiles(folder)];
                }
                // PRODUCTION: Real AWS S3 list objects
                // Requires: npm install @aws-sdk/client-s3
                // const s3 = new S3Client({ region: 'eu-west-1' });
                // const command = new ListObjectsV2Command({ Bucket: this.bucket, Prefix: folder });
                // const result = await s3.send(command);
                // return result.Contents.map(item => ({
                //   key: item.Key,
                //   size: item.Size,
                //   lastModified: item.LastModified
                // }));
                return [2 /*return*/, this.mockListFiles(folder)];
            });
        });
    };
    // ========================================
    // MOCK IMPLEMENTATIONS
    // ========================================
    AwsS3Service.prototype.mockUploadFile = function (filename, folder) {
        var timestamp = Date.now();
        var key = "".concat(folder, "/").concat(timestamp, "-").concat(filename);
        var mockUrl = "https://".concat(this.bucket, ".s3.eu-west-1.amazonaws.com/").concat(key);
        return {
            url: mockUrl,
            key: key,
            bucket: this.bucket,
        };
    };
    AwsS3Service.prototype.mockGetSignedUrl = function (key) {
        return "https://".concat(this.bucket, ".s3.eu-west-1.amazonaws.com/").concat(key, "?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=MOCKKEY&X-Amz-Date=20251011T120000Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=mock-signature-").concat(Date.now());
    };
    AwsS3Service.prototype.mockListFiles = function (folder) {
        return [
            {
                key: "".concat(folder, "/1728648000000-informe-juan-perez.pdf"),
                size: 245678,
                lastModified: new Date('2025-10-10T10:30:00Z'),
            },
            {
                key: "".concat(folder, "/1728651600000-informe-maria-garcia.pdf"),
                size: 189234,
                lastModified: new Date('2025-10-10T12:15:00Z'),
            },
            {
                key: "".concat(folder, "/1728655200000-evaluacion-carlos-lopez.pdf"),
                size: 312456,
                lastModified: new Date('2025-10-10T14:45:00Z'),
            },
        ];
    };
    AwsS3Service = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [])
    ], AwsS3Service);
    return AwsS3Service;
}());
exports.AwsS3Service = AwsS3Service;
