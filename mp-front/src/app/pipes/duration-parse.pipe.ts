import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'durationParse',
})
export class DurationParsePipe implements PipeTransform {
  transform(millis: number): string {
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return seconds === 60
      ? minutes + 1 + ':00'
      : minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }
}
