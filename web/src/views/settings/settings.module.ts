import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { SettingsViewComponent } from "./settings.component";
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/primeng';

@NgModule({
    declarations: [ SettingsViewComponent ],
    imports     : [ BrowserModule, FormsModule, InputTextModule ],
})

export class SettingsViewModule {}
