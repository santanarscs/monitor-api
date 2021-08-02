import PDFPrinter from 'pdfmake'
import { TDocumentDefinitions, TableCell } from 'pdfmake/interfaces'
import { IItemJob, IJob } from '../model/IJob'

interface IRequest {
  job: IJob,
  items: IItemJob[]
}
class CreateReportJobService {
  async execute({
    job,
    items
  }:IRequest) {
    const fonts = {
      Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
      },
    }
    const printer = new PDFPrinter(fonts)
  
    const body = []
  
    const columnsTitle: TableCell[] = [
      {text: 'NÚMERO', style: 'columnsTitle'},
      {text: 'TIPO', style: 'columnsTitle'},
      {text: 'APRESENTAÇÃO', style: 'columnsTitle'},
      {text: 'TEXTO', style: 'columnsTitle'},
      {text: 'STATUS', style: 'columnsTitle'},
      {text: 'AUTOR', style: 'columnsTitle'}
    ]
  
    const columnsBody =  new Array();
    columnsTitle.forEach(column => columnsBody.push(column))
    body.push(columnsTitle)
  
    for await (let item of items) {
      const formattedDate = new Intl.DateTimeFormat('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(item.date_apresentation))
      const row = new Array()
  
      row.push({text: item.proposition_id, link: item.link, color: 'blue', bold: true, nodeName: 'A', style: ["html-strong", "html-a", "html-p", 'columnBody']})
      row.push({text: item.type_proposition, style: 'columnBody'})
      row.push({text: formattedDate, style: 'columnBody'})
      row.push({text: item.text, style: 'columnBody'})
      row.push({text: item.status, style: 'columnBody'})
      row.push({text: item.author, style: 'columnBody'})
      body.push(row)
    }
  
    const dateJobFormatted = new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(job.date_job))
    
    const today = new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date())
  
    const docDefinition: TDocumentDefinitions = {
      defaultStyle: {font: 'Helvetica'},
      pageOrientation: 'landscape',
      content: [
        {
          columns: [
            [
              {text: 'Relatório câmara dos deputados', bold: true, margin: [0,0,0,0], fontSize:16},
              {text: `Trabalho do dia ${dateJobFormatted}`, bold: true, margin: [0,5,0,10]},
            ],
            [
              {text: today, style: 'titlePage', alignment: 'right',margin: [0,0,0,0]},
              {text: `${items.length} Registros`, alignment: 'right', margin: [0,5,0,10]}
            ]
          ]
        },
        {
          table: {
            headerRows: 1,
            body
          },
        }
      ],
      styles: {
        header: {
  
        },
        columnsTitle: {
          fontSize: 8,
          bold: true,
          alignment: 'center',
          margin: [0, 5, 0, 10]
        },
        columnBody: {
          margin: [0, 5, 0, 0],
          lineHeight: 1.5
        }
      }
    }
    return printer.createPdfKitDocument(docDefinition);

  }
}

export { CreateReportJobService }