"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const handleServerError = (res, error) => {
    res
        .status(500)
        .json({ success: false, error: error.message || "Server Error" });
};
class GenericController {
    constructor({ name, model, routeName, middlewares, router, modifyBody, modifyQuery, applyChecks, }) {
        this.getAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { limit = 10, page = 1 } = req.query;
                const skip = (Number(page) - 1) * Number(limit);
                const query = this.modifyQuery.GET_ALL
                    ? this.modifyQuery.GET_ALL(req.query, req, res)
                    : req.query;
                const items = yield this.model
                    .find(query)
                    .skip(skip)
                    .limit(Number(limit));
                const total = yield this.model.countDocuments(query);
                res.status(200).json({
                    success: true,
                    data: items,
                    pagination: { total, limit: Number(limit), page: Number(page) },
                });
            }
            catch (error) {
                handleServerError(res, error);
            }
        });
        this.getById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const params = this.modifyQuery.GET_BY_ID
                    ? this.modifyQuery.GET_BY_ID(req.params, req, res)
                    : req.params;
                if (!params[this.uniqueID("GET_BY_ID")]) {
                    return res
                        .status(400)
                        .json({ success: false, error: "Invalid ID format" });
                }
                const item = yield this.model.findOne({
                    [this.uniqueID("GET_BY_ID")]: params[this.uniqueID("GET_BY_ID")],
                });
                if (!item) {
                    return res
                        .status(404)
                        .json({ success: false, error: "Item not found" });
                }
                res.status(200).json({ success: true, data: item });
            }
            catch (error) {
                handleServerError(res, error);
            }
        });
        this.getOne = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const query = this.modifyQuery.GET_ONE
                    ? this.modifyQuery.GET_ONE(req.query, req, res)
                    : req.query;
                const item = yield this.model.findOne(query);
                if (!item) {
                    return res
                        .status(404)
                        .json({ success: false, error: "Item not found" });
                }
                res.status(200).json({ success: true, data: item });
            }
            catch (error) {
                handleServerError(res, error);
            }
        });
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const body = this.modifyBody.CREATE
                    ? this.modifyBody.CREATE(req.body, req, res)
                    : req.body;
                if (yield this.handleCheckForAlreadyExistingData("CREATE", body, this.model, res))
                    return;
                const newItem = yield this.model.create(body);
                res.status(201).json({ success: true, data: newItem });
            }
            catch (error) {
                handleServerError(res, error);
            }
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const body = this.modifyBody.UPDATE
                    ? this.modifyBody.UPDATE(req.body, req, res)
                    : req.body;
                if (yield this.handleCheckForAlreadyExistingData("UPDATE", body, this.model, res))
                    return;
                const updatedItem = yield this.model.findOneAndUpdate({
                    [this.uniqueID("UPDATE")]: req.params[this.uniqueID("UPDATE")],
                }, {
                    $set: body,
                }, { new: true });
                if (!updatedItem) {
                    return res
                        .status(404)
                        .json({ success: false, error: "Item not found" });
                }
                res.status(200).json({ success: true, data: updatedItem });
            }
            catch (error) {
                handleServerError(res, error);
            }
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const item = yield this.model.findOneAndDelete({
                    [this.uniqueID("DELETE")]: req.params[this.uniqueID("DELETE")],
                });
                if (!item) {
                    return res
                        .status(404)
                        .json({ success: false, error: "Item not found" });
                }
                res.status(200).json({ success: true, data: item });
            }
            catch (error) {
                handleServerError(res, error);
            }
        });
        this.name = name;
        this.applyChecks = applyChecks;
        this.modifyQuery = modifyQuery || {
            GET_BY_ID: (v) => v,
            GET_ALL: (v) => v,
            GET_ONE: (v) => v,
        };
        this.modifyBody = modifyBody || {
            CREATE: (v) => v,
            UPDATE: (v) => v,
            GET_BY_ID: (v) => v,
            GET_ALL: (v) => v,
            GET_ONE: (v) => v,
        };
        this.model = model;
        this.router = router;
        this.routeName = routeName;
        this.middlewares = middlewares || {
            CREATE: [],
            GET_ALL: [],
            GET_BY_ID: [],
            GET_ONE: [],
            UPDATE: [],
            DELETE: [],
        };
        this.initializeRoutes();
    }
    uniqueID(controllerName) {
        var _a, _b, _c;
        const controller = (_b = (_a = this.applyChecks) === null || _a === void 0 ? void 0 : _a.controllers) === null || _b === void 0 ? void 0 : _b[controllerName];
        return ((controller === null || controller === void 0 ? void 0 : controller.changeUniqueField) ||
            ((_c = this.applyChecks) === null || _c === void 0 ? void 0 : _c.changeUniqueField) ||
            "_id");
    }
    handleCheckForAlreadyExistingData(controllerName, body, model, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const fieldsToCheck = ((_c = (_b = (_a = this.applyChecks) === null || _a === void 0 ? void 0 : _a.controllers) === null || _b === void 0 ? void 0 : _b[controllerName]) === null || _c === void 0 ? void 0 : _c.checkIfAlreadyExists) ||
                    [];
                const responses = yield Promise.all(fieldsToCheck.map((field) => __awaiter(this, void 0, void 0, function* () {
                    if (body[field]) {
                        return yield model.findOne({ [field]: body[field] });
                    }
                    return null;
                })));
                if (responses.some((response) => response)) {
                    res.status(409).json({
                        success: false,
                        message: `These fields [${fieldsToCheck.join(",")}] are already existing`,
                    });
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                res.status(500).json({ success: false, message: "Something went wrong" });
                return true;
            }
        });
    }
    initializeRoutes() {
        console.log(`Init Generic Controller - ${this.name}`);
        this.router.get(`${this.routeName}`, [
            ...(this.middlewares.GET_ALL || []),
            this.getAll,
        ]);
        this.router.get(`${this.routeName}/:${this.uniqueID("GET_BY_ID")}`, [
            ...(this.middlewares.GET_BY_ID || []),
            this.getById,
        ]);
        this.router.get(`${this.routeName}/find/one`, [
            ...(this.middlewares.GET_ONE || []),
            this.getOne,
        ]);
        this.router.post(`${this.routeName}`, [
            ...(this.middlewares.CREATE || []),
            this.create,
        ]);
        this.router.put(`${this.routeName}/:${this.uniqueID("UPDATE")}`, [
            ...(this.middlewares.UPDATE || []),
            this.update,
        ]);
        this.router.delete(`${this.routeName}/:${this.uniqueID("DELETE")}`, [
            ...(this.middlewares.DELETE || []),
            this.delete,
        ]);
    }
}
exports.default = GenericController;
