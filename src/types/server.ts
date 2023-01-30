/**
 * Object to be used to describe the return status of a response
 */
export const status = {
    ok: 200,
    created: 201,
    accepted: 202,
    noContent: 204,
    badRequest: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
    conflict: 409,
    internalServerError: 500,
    notImplemented: 501,
    badGateway: 502,
    serviceUnavailable: 503,
    gatewayTimeout: 504,
};

/**
 * This interface should be used to describe all responses from the server. If
 * a return type is applicable it can be added to the data property.
 * 
 * @param T the type of the data property
 */
export interface Response<T = void> {
    status: typeof status[keyof typeof status];
    message: string;
    data?: T;
}