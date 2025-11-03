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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.AwsController = void 0;
var common_1 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var swagger_1 = require("@nestjs/swagger");
var services_1 = require("./services");
var aws_elevenlabs_service_1 = require("./services/aws-elevenlabs.service");
var aws_n8n_service_1 = require("./services/aws-n8n.service");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var roles_guard_1 = require("../auth/guards/roles.guard");
var roles_decorator_1 = require("../auth/decorators/roles.decorator");
var AwsController = /** @class */ (function () {
    function AwsController(textractService, comprehendService, s3Service, pollyService, bedrockService, elevenlabsService, n8nService) {
        this.textractService = textractService;
        this.comprehendService = comprehendService;
        this.s3Service = s3Service;
        this.pollyService = pollyService;
        this.bedrockService = bedrockService;
        this.elevenlabsService = elevenlabsService;
        this.n8nService = n8nService;
    }
    // ========================================
    // AMAZON BEDROCK - LLM ORCHESTRATION (CRITICAL)
    // ========================================
    AwsController.prototype.invokeBedrock = function (prompt, maxTokens) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.bedrockService.invokeClaudeViaBedrock(prompt, {
                            maxTokens: maxTokens || 2000,
                            temperature: 0.7,
                        })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, {
                                status: 'success',
                                service: 'Amazon Bedrock',
                                model: result.model,
                                completion: result.completion,
                                usage: result.usage,
                                processing: {
                                    mode: process.env.AWS_BEDROCK_API_KEY ? 'real' : 'mock',
                                },
                            }];
                }
            });
        });
    };
    AwsController.prototype.generatePEIBedrock = function (reportData) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.bedrockService.generatePEIWithBedrock(reportData)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, {
                                status: 'success',
                                service: 'Amazon Bedrock',
                                model: result.model,
                                pei: result.pei,
                                processingTime: "".concat(result.processingTime, "ms"),
                            }];
                }
            });
        });
    };
    AwsController.prototype.simplifyContent = function (content, targetLevel) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.bedrockService.simplifyContent(content, targetLevel)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, {
                                status: 'success',
                                service: 'Amazon Bedrock',
                                simplifiedContent: result.simplifiedContent,
                                readabilityScore: result.readabilityScore,
                            }];
                }
            });
        });
    };
    AwsController.prototype.virtualTutorChat = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.bedrockService.virtualTutorChat(data.question, {
                            studentLevel: data.studentLevel,
                            currentTopic: data.currentTopic,
                            learningStyle: data.learningStyle,
                        })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, {
                                status: 'success',
                                service: 'Amazon Bedrock (Virtual Tutor)',
                                answer: result.answer,
                                suggestions: result.suggestions,
                            }];
                }
            });
        });
    };
    AwsController.prototype.listBedrockModels = function () {
        return __awaiter(this, void 0, void 0, function () {
            var models;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.bedrockService.listBedrockModels()];
                    case 1:
                        models = _a.sent();
                        return [2 /*return*/, {
                                status: 'success',
                                service: 'Amazon Bedrock',
                                models: models,
                                totalModels: models.length,
                                region: process.env.AWS_REGION || 'eu-west-1',
                            }];
                }
            });
        });
    };
    // ========================================
    // AWS TEXTRACT - OCR
    // ========================================
    AwsController.prototype.extractText = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.textractService.extractText(file.buffer)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, {
                                status: 'success',
                                service: 'AWS Textract',
                                extractedText: result.text,
                                confidence: result.confidence,
                                blocks: result.blocks,
                                words: result.words,
                                lines: result.lines,
                                processing: {
                                    mode: process.env.AWS_TEXTRACT_API_KEY ? 'real' : 'mock',
                                    timestamp: new Date().toISOString(),
                                },
                            }];
                }
            });
        });
    };
    AwsController.prototype.analyzeDocument = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.textractService.analyzeDocument(file.buffer)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, {
                                status: 'success',
                                service: 'AWS Textract (Analyze)',
                                text: result.text,
                                forms: result.forms,
                                tables: result.tables,
                                metadata: result.metadata,
                            }];
                }
            });
        });
    };
    // ========================================
    // AWS COMPREHEND MEDICAL - NLP
    // ========================================
    AwsController.prototype.detectMedicalEntities = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            var entities;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.comprehendService.detectMedicalEntities(text)];
                    case 1:
                        entities = _a.sent();
                        return [2 /*return*/, {
                                status: 'success',
                                service: 'AWS Comprehend Medical',
                                entities: {
                                    diagnoses: entities.diagnoses,
                                    medications: entities.medications,
                                    symptoms: entities.symptoms,
                                    procedures: entities.procedures,
                                    anatomy: entities.anatomy,
                                },
                                totalEntities: entities.total,
                                processing: {
                                    mode: process.env.AWS_COMPREHEND_API_KEY ? 'real' : 'mock',
                                },
                            }];
                }
            });
        });
    };
    AwsController.prototype.detectPHI = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            var phi;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.comprehendService.detectPHI(text)];
                    case 1:
                        phi = _a.sent();
                        return [2 /*return*/, {
                                status: 'success',
                                service: 'AWS Comprehend Medical (PHI)',
                                phi: {
                                    names: phi.names,
                                    dates: phi.dates,
                                    locations: phi.locations,
                                    ids: phi.ids,
                                },
                                sensitiveDataDetected: phi.hasSensitiveData,
                            }];
                }
            });
        });
    };
    // ========================================
    // AWS S3 - STORAGE
    // ========================================
    AwsController.prototype.uploadToS3 = function (file, folder) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.s3Service.uploadFile(file.buffer, file.originalname, file.mimetype, folder || 'reports')];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, {
                                status: 'success',
                                service: 'AWS S3',
                                url: result.url,
                                key: result.key,
                                bucket: result.bucket,
                                size: file.size,
                            }];
                }
            });
        });
    };
    AwsController.prototype.getDownloadUrl = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.s3Service.getSignedUrl(key)];
                    case 1:
                        url = _a.sent();
                        return [2 /*return*/, {
                                status: 'success',
                                service: 'AWS S3',
                                downloadUrl: url,
                                expiresIn: '1 hour',
                            }];
                }
            });
        });
    };
    // ========================================
    // AWS POLLY - TEXT-TO-SPEECH
    // ========================================
    AwsController.prototype.synthesizeSpeech = function (text_1) {
        return __awaiter(this, arguments, void 0, function (text, voiceId) {
            var audio;
            if (voiceId === void 0) { voiceId = 'Lucia'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pollyService.synthesizeSpeech(text, voiceId)];
                    case 1:
                        audio = _a.sent();
                        return [2 /*return*/, {
                                status: 'success',
                                service: 'AWS Polly',
                                audioFormat: 'mp3',
                                voiceId: voiceId,
                                language: 'es-ES',
                                audioUrl: audio.url, // Mock URL or real S3 URL
                                duration: audio.duration,
                            }];
                }
            });
        });
    };
    AwsController.prototype.listVoices = function () {
        return __awaiter(this, void 0, void 0, function () {
            var voices;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pollyService.listSpanishVoices()];
                    case 1:
                        voices = _a.sent();
                        return [2 /*return*/, {
                                status: 'success',
                                service: 'AWS Polly',
                                voices: voices,
                                totalVoices: voices.length,
                            }];
                }
            });
        });
    };
    // ========================================
    // INTEGRATION - COMPLETE FLOW
    // ========================================
    AwsController.prototype.processReport = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var s3Result, textResult, entities, phi;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.s3Service.uploadFile(file.buffer, file.originalname, file.mimetype, 'clinical-reports')];
                    case 1:
                        s3Result = _a.sent();
                        return [4 /*yield*/, this.textractService.extractText(file.buffer)];
                    case 2:
                        textResult = _a.sent();
                        return [4 /*yield*/, this.comprehendService.detectMedicalEntities(textResult.text)];
                    case 3:
                        entities = _a.sent();
                        return [4 /*yield*/, this.comprehendService.detectPHI(textResult.text)];
                    case 4:
                        phi = _a.sent();
                        return [2 /*return*/, {
                                status: 'success',
                                pipeline: 'AWS Complete Processing',
                                steps: {
                                    storage: {
                                        service: 'S3',
                                        url: s3Result.url,
                                        key: s3Result.key,
                                    },
                                    ocr: {
                                        service: 'Textract',
                                        confidence: textResult.confidence,
                                        wordsExtracted: textResult.words,
                                    },
                                    nlp: {
                                        service: 'Comprehend Medical',
                                        diagnoses: entities.diagnoses,
                                        medications: entities.medications,
                                        symptoms: entities.symptoms,
                                    },
                                    privacy: {
                                        service: 'Comprehend PHI',
                                        sensitiveDataDetected: phi.hasSensitiveData,
                                        phiTypes: Object.keys(phi).filter(function (k) { var _a; return ((_a = phi[k]) === null || _a === void 0 ? void 0 : _a.length) > 0; }),
                                    },
                                },
                                extractedText: textResult.text,
                                medicalData: entities,
                                timestamp: new Date().toISOString(),
                            }];
                }
            });
        });
    };
    // ========================================
    // HEALTH CHECK
    // ========================================
    AwsController.prototype.healthCheck = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, {
                        status: 'operational',
                        services: {
                            bedrock: {
                                enabled: true,
                                mode: process.env.AWS_BEDROCK_API_KEY ? 'real' : 'mock',
                                priority: 'CRITICAL',
                                description: 'LLM orchestration (Claude via Bedrock)',
                            },
                            textract: {
                                enabled: true,
                                mode: process.env.AWS_TEXTRACT_API_KEY ? 'real' : 'mock',
                                description: 'OCR for medical reports',
                            },
                            comprehend: {
                                enabled: true,
                                mode: process.env.AWS_COMPREHEND_API_KEY ? 'real' : 'mock',
                                description: 'Medical NLP + PHI detection',
                            },
                            s3: {
                                enabled: true,
                                mode: process.env.AWS_S3_BUCKET ? 'real' : 'mock',
                                description: 'Secure file storage',
                            },
                            polly: {
                                enabled: true,
                                mode: process.env.AWS_POLLY_API_KEY ? 'real' : 'mock',
                                description: 'Text-to-speech con AWS Polly',
                            },
                        },
                        architecture: {
                            compute: 'AWS Lambda (serverless)',
                            cdn: 'CloudFront',
                            orchestration: 'Amazon Q CLI',
                            future: 'Fire TV (Vega OS)',
                        },
                        region: process.env.AWS_REGION || 'eu-west-1',
                        timestamp: new Date().toISOString(),
                    }];
            });
        });
    };
    // ========================================
    // ELEVENLABS - TEXT TO SPEECH
    // ========================================
    AwsController.prototype.textToSpeech = function (body) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.elevenlabsService.textToSpeech(body.text, body.voiceId, body.options)];
            });
        });
    };
    AwsController.prototype.getAvailableVoices = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.elevenlabsService.getAvailableVoices()];
            });
        });
    };
    // ========================================
    // N8N - WORKFLOW AUTOMATION
    // ========================================
    AwsController.prototype.triggerWorkflow = function (body) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.n8nService.triggerWorkflow(body.workflowId, body.data, body.options)];
            });
        });
    };
    AwsController.prototype.getExecutions = function (workflowId_1) {
        return __awaiter(this, arguments, void 0, function (workflowId, limit) {
            if (limit === void 0) { limit = 50; }
            return __generator(this, function (_a) {
                return [2 /*return*/, this.n8nService.getExecutions(workflowId, limit)];
            });
        });
    };
    AwsController.prototype.getExecutionStatus = function (executionId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.n8nService.getExecutionStatus(executionId)];
            });
        });
    };
    __decorate([
        (0, common_1.Post)('bedrock/invoke'),
        (0, swagger_1.ApiOperation)({
            summary: 'Invoke Claude via Amazon Bedrock',
            description: 'AWS way to use LLMs - Foundation model orchestration',
        }),
        __param(0, (0, common_1.Body)('prompt')),
        __param(1, (0, common_1.Body)('maxTokens')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Number]),
        __metadata("design:returntype", Promise)
    ], AwsController.prototype, "invokeBedrock", null);
    __decorate([
        (0, common_1.Post)('bedrock/generate-pei'),
        (0, roles_decorator_1.Roles)('ADMIN', 'ORIENTADOR'),
        (0, swagger_1.ApiOperation)({
            summary: 'Generate PEI using Amazon Bedrock',
            description: 'Core NeuroPlan use case: PEI generation via Bedrock+Claude',
        }),
        __param(0, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], AwsController.prototype, "generatePEIBedrock", null);
    __decorate([
        (0, common_1.Post)('bedrock/simplify-content'),
        (0, swagger_1.ApiOperation)({
            summary: 'Simplify educational content via Bedrock',
            description: 'AWS use case: Content simplification for adaptive learning',
        }),
        __param(0, (0, common_1.Body)('content')),
        __param(1, (0, common_1.Body)('targetLevel')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String]),
        __metadata("design:returntype", Promise)
    ], AwsController.prototype, "simplifyContent", null);
    __decorate([
        (0, common_1.Post)('bedrock/tutor-chat'),
        (0, swagger_1.ApiOperation)({
            summary: 'Virtual tutor interaction via Bedrock',
            description: 'AWS use case: AI tutor for personalized learning',
        }),
        __param(0, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], AwsController.prototype, "virtualTutorChat", null);
    __decorate([
        (0, common_1.Get)('bedrock/models'),
        (0, swagger_1.ApiOperation)({
            summary: 'List available Bedrock foundation models',
            description: 'Show Claude, Titan, Jurassic-2, and other models',
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], AwsController.prototype, "listBedrockModels", null);
    __decorate([
        (0, common_1.Post)('textract/extract'),
        (0, swagger_1.ApiOperation)({
            summary: 'Extract text from document using AWS Textract',
            description: 'OCR processing for medical/educational reports',
        }),
        (0, swagger_1.ApiConsumes)('multipart/form-data'),
        (0, swagger_1.ApiBody)({
            schema: {
                type: 'object',
                properties: {
                    file: {
                        type: 'string',
                        format: 'binary',
                    },
                },
            },
        }),
        (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
        __param(0, (0, common_1.UploadedFile)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], AwsController.prototype, "extractText", null);
    __decorate([
        (0, common_1.Post)('textract/analyze-document'),
        (0, swagger_1.ApiOperation)({
            summary: 'Advanced document analysis with forms and tables',
            description: 'Extract structured data from complex documents',
        }),
        (0, swagger_1.ApiConsumes)('multipart/form-data'),
        (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
        __param(0, (0, common_1.UploadedFile)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], AwsController.prototype, "analyzeDocument", null);
    __decorate([
        (0, common_1.Post)('comprehend/detect-entities'),
        (0, swagger_1.ApiOperation)({
            summary: 'Detect medical entities using AWS Comprehend Medical',
            description: 'Extract diagnoses, medications, symptoms from text',
        }),
        __param(0, (0, common_1.Body)('text')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], AwsController.prototype, "detectMedicalEntities", null);
    __decorate([
        (0, common_1.Post)('comprehend/detect-phi'),
        (0, swagger_1.ApiOperation)({
            summary: 'Detect Protected Health Information (PHI)',
            description: 'Identify sensitive patient data for privacy compliance',
        }),
        __param(0, (0, common_1.Body)('text')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], AwsController.prototype, "detectPHI", null);
    __decorate([
        (0, common_1.Post)('s3/upload'),
        (0, roles_decorator_1.Roles)('ADMIN', 'ORIENTADOR'),
        (0, swagger_1.ApiOperation)({
            summary: 'Upload file to AWS S3',
            description: 'Store reports, PDFs, and generated documents',
        }),
        (0, swagger_1.ApiConsumes)('multipart/form-data'),
        (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
        __param(0, (0, common_1.UploadedFile)()),
        __param(1, (0, common_1.Body)('folder')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, String]),
        __metadata("design:returntype", Promise)
    ], AwsController.prototype, "uploadToS3", null);
    __decorate([
        (0, common_1.Get)('s3/download/:key'),
        (0, swagger_1.ApiOperation)({
            summary: 'Get signed URL for file download',
            description: 'Generate temporary download link',
        }),
        __param(0, (0, common_1.Param)('key')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], AwsController.prototype, "getDownloadUrl", null);
    __decorate([
        (0, common_1.Post)('polly/synthesize'),
        (0, swagger_1.ApiOperation)({
            summary: 'Convert text to speech using AWS Polly',
            description: 'Alternative TTS service with neural voices',
        }),
        __param(0, (0, common_1.Body)('text')),
        __param(1, (0, common_1.Body)('voiceId')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String]),
        __metadata("design:returntype", Promise)
    ], AwsController.prototype, "synthesizeSpeech", null);
    __decorate([
        (0, common_1.Get)('polly/voices'),
        (0, swagger_1.ApiOperation)({
            summary: 'List available Spanish voices',
            description: 'Get neural and standard voices for Spanish',
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], AwsController.prototype, "listVoices", null);
    __decorate([
        (0, common_1.Post)('process-report'),
        (0, roles_decorator_1.Roles)('ADMIN', 'ORIENTADOR'),
        (0, swagger_1.ApiOperation)({
            summary: 'Complete AWS pipeline for report processing',
            description: 'OCR → NLP → Storage → Analysis',
        }),
        (0, swagger_1.ApiConsumes)('multipart/form-data'),
        (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
        __param(0, (0, common_1.UploadedFile)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], AwsController.prototype, "processReport", null);
    __decorate([
        (0, common_1.Get)('health'),
        (0, swagger_1.ApiOperation)({
            summary: 'Check AWS services status',
            description: 'Verify all AWS integrations',
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], AwsController.prototype, "healthCheck", null);
    __decorate([
        (0, common_1.Post)('elevenlabs/text-to-speech'),
        (0, roles_decorator_1.Roles)('ADMIN', 'ORIENTADOR', 'PROFESOR', 'DIRECTOR_CENTRO', 'FAMILIA'),
        (0, swagger_1.ApiOperation)({
            summary: '🔊 Convertir texto a audio con ElevenLabs',
            description: 'Convierte texto a audio de alta calidad usando ElevenLabs',
        }),
        (0, swagger_1.ApiBody)({
            schema: {
                example: {
                    text: 'Este es el PEI de María García...',
                    voiceId: 'pNInz6obpgDQGcFmaJgB',
                    options: {
                        stability: 0.5,
                        similarityBoost: 0.5,
                    },
                },
            },
        }),
        __param(0, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], AwsController.prototype, "textToSpeech", null);
    __decorate([
        (0, common_1.Get)('elevenlabs/voices'),
        (0, roles_decorator_1.Roles)('ADMIN', 'ORIENTADOR', 'PROFESOR', 'DIRECTOR_CENTRO', 'FAMILIA'),
        (0, swagger_1.ApiOperation)({
            summary: '🎤 Obtener voces disponibles',
            description: 'Obtiene la lista de voces disponibles en ElevenLabs',
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], AwsController.prototype, "getAvailableVoices", null);
    __decorate([
        (0, common_1.Post)('n8n/trigger'),
        (0, roles_decorator_1.Roles)('ADMIN', 'ORIENTADOR'),
        (0, swagger_1.ApiOperation)({
            summary: '⚡ Ejecutar workflow de N8N',
            description: 'Ejecuta un workflow de automatización en N8N',
        }),
        (0, swagger_1.ApiBody)({
            schema: {
                example: {
                    workflowId: 'notification-workflow',
                    data: {
                        userId: 'clxxxxx',
                        message: 'PEI aprobado',
                    },
                    options: {
                        waitForCompletion: true,
                        timeout: 30000,
                    },
                },
            },
        }),
        __param(0, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], AwsController.prototype, "triggerWorkflow", null);
    __decorate([
        (0, common_1.Get)('n8n/executions'),
        (0, roles_decorator_1.Roles)('ADMIN', 'ORIENTADOR'),
        (0, swagger_1.ApiOperation)({
            summary: '📊 Obtener historial de ejecuciones',
            description: 'Obtiene el historial de ejecuciones de workflows de N8N',
        }),
        __param(0, (0, common_1.Param)('workflowId')),
        __param(1, (0, common_1.Param)('limit')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Number]),
        __metadata("design:returntype", Promise)
    ], AwsController.prototype, "getExecutions", null);
    __decorate([
        (0, common_1.Get)('n8n/executions/:executionId'),
        (0, roles_decorator_1.Roles)('ADMIN', 'ORIENTADOR'),
        (0, swagger_1.ApiOperation)({
            summary: '📈 Estado de ejecución',
            description: 'Obtiene el estado de una ejecución específica',
        }),
        __param(0, (0, common_1.Param)('executionId')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], AwsController.prototype, "getExecutionStatus", null);
    AwsController = __decorate([
        (0, swagger_1.ApiTags)('AWS Services'),
        (0, swagger_1.ApiBearerAuth)(),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        (0, common_1.Controller)('aws'),
        __metadata("design:paramtypes", [services_1.AwsTextractService,
            services_1.AwsComprehendService,
            services_1.AwsS3Service,
            services_1.AwsPollyService,
            services_1.AwsBedrockService,
            aws_elevenlabs_service_1.AwsElevenlabsService,
            aws_n8n_service_1.AwsN8nService])
    ], AwsController);
    return AwsController;
}());
exports.AwsController = AwsController;
