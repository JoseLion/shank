import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { UserViewComponent } from "./user.component";
import { DataTableModule, SharedModule, ButtonModule, TooltipModule } from 'primeng/primeng';

@NgModule({
    declarations: [ UserViewComponent ],
    imports     : [ BrowserModule, DataTableModule, SharedModule, ButtonModule, TooltipModule ],
})
export class UserViewModule {}
