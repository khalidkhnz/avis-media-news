import { Response, Router } from "express";
import { Model, Document } from "mongoose";
import { AuthenticatedRequest } from "../middlewares/authorization.middleware";

interface IMiddlewares {
  GET_ALL?: any[];
  GET_BY_ID?: any[];
  GET_ONE?: any[];
  CREATE?: any[];
  UPDATE?: any[];
  DELETE?: any[];
}

interface IModifyBody {
  GET_ALL?: <T>(val: T, req: AuthenticatedRequest, res: Response) => T;
  GET_BY_ID?: <T>(val: T, req: AuthenticatedRequest, res: Response) => T;
  GET_ONE?: <T>(val: T, req: AuthenticatedRequest, res: Response) => T;
  CREATE?: <T>(val: T, req: AuthenticatedRequest, res: Response) => T;
  UPDATE?: <T>(val: T, req: AuthenticatedRequest, res: Response) => T;
}

interface IModifyQuery {
  GET_ALL?: <T>(val: T, req: AuthenticatedRequest, res: Response) => T;
  GET_BY_ID?: <T>(val: T, req: AuthenticatedRequest, res: Response) => T;
  GET_ONE?: <T>(val: T, req: AuthenticatedRequest, res: Response) => T;
}

type IControllerNames =
  | "GET_ALL"
  | "GET_BY_ID"
  | "GET_ONE"
  | "CREATE"
  | "UPDATE"
  | "DELETE";

interface IControllerLevelChecks {
  changeUniqueField?: string;
  checkIfAlreadyExists?: string[];
}

interface IApplyChecks {
  changeUniqueField?: string;
  controllers?: {
    GET_ALL?: IControllerLevelChecks;
    GET_BY_ID?: IControllerLevelChecks;
    GET_ONE?: IControllerLevelChecks;
    CREATE?: IControllerLevelChecks;
    UPDATE?: IControllerLevelChecks;
    DELETE?: IControllerLevelChecks;
  };
}

interface IConstructer<T> {
  name: string;
  model: Model<T>;
  middlewares?: IMiddlewares;
  router: Router;
  routeName: string;
  modifyBody?: IModifyBody;
  modifyQuery?: IModifyQuery;
  applyChecks?: IApplyChecks;
}

const handleServerError = (res: Response, error: any) => {
  res
    .status(500)
    .json({ success: false, error: error.message || "Server Error" });
};

export default class GenericController<T extends Document> {
  private name: string;
  private model: Model<T>;
  private router: Router;
  private routeName: string;
  private middlewares: IMiddlewares;
  private modifyQuery: IModifyQuery;
  private modifyBody: IModifyBody;
  private applyChecks?: IApplyChecks;

  constructor({
    name,
    model,
    routeName,
    middlewares,
    router,
    modifyBody,
    modifyQuery,
    applyChecks,
  }: IConstructer<T>) {
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

  private uniqueID(controllerName: IControllerNames): string {
    const controller = this.applyChecks?.controllers?.[controllerName];
    return (
      controller?.changeUniqueField ||
      this.applyChecks?.changeUniqueField ||
      "_id"
    );
  }

  private async handleCheckForAlreadyExistingData(
    controllerName: IControllerNames,
    body: any,
    model: Model<T>,
    res: Response
  ): Promise<boolean> {
    try {
      const fieldsToCheck =
        this.applyChecks?.controllers?.[controllerName]?.checkIfAlreadyExists ||
        [];
      const responses = await Promise.all(
        fieldsToCheck.map(async (field) => {
          if (body[field]) {
            return await model.findOne({ [field]: body[field] } as Record<
              string,
              any
            >);
          }
          return null;
        })
      );

      if (responses.some((response) => response)) {
        res.status(409).json({
          success: false,
          message: `These fields [${fieldsToCheck.join(
            ","
          )}] are already existing`,
        });
        return true;
      } else {
        return false;
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "Something went wrong" });
      return true;
    }
  }

  private initializeRoutes() {
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

  getAll = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { limit = 10, page = 1 } = req.query;
      const skip = (Number(page) - 1) * Number(limit);
      const query: any = this.modifyQuery.GET_ALL
        ? this.modifyQuery.GET_ALL(req.query, req, res)
        : req.query;

      const items = await this.model
        .find(query)
        .skip(skip)
        .limit(Number(limit));
      const total = await this.model.countDocuments(query);

      res.status(200).json({
        success: true,
        data: items,
        pagination: { total, limit: Number(limit), page: Number(page) },
      });
    } catch (error) {
      handleServerError(res, error);
    }
  };

  getById = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    try {
      const params = this.modifyQuery.GET_BY_ID
        ? this.modifyQuery.GET_BY_ID(req.params, req, res)
        : req.params;
      if (!params[this.uniqueID("GET_BY_ID")]) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid ID format" });
      }
      const item = await this.model.findOne({
        [this.uniqueID("GET_BY_ID")]: params[this.uniqueID("GET_BY_ID")],
      } as Record<string, any>);
      if (!item) {
        return res
          .status(404)
          .json({ success: false, error: "Item not found" });
      }
      res.status(200).json({ success: true, data: item });
    } catch (error) {
      handleServerError(res, error);
    }
  };

  getOne = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    try {
      const query: any = this.modifyQuery.GET_ONE
        ? this.modifyQuery.GET_ONE(req.query, req, res)
        : req.query;
      const item = await this.model.findOne(query);
      if (!item) {
        return res
          .status(404)
          .json({ success: false, error: "Item not found" });
      }
      res.status(200).json({ success: true, data: item });
    } catch (error) {
      handleServerError(res, error);
    }
  };

  create = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const body = this.modifyBody.CREATE
        ? this.modifyBody.CREATE(req.body, req, res)
        : req.body;

      if (
        await this.handleCheckForAlreadyExistingData(
          "CREATE",
          body,
          this.model,
          res
        )
      )
        return;
      const newItem = await this.model.create(body);
      res.status(201).json({ success: true, data: newItem });
    } catch (error) {
      handleServerError(res, error);
    }
  };

  update = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    try {
      const body = this.modifyBody.UPDATE
        ? this.modifyBody.UPDATE(req.body, req, res)
        : req.body;

      if (
        await this.handleCheckForAlreadyExistingData(
          "UPDATE",
          body,
          this.model,
          res
        )
      )
        return;
      const updatedItem = await this.model.findOneAndUpdate(
        {
          [this.uniqueID("UPDATE")]: req.params[this.uniqueID("UPDATE")],
        } as Record<string, any>,
        {
          $set: body,
        },
        { new: true }
      );
      if (!updatedItem) {
        return res
          .status(404)
          .json({ success: false, error: "Item not found" });
      }
      res.status(200).json({ success: true, data: updatedItem });
    } catch (error) {
      handleServerError(res, error);
    }
  };

  delete = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    try {
      const item = await this.model.findOneAndDelete({
        [this.uniqueID("DELETE")]: req.params[this.uniqueID("DELETE")],
      } as Record<string, any>);
      if (!item) {
        return res
          .status(404)
          .json({ success: false, error: "Item not found" });
      }
      res.status(200).json({ success: true, data: item });
    } catch (error) {
      handleServerError(res, error);
    }
  };
}
