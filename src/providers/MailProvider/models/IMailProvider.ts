

interface IMailContact {
  name: string;
  email: string;
}

interface ISendMailDTO {
  to: IMailContact;
  frrom?: IMailContact;
  subject: string;
  templateData: any
}

interface IMailProvider {
  sendMail(data: ISendMailDTO): Promise<void>;
}

export {IMailProvider, IMailContact, ISendMailDTO }