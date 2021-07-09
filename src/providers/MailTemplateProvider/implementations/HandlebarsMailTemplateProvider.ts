import handlebars from 'handlebars'
import fs from 'fs'
import { IMailTemplateProvider, IParseMailTemplateDTO } from '../models/IMailTemplateProvider'

class HandlebarsMailTemplateProvider implements IMailTemplateProvider {

  async parse(data: IParseMailTemplateDTO): Promise<string> {
    const templateFileContent = await fs.promises.readFile(data.file, {
      encoding: 'utf-8'
    });
    const parseTemplate = handlebars.compile(templateFileContent);
    return parseTemplate(data.variables)
  }
}

export { HandlebarsMailTemplateProvider }