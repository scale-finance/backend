import { Response as Res } from "express";

/**
 * This interface should be used to describe all responses from the server. If
 * a return type is applicable it can be added to the data property.
 * 
 * @param T the type of the data property
 */
export default class Response<T = void> {
    private res: Res;

    /**
     * Overrides express object to allow for custom response types
     * 
     * @param res the express response object
     */
    constructor(res: Res) {
        this.res = res;
    }

    create<T>(status: number, message: string, data?: T) {
        this.res.statusCode = status
        this.res.json({
            status,
            message,
            data,
        });
    }
}
