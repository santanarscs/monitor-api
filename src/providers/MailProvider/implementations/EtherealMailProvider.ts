import nodemailer, { Transporter } from 'nodemailer'
import { HandlebarsMailTemplateProvider } from '../../MailTemplateProvider/implementations/HandlebarsMailTemplateProvider';
import { IMailProvider, ISendMailDTO } from "../models/IMailProvider";

class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(private mailTemplateProvider: HandlebarsMailTemplateProvider) {
    if(process.env.HTTP_PROXY) {
      const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false
        }
      });
      this.client = transporter
    } else {
      nodemailer.createTestAccount().then(account => {
        const transporter = nodemailer.createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
            user: account.user,
            pass: account.pass,
          },
        })
        this.client = transporter
      })
    }

    
  }

  async sendMail(data: ISendMailDTO): Promise<void> {
    const message = await this.client.sendMail({
      from: {
        name: 'CIGEO',
        address: process.env.MAIL_FROM_ADDRESS as string
      },
      to: {
        name: data.to.name,
        address: data.to.email
      },
      subject: data.subject,
      html: await this.mailTemplateProvider.parse(data.templateData),
      attachments: data.attachments
    })
    console.log(`Message sent: ${message.messageId}`)
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(message)}`)
  }

}

export { EtherealMailProvider }