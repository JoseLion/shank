import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AdminViewComponent } from "./admin.component";
import { DataTableModule, SharedModule, ButtonModule, TooltipModule } from 'primeng/primeng';

@NgModule({
    declarations: [ AdminViewComponent ],
    imports     : [ BrowserModule, DataTableModule, SharedModule, ButtonModule, TooltipModule ],
})
export class AdminViewModule {}
