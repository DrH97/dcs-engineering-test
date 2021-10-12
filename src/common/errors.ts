import {Response} from 'express';


interface ErrResponseBody {
    errors: unknown;
}

export function sendErrResponse(
    res: Response,
    code: number,
    detail: unknown
): void {
    if (process.env.LOG_ERRORS) {
        console.error(`Error ${code}: ${JSON.stringify(detail, undefined, 2)}`);
    }
    const body: ErrResponseBody = {errors: detail};
    res.status(code).send(body);
}