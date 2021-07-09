import nodemailer, { Transporter } from 'nodemailer'
import { HandlebarsMailTemplateProvider } from '../../MailTemplateProvider/implementations/HandlebarsMailTemplateProvider';
import { IMailProvider, ISendMailDTO } from "../models/IMailProvider";

class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(private mailTemplateProvider: HandlebarsMailTemplateProvider) {
    nodemailer.createTestAccount().then(account => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        }
      })
      this.client = transporter
    })
  }

  async sendMail(data: ISendMailDTO): Promise<void> {
    const message = await this.client.sendMail({
      from: {
        name: data.frrom?.name || 'Robomonitor',
        address: data.frrom?.email || 'robo@monitor.com'
      },
      to: {
        name: data.to.name,
        address: data.to.email
      },
      subject: data.subject,
      html: await this.mailTemplateProvider.parse(data.templateData),
    })
    console.log(`Message sent: ${message.messageId}`)
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(message)}`)
  }

}

export { EtherealMailProvider }