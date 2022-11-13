import * as FileSaver from 'file-saver';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExcelsDownloadService {
  
  public exportAsExcelFile(workbook: any, excelFileName: string): void {
    workbook.xlsx.writeBuffer().then((json: BlobPart) => {
      const blob = new Blob([json], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      FileSaver.saveAs(blob, excelFileName);
    });
  }
}
