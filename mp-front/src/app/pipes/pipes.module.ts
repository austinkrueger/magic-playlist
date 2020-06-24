import { NgModule } from '@angular/core';
import { TruncatePipe } from 'src/app/pipes/truncate.pipe';
import { DurationParsePipe } from 'src/app/pipes/duration-parse.pipe';

@NgModule({
  declarations: [TruncatePipe, DurationParsePipe],
  imports: [],
  exports: [TruncatePipe, DurationParsePipe],
})
export class PipesModule {}
