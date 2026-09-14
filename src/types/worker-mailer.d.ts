declare module 'worker-mailer' {
  export const WorkerMailer: {
    send(
      smtpConfig: {
        host: string;
        port: number;
        secure?: boolean;
        startTls?: boolean;
        credentials?: { username: string; password?: string };
        authType?: string;
      },
      message: {
        from: { name?: string; email: string } | string;
        to: string;
        subject: string;
        text?: string;
        html?: string;
      }
    ): Promise<any>;
  };
}
