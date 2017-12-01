import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ProfileViewComponent } from "./profile.component";
import { DataTableModule, SharedModule, ButtonModule, TooltipModule } from 'primeng/primeng';

@NgModule({
    declarations: [ ProfileViewComponent ],
    imports     : [ BrowserModule, DataTableModule, SharedModule, ButtonModule, TooltipModule ],
})
export class ProfileViewModule {}
