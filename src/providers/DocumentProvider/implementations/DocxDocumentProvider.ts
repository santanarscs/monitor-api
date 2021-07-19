import { Document, Table, TableCell, Paragraph, TableRow, WidthType, Packer } from 'docx'
import * as fs from "fs";
class DocxDocumentProvider {
    handleGenerateTableItemsJob(items: any[]) {
      const rows = items.map(item => {
        return new TableRow({
          children: [
            new TableCell({
              width: {
                size: 3505,
                type: WidthType.DXA
              },
              children: [new Paragraph(item.proposition_id)]
            }),
            new TableCell({
              width: {
                size: 3505,
                type: WidthType.DXA
              },
              children: [new Paragraph(item.type_proposition)]
            }),
            new TableCell({
              width: {
                size: 3505,
                type: WidthType.DXA
              },
              children: [new Paragraph(item.date_apresentation)]
            }),
            new TableCell({
              width: {
                size: 3505,
                type: WidthType.DXA
              },
              children: [new Paragraph(item.text)]
            }),
            new TableCell({
              width: {
                size: 3505,
                type: WidthType.DXA
              },
              children: [new Paragraph(item.author)]
            }),
          ]
        })
      })
      const table = new Table({
        columnWidths: [3505, 5505],
        rows
    });
      const doc = new Document({
        sections: [
            {
                children: [
                    new Paragraph({ text: "Tabela de Proposições do dia tal ao dia tal" }),
                    table,
                ],
            },
        ],
    });
    Packer.toBuffer(doc).then((buffer) => {
        fs.writeFileSync("My Document.docx", buffer);
    });
    }

}

export { DocxDocumentProvider }