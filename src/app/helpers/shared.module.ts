import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
    imports: [CommonModule, FontAwesomeModule, TranslateModule, IonicModule],
    exports: [CommonModule, FontAwesomeModule, TranslateModule, IonicModule],
})
export class SharedModule {}
