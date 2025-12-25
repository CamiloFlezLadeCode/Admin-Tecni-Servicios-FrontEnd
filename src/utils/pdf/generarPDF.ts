import { PDFDocument, StandardFonts, rgb, PDFPage, degrees } from 'pdf-lib';

export class GenerarPDF {
    async createWithWatermark(
        watermarkText: string = 'CONFIDENCIAL',
        callback: (page: PDFPage, fonts: any) => void
    ) {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();

        // Embed fuentes una vez
        const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        // Agregar marca de agua automáticamente
        this.applyWatermark(page, watermarkText, helvetica);

        // Dejar que el usuario defina el contenido
        callback(page, { helvetica, helveticaBold });

        // Retornar documento para que el usuario decida qué hacer
        return {
            doc: pdfDoc,
            getBytes: async () => await pdfDoc.save(),
            addPage: (cb: (p: PDFPage, f: any) => void) => {
                const newPage = pdfDoc.addPage();
                this.applyWatermark(newPage, watermarkText, helvetica);
                cb(newPage, { helvetica, helveticaBold });
            }
        };
    }

    private applyWatermark(page: PDFPage, text: string, font: any) {
        const { width, height } = page.getSize();

        page.drawText(text, {
            x: width / 2,
            y: height / 2,
            size: 48,
            font,
            color: rgb(0.9, 0.9, 0.9),
            opacity: 0.1,
            rotate: degrees(-45),
        });
    }
}

// export default async function generarPDF(datos: { Cliente: string }) {
//     const pdfDoc = await PDFDocument.create();
//     const page = pdfDoc.addPage();
//     const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
//     page.drawText(datos.Cliente, {
//         x: 50,
//         y: page.getHeight() - 70,
//         size: 15,
//         font,
//         color: rgb(0, 0, 0),
//     });
// }