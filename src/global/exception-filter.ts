import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  ErrorObj,
  ErrorResponse,
  ResponseDataDto,
} from 'src/decorators/response-data.decorator';
import { Errortype } from '../decorators/response-data.decorator';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const logger = new Logger('GlobalExceptionFilter');
    logger.error(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const path = request.url;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'INTERNAL Server Error';

    const errorObj: ErrorObj = {
      message: message,
      code: status,
    };

    const errorArray: Errortype = [errorObj];

    const errorFormat: ErrorResponse = {
      reqId: request.id,
      method: request.method,
      errUrl: path,
      errors: errorArray,
      queryParams: request.query,
      bodyParams: request.body,
    };

    if (process.env.NODE_ENV !== 'production' && status === 500) {
      const msg = structuredClone(errorFormat);
      const url = msg.errUrl;
      const method = msg.method;
      const body = msg.bodyParams;
      const attachments = [
        {
          color: '#ff0000',
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*Deployment*: api\n*Endpoint*: ${status} ${method} ${url}\n*User info*:\n\n\`\`\`\nRequestId: ${errorFormat.reqId}\n}\n\`\`\``,
              },
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*Error Log*:\n\n\`\`\`\nname: ${
                  exception.name
                }\nmessage: ${exception.message}\n${
                  exception.cause ? 'cause: ' + exception?.cause + '\n' : ''
                }stack: ${exception.stack}\n\`\`\``,
              },
            },
          ],
        },
      ];
      if (body && typeof body === 'object' && Object.keys(body).length > 0) {
        attachments[0].blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Body*: \`\`\`${
              body && JSON.stringify(body, null, 2)
            }\`\`\`\n`,
          },
        });
      }
      // slack 연동할건지 ?
    }
    const result = new ResponseDataDto(null, false, errorFormat);
    if (process.env.NODE_ENV === 'local')
      logger.verbose({
        ...result,
      });
    response.status(status).json(result);
  }
}
