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
exports.AwsElevenlabsService = void 0;
var common_1 = require("@nestjs/common");
var http_service_1 = require("../../../common/http/http.service");
/**
 * ElevenLabs Service
 * Integración con ElevenLabs para text-to-speech de alta calidad
 */
var AwsElevenlabsService = /** @class */ (function () {
    function AwsElevenlabsService(httpService) {
        this.httpService = httpService;
        this.logger = new common_1.Logger(AwsElevenlabsService_1.name);
        this.mockMode = !process.env.ELEVENLABS_API_KEY;
        this.apiKey = process.env.ELEVENLABS_API_KEY || 'mock-key';
        this.baseUrl = 'https://api.elevenlabs.io/v1';
    }
    AwsElevenlabsService_1 = AwsElevenlabsService;
    /**
     * Convertir texto a audio usando ElevenLabs
     */
    AwsElevenlabsService.prototype.textToSpeech = function (text_1) {
        return __awaiter(this, arguments, void 0, function (text, voiceId, // Adam voice
        options) {
            var data, audioBuffer, audioUrl, duration, error_1;
            if (voiceId === void 0) { voiceId = 'pNInz6obpgDQGcFmaJgB'; }
            if (options === void 0) { options = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.mockMode) {
                            return [2 /*return*/, this.mockTextToSpeech(text, voiceId)];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.httpService.post("".concat(this.baseUrl, "/text-to-speech/").concat(voiceId), {
                                text: text,
                                model_id: 'eleven_multilingual_v2',
                                voice_settings: {
                                    stability: options.stability || 0.5,
                                    similarity_boost: options.similarityBoost || 0.5,
                                    style: options.style || 0.0,
                                    use_speaker_boost: options.useSpeakerBoost || true,
                                },
                            }, {
                                headers: {
                                    'Accept': 'audio/mpeg',
                                    'xi-api-key': this.apiKey,
                                },
                                responseType: 'arraybuffer',
                            })];
                    case 2:
                        data = (_a.sent()).data;
                        audioBuffer = data;
                        return [4 /*yield*/, this.uploadAudioToS3(audioBuffer, voiceId)];
                    case 3:
                        audioUrl = _a.sent();
                        duration = this.estimateDuration(text);
                        return [2 /*return*/, {
                                audioUrl: audioUrl,
                                duration: duration,
                                voiceId: voiceId,
                                language: 'es',
                            }];
                    case 4:
                        error_1 = _a.sent();
                        this.logger.error('Error in ElevenLabs text-to-speech:', error_1);
                        return [2 /*return*/, this.mockTextToSpeech(text, voiceId)];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Generar audio del PEI completo
     */
    AwsElevenlabsService.prototype.generatePeiAudio = function (peiId, peiContent) {
        return __awaiter(this, void 0, void 0, function () {
            var sections, sectionAudios, _i, sections_1, section, audio, fullAudio, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.mockMode) {
                            return [2 /*return*/, this.mockGeneratePeiAudio(peiId, peiContent)];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        sections = this.splitPeiIntoSections(peiContent);
                        sectionAudios = [];
                        _i = 0, sections_1 = sections;
                        _a.label = 2;
                    case 2:
                        if (!(_i < sections_1.length)) return [3 /*break*/, 5];
                        section = sections_1[_i];
                        return [4 /*yield*/, this.textToSpeech(section.content, 'pNInz6obpgDQGcFmaJgB')];
                    case 3:
                        audio = _a.sent();
                        sectionAudios.push({
                            title: section.title,
                            audioUrl: audio.audioUrl,
                            duration: audio.duration,
                        });
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [4 /*yield*/, this.textToSpeech(peiContent, 'pNInz6obpgDQGcFmaJgB')];
                    case 6:
                        fullAudio = _a.sent();
                        return [2 /*return*/, {
                                audioUrl: fullAudio.audioUrl,
                                duration: fullAudio.duration,
                                sections: sectionAudios,
                            }];
                    case 7:
                        error_2 = _a.sent();
                        this.logger.error('Error generating PEI audio:', error_2);
                        return [2 /*return*/, this.mockGeneratePeiAudio(peiId, peiContent)];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Obtener voces disponibles
     */
    AwsElevenlabsService.prototype.getAvailableVoices = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.mockMode) {
                            return [2 /*return*/, this.mockGetAvailableVoices()];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.httpService.get("".concat(this.baseUrl, "/voices"), {
                                headers: {
                                    'Accept': 'application/json',
                                    'xi-api-key': this.apiKey,
                                },
                            })];
                    case 2:
                        data = (_a.sent()).data;
                        return [2 /*return*/, data.voices.map(function (voice) {
                                var _a, _b, _c;
                                return ({
                                    voiceId: voice.voice_id,
                                    name: voice.name,
                                    language: ((_a = voice.labels) === null || _a === void 0 ? void 0 : _a.language) || 'es',
                                    gender: ((_b = voice.labels) === null || _b === void 0 ? void 0 : _b.gender) || 'neutral',
                                    description: ((_c = voice.labels) === null || _c === void 0 ? void 0 : _c.description) || voice.name,
                                });
                            })];
                    case 3:
                        error_3 = _a.sent();
                        this.logger.error('Error getting available voices:', error_3);
                        return [2 /*return*/, this.mockGetAvailableVoices()];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Métodos mock para desarrollo
    AwsElevenlabsService.prototype.mockTextToSpeech = function (text, voiceId) {
        var duration = this.estimateDuration(text);
        return {
            audioUrl: "https://mock-elevenlabs.s3.amazonaws.com/audio-".concat(Date.now(), ".mp3"),
            duration: duration,
            voiceId: voiceId,
            language: 'es',
        };
    };
    AwsElevenlabsService.prototype.mockGeneratePeiAudio = function (peiId, peiContent) {
        var duration = this.estimateDuration(peiContent);
        return {
            audioUrl: "https://mock-elevenlabs.s3.amazonaws.com/pei-".concat(peiId, ".mp3"),
            duration: duration,
            sections: [
                {
                    title: 'Resumen Ejecutivo',
                    audioUrl: "https://mock-elevenlabs.s3.amazonaws.com/pei-".concat(peiId, "-section-1.mp3"),
                    duration: Math.floor(duration * 0.3),
                },
                {
                    title: 'Objetivos',
                    audioUrl: "https://mock-elevenlabs.s3.amazonaws.com/pei-".concat(peiId, "-section-2.mp3"),
                    duration: Math.floor(duration * 0.4),
                },
                {
                    title: 'Adaptaciones',
                    audioUrl: "https://mock-elevenlabs.s3.amazonaws.com/pei-".concat(peiId, "-section-3.mp3"),
                    duration: Math.floor(duration * 0.3),
                },
            ],
        };
    };
    AwsElevenlabsService.prototype.mockGetAvailableVoices = function () {
        return [
            {
                voiceId: 'pNInz6obpgDQGcFmaJgB',
                name: 'Adam',
                language: 'es',
                gender: 'male',
                description: 'Voz masculina profesional',
            },
            {
                voiceId: 'EXAVITQu4vr4xnSDxMaL',
                name: 'Bella',
                language: 'es',
                gender: 'female',
                description: 'Voz femenina cálida',
            },
        ];
    };
    AwsElevenlabsService.prototype.uploadAudioToS3 = function (audioBuffer, voiceId) {
        return __awaiter(this, void 0, void 0, function () {
            var key;
            return __generator(this, function (_a) {
                key = "audio/elevenlabs-".concat(Date.now(), "-").concat(voiceId, ".mp3");
                return [2 /*return*/, "https://neuroplan-audio.s3.amazonaws.com/".concat(key)];
            });
        });
    };
    AwsElevenlabsService.prototype.estimateDuration = function (text) {
        // Estimación: ~150 palabras por minuto
        var words = text.split(' ').length;
        return Math.ceil((words / 150) * 60);
    };
    AwsElevenlabsService.prototype.splitPeiIntoSections = function (content) {
        // Dividir el PEI en secciones lógicas
        var sections = [];
        var lines = content.split('\n');
        var currentSection = { title: 'Resumen', content: '' };
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            if (line.includes('OBJETIVOS') || line.includes('ADAPTACIONES') || line.includes('EVALUACIÓN')) {
                if (currentSection.content.trim()) {
                    sections.push(currentSection);
                }
                currentSection = { title: line.trim(), content: line + '\n' };
            }
            else {
                currentSection.content += line + '\n';
            }
        }
        if (currentSection.content.trim()) {
            sections.push(currentSection);
        }
        return sections;
    };
    var AwsElevenlabsService_1;
    AwsElevenlabsService = AwsElevenlabsService_1 = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [http_service_1.HttpService])
    ], AwsElevenlabsService);
    return AwsElevenlabsService;
}());
exports.AwsElevenlabsService = AwsElevenlabsService;
