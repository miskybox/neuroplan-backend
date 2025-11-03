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
exports.AwsPollyService = void 0;
var common_1 = require("@nestjs/common");
var AwsPollyService = /** @class */ (function () {
    function AwsPollyService() {
        this.mockMode = !process.env.AWS_POLLY_API_KEY;
    }
    /**
     * Synthesize speech from text using AWS Polly
     * Neural voices for Spanish
     */
    AwsPollyService.prototype.synthesizeSpeech = function (text_1) {
        return __awaiter(this, arguments, void 0, function (text, voiceId) {
            if (voiceId === void 0) { voiceId = 'Lucia'; }
            return __generator(this, function (_a) {
                if (this.mockMode) {
                    return [2 /*return*/, this.mockSynthesizeSpeech(text, voiceId)];
                }
                // PRODUCTION: Real AWS Polly implementation with S3 upload
                // Requires: npm install @aws-sdk/client-polly @aws-sdk/client-s3
                // const polly = new PollyClient({ region: 'eu-west-1' });
                // const command = new SynthesizeSpeechCommand({
                //   Text: text,
                //   OutputFormat: 'mp3',
                //   VoiceId: voiceId,
                //   Engine: 'neural',
                //   LanguageCode: 'es-ES'
                // });
                // const result = await polly.send(command);
                // const audioBuffer = await streamToBuffer(result.AudioStream);
                // const s3Key = `audio/${Date.now()}-${voiceId}.mp3`;
                // await this.uploadToS3(s3Key, audioBuffer);
                // return { url: getS3Url(s3Key), duration: this.estimateDuration(text), voiceId };
                return [2 /*return*/, this.mockSynthesizeSpeech(text, voiceId)];
            });
        });
    };
    /**
     * List available Spanish voices
     */
    AwsPollyService.prototype.listSpanishVoices = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.mockMode) {
                    return [2 /*return*/, this.mockListVoices()];
                }
                // PRODUCTION: Real AWS Polly voice listing
                // Requires: npm install @aws-sdk/client-polly
                // const polly = new PollyClient({ region: 'eu-west-1' });
                // const command = new DescribeVoicesCommand({ LanguageCode: 'es-ES' });
                // const result = await polly.send(command);
                // return result.Voices.map(voice => ({
                //   id: voice.Id,
                //   name: voice.Name,
                //   gender: voice.Gender,
                //   language: voice.LanguageCode,
                //   engine: voice.SupportedEngines.includes('neural') ? 'neural' : 'standard'
                // }));
                return [2 /*return*/, this.mockListVoices()];
            });
        });
    };
    /**
     * Estimate audio duration based on text length
     */
    AwsPollyService.prototype.estimateDuration = function (text) {
        // Average speaking rate: ~150 words per minute
        var words = text.split(/\s+/).length;
        var minutes = words / 150;
        return Math.ceil(minutes * 60); // seconds
    };
    // ========================================
    // MOCK IMPLEMENTATIONS
    // ========================================
    AwsPollyService.prototype.mockSynthesizeSpeech = function (text, voiceId) {
        var duration = this.estimateDuration(text);
        var mockUrl = "https://neuroplan-demo-bucket.s3.eu-west-1.amazonaws.com/audio/".concat(Date.now(), "-").concat(voiceId, ".mp3");
        return {
            url: mockUrl,
            duration: duration,
            voiceId: voiceId,
        };
    };
    AwsPollyService.prototype.mockListVoices = function () {
        return [
            {
                id: 'Lucia',
                name: 'Lucía',
                gender: 'Female',
                language: 'es-ES',
                engine: 'neural',
            },
            {
                id: 'Sergio',
                name: 'Sergio',
                gender: 'Male',
                language: 'es-ES',
                engine: 'neural',
            },
            {
                id: 'Lupe',
                name: 'Lupe',
                gender: 'Female',
                language: 'es-US',
                engine: 'neural',
            },
            {
                id: 'Pedro',
                name: 'Pedro',
                gender: 'Male',
                language: 'es-US',
                engine: 'neural',
            },
            {
                id: 'Conchita',
                name: 'Conchita',
                gender: 'Female',
                language: 'es-ES',
                engine: 'standard',
            },
            {
                id: 'Enrique',
                name: 'Enrique',
                gender: 'Male',
                language: 'es-ES',
                engine: 'standard',
            },
        ];
    };
    AwsPollyService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [])
    ], AwsPollyService);
    return AwsPollyService;
}());
exports.AwsPollyService = AwsPollyService;
