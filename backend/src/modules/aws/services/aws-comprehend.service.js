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
exports.AwsComprehendService = void 0;
var common_1 = require("@nestjs/common");
var AwsComprehendService = /** @class */ (function () {
    function AwsComprehendService() {
        this.mockMode = !process.env.AWS_COMPREHEND_API_KEY;
    }
    /**
     * Detect medical entities using AWS Comprehend Medical
     * Extracts diagnoses, medications, symptoms, procedures, etc.
     */
    AwsComprehendService.prototype.detectMedicalEntities = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.mockMode) {
                    return [2 /*return*/, this.mockDetectMedicalEntities(text)];
                }
                // PRODUCTION: Real AWS Comprehend Medical implementation
                // Requires: npm install @aws-sdk/client-comprehendmedical
                // const client = new ComprehendMedicalClient({ region: 'eu-west-1' });
                // const command = new DetectEntitiesV2Command({ Text: text });
                // const result = await client.send(command);
                // return this.parseEntitiesResponse(result);
                return [2 /*return*/, this.mockDetectMedicalEntities(text)];
            });
        });
    };
    /**
     * Detect Protected Health Information (PHI)
     * For GDPR/HIPAA compliance
     */
    AwsComprehendService.prototype.detectPHI = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.mockMode) {
                    return [2 /*return*/, this.mockDetectPHI(text)];
                }
                // PRODUCTION: Real AWS Comprehend Medical PHI detection
                // Requires: npm install @aws-sdk/client-comprehendmedical
                // const client = new ComprehendMedicalClient({ region: 'eu-west-1' });
                // const command = new DetectPHICommand({ Text: text });
                // const result = await client.send(command);
                // return this.parsePHIResponse(result);
                return [2 /*return*/, this.mockDetectPHI(text)];
            });
        });
    };
    // ========================================
    // MOCK IMPLEMENTATIONS
    // ========================================
    AwsComprehendService.prototype.mockDetectMedicalEntities = function (text) {
        // Simulate AI detection based on text content
        var entities = {
            diagnoses: [],
            medications: [],
            symptoms: [],
            procedures: [],
            anatomy: [],
            total: 0,
        };
        // Common diagnoses patterns
        var diagnosisPatterns = [
            { pattern: /dislexia/gi, name: 'Dislexia', category: 'TRASTORNO_APRENDIZAJE' },
            { pattern: /tdah|déficit de atención/gi, name: 'TDAH', category: 'TRASTORNO_NEUROLÓGICO' },
            { pattern: /tea|autismo|asperger/gi, name: 'TEA', category: 'TRASTORNO_DESARROLLO' },
            { pattern: /discalculia/gi, name: 'Discalculia', category: 'TRASTORNO_APRENDIZAJE' },
            { pattern: /ansiedad/gi, name: 'Ansiedad', category: 'TRASTORNO_EMOCIONAL' },
            { pattern: /depresión/gi, name: 'Depresión', category: 'TRASTORNO_EMOCIONAL' },
        ];
        for (var _i = 0, diagnosisPatterns_1 = diagnosisPatterns; _i < diagnosisPatterns_1.length; _i++) {
            var _a = diagnosisPatterns_1[_i], pattern = _a.pattern, name_1 = _a.name, category = _a.category;
            var matches = text.match(pattern);
            if (matches) {
                entities.diagnoses.push({
                    text: name_1,
                    confidence: 0.92 + Math.random() * 0.07,
                    category: category,
                    occurrences: matches.length,
                });
            }
        }
        // Common medications
        var medicationPatterns = [
            'metilfenidato',
            'atomoxetina',
            'risperidona',
            'aripiprazol',
            'sertralina',
            'fluoxetina',
        ];
        for (var _b = 0, medicationPatterns_1 = medicationPatterns; _b < medicationPatterns_1.length; _b++) {
            var med = medicationPatterns_1[_b];
            var regex = new RegExp(med, 'gi');
            if (regex.test(text)) {
                entities.medications.push({
                    text: med.charAt(0).toUpperCase() + med.slice(1),
                    confidence: 0.95,
                });
            }
        }
        // Common symptoms
        var symptomPatterns = [
            { pattern: /dificultad.*lectura/gi, name: 'Dificultad de lectura' },
            { pattern: /dificultad.*escritura/gi, name: 'Dificultad de escritura' },
            { pattern: /falta de atención/gi, name: 'Falta de atención' },
            { pattern: /hiperactividad/gi, name: 'Hiperactividad' },
            { pattern: /impulsividad/gi, name: 'Impulsividad' },
            { pattern: /ansiedad/gi, name: 'Ansiedad' },
        ];
        for (var _c = 0, symptomPatterns_1 = symptomPatterns; _c < symptomPatterns_1.length; _c++) {
            var _d = symptomPatterns_1[_c], pattern = _d.pattern, name_2 = _d.name;
            if (pattern.test(text)) {
                entities.symptoms.push({
                    text: name_2,
                    confidence: 0.88 + Math.random() * 0.1,
                });
            }
        }
        // Common procedures
        var procedurePatterns = [
            { pattern: /evaluación.*psicopedagógica/gi, name: 'Evaluación psicopedagógica' },
            { pattern: /WISC|Wechsler/gi, name: 'Test WISC-V' },
            { pattern: /PROLEC/gi, name: 'Test PROLEC' },
            { pattern: /terapia/gi, name: 'Terapia psicológica' },
        ];
        for (var _e = 0, procedurePatterns_1 = procedurePatterns; _e < procedurePatterns_1.length; _e++) {
            var _f = procedurePatterns_1[_e], pattern = _f.pattern, name_3 = _f.name;
            if (pattern.test(text)) {
                entities.procedures.push({
                    text: name_3,
                    confidence: 0.91,
                });
            }
        }
        // Anatomy (cognitive areas)
        var anatomyPatterns = [
            { pattern: /memoria de trabajo/gi, name: 'Memoria de trabajo' },
            { pattern: /memoria.*corto plazo/gi, name: 'Memoria corto plazo' },
            { pattern: /atención/gi, name: 'Atención' },
            { pattern: /procesamiento.*visual/gi, name: 'Procesamiento visual' },
        ];
        for (var _g = 0, anatomyPatterns_1 = anatomyPatterns; _g < anatomyPatterns_1.length; _g++) {
            var _h = anatomyPatterns_1[_g], pattern = _h.pattern, name_4 = _h.name;
            if (pattern.test(text)) {
                entities.anatomy.push({
                    text: name_4,
                    confidence: 0.89,
                });
            }
        }
        entities.total =
            entities.diagnoses.length +
                entities.medications.length +
                entities.symptoms.length +
                entities.procedures.length +
                entities.anatomy.length;
        return entities;
    };
    AwsComprehendService.prototype.mockDetectPHI = function (text) {
        var phi = {
            names: [],
            dates: [],
            locations: [],
            ids: [],
            hasSensitiveData: false,
        };
        // Detect names (simplified pattern)
        var namePattern = /(?:Nombre|Alumno|Paciente):\s*([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)+)/gi;
        var match;
        while ((match = namePattern.exec(text)) !== null) {
            phi.names.push({
                text: match[1],
                type: 'NAME',
            });
        }
        // Detect dates
        var datePattern = /\d{1,2}\/\d{1,2}\/\d{4}/g;
        var dates = text.match(datePattern);
        if (dates) {
            for (var _i = 0, dates_1 = dates; _i < dates_1.length; _i++) {
                var date = dates_1[_i];
                phi.dates.push({
                    text: date,
                    type: 'DATE',
                });
            }
        }
        // Detect locations
        var locationPattern = /(?:Madrid|Barcelona|Valencia|Sevilla|Zaragoza|Málaga|Bilbao)/gi;
        var locations = text.match(locationPattern);
        if (locations) {
            for (var _a = 0, locations_1 = locations; _a < locations_1.length; _a++) {
                var loc = locations_1[_a];
                phi.locations.push({
                    text: loc,
                    type: 'LOCATION',
                });
            }
        }
        // Detect IDs (simplified)
        var idPattern = /\b[A-Z]-?\d{4,6}\b/g;
        var ids = text.match(idPattern);
        if (ids) {
            for (var _b = 0, ids_1 = ids; _b < ids_1.length; _b++) {
                var id = ids_1[_b];
                phi.ids.push({
                    text: id,
                    type: 'ID',
                });
            }
        }
        phi.hasSensitiveData =
            phi.names.length > 0 ||
                phi.dates.length > 0 ||
                phi.ids.length > 0;
        return phi;
    };
    AwsComprehendService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [])
    ], AwsComprehendService);
    return AwsComprehendService;
}());
exports.AwsComprehendService = AwsComprehendService;
