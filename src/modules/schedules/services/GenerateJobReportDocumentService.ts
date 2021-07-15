import { Document, Table, TableCell, Paragraph, TableRow, WidthType, Packer, HeadingLevel,  } from 'docx'
import { IJobCongress } from '../model/IJobCongress'
import * as fs from "fs";
import uploadConfig from '../../../config/upload'


class GenerateJobReportDocumentService {
  constructor() {}

  createHeading(text: string) {
    return new Paragraph({
      text,
      heading: HeadingLevel.HEADING_1,
      thematicBreak:true
    })
  }
  createSubHeading(text: string): Paragraph {
    return new Paragraph({
        text: text,
        heading: HeadingLevel.HEADING_2,
    });
  }
  createCell(content: string, size: number) {
    return new TableCell({
      children:[
        new Paragraph(content)
      ],
      width: {
        size: size,
        type: WidthType.DXA,
      },
    })
  }

  createRow(cells: TableCell[]): TableRow {
    return new TableRow({
      children: cells
    })
  }

  creatTable(rows: TableRow[]) {
    return new Table({
      columnWidths: [505,3505, 5505],
      rows
    })
  }


  async execute(job: IJobCongress) {
    const header = this.createRow([
      this.createCell('Número',505),
      this.createCell('Tipo',505),
      this.createCell('Data Apresentação',3505),
      this.createCell('Ementa',5505),
      this.createCell('Autor',3505),
    ])
    const rows = job.items.map((item: any) => {
      return this.createRow([
        this.createCell(item.proposition_id, 505),
        this.createCell(item.type_proposition, 505),
        this.createCell(item.date_apresentation, 3505),
        this.createCell(item.text, 5505),
        this.createCell(item.author, 3505),
      ])
    })
    const table = this.creatTable([header, ...rows])
    

    const doc = new Document({
      sections: [
        {
          children: [
            this.createHeading('Tabela de alguma coisa'),
            table
          ]
        }
      ]
    });
  
    const buffer = await Packer.toBuffer(doc)
    fs.writeFileSync(`${uploadConfig.uploadsFolder}/job_${new Date(job.date_job).getTime()}_report.docx`, buffer);
    return `job_${new Date(job.date_job).getTime()}_report.docx`
  }
}

export { GenerateJobReportDocumentService }