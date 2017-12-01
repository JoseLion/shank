import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { PublicViewComponent } from "./public.component";
import { DataTableModule, SharedModule, ButtonModule, TooltipModule } from 'primeng/primeng';

@NgModule({
    declarations: [ PublicViewComponent ],
    imports     : [ BrowserModule, DataTableModule, SharedModule, ButtonModule, TooltipModule ],
})
export class PublicViewModule {}
