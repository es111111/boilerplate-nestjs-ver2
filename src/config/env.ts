import { z } from 'zod';
const stringToNumber = z.string().transform((val, ctx) => {
  const parsed = parseInt(val);
  if (isNaN(parsed)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Not a valid number',
    });
    return z.NEVER;
  }
  return parsed;
});
const envSchema = z.object({
  PORT: stringToNumber,
  NODE_ENV: z.enum(['local', 'development', 'production']),
  MYSQL_USERNAME: z.string(),
  MYSQL_PASSWORD: z.string(),
  MYSQL_DATABASE: z.string(),
  MYSQL_HOST: z.string(),
  MYSQL_DIALECT: z.string(),
  //   RABBITMQ_HOST: z.string(),
  //   ACCESS_TOKEN_SECRET: z.string(),
  //   USER_REFRESH_TOKEN_SECRET: z.string(),
  //   USER_ACCESS_TOKEN_SECRET: z.string(),
  //   REFRESH_TOKEN_SECRET: z.string(),
  //   EXPIRES_IN: stringToNumber,
  //   CPO_CODE_REGEX: z.string(),
  //   STATION_CODE_REGEX: z.string(),
  //   CHARGEPOINT_CODE_REGEX: z.string(),
  //   CONNECTOR_CODE_REGEX: z.string(),
  //   PASSWORD_SALT: z.string(),
  //   AWS_S3_URL: z.string(),
  //   AWS_S3_BUCKET: z.string(),
  //   AWS_S3_ACCESS_KEY: z.string(),
  //   AWS_S3_SECRET_KEY: z.string(),
  //   AWS_S3_REGION: z.string(),
  //   SLACK_CHANNEL: z.string(),
  //   SLACK_USERNAME: z.string(),
  //   RESET_PASSWORD_EMAIL_EXPIRES_IN: stringToNumber,
  //   AWS_SES_EMAIL_SENDER: z.string(),
  //   AWS_SES_ACCESS_KEY: z.string(),
  //   AWS_SES_SECRET_ACCESS_KEY: z.string(),
  //   AWS_SES_REGION: z.string(),
  //   SMARTRO_CANCEL_PASSWORD: z.string(),
  //   SMARTRO_MID: z.string(),
  //   SMARTRO_SSID: z.string(),
  //   SMARTRO_MERCHANTKEY: z.string(),
  /**
   * TODO:
   * prod에 배포할 때는 CLIENT_URL을 필수로 설정해야 합니다.
   * 그렇지 않으면 CORS 에러가 발생합니다.
   */
  CLIENT_URL: z.string().optional(),
});
export type Env = z.infer<typeof envSchema>;
export const env = (() => {
  // eslint-disable-next-line no-process-env
  const r = envSchema.safeParse(process.env);
  if (r.success === true) return r.data;
  throw new Error(
    `env validation 오류가 생겼습니다. ${r.error.errors
      .map((e) => `${e.path[0]}: ${e?.['received'] ?? e.code}`)
      .join(', ')}`,
  );
})();
