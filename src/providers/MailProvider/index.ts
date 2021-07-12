import { EtherealMailProvider } from './implementations/EtherealMailProvider'
import { HandlebarsMailTemplateProvider }  from '../MailTemplateProvider/implementations/HandlebarsMailTemplateProvider'

const mailTemplateProvider = new HandlebarsMailTemplateProvider()
const mailProvider = new EtherealMailProvider(mailTemplateProvider)

export default mailProvider