import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { TopnavbarComponent } from "./topnavbar.component";
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@NgModule({
    declarations: [ TopnavbarComponent ],
    imports     : [ BrowserModule, RouterModule, BsDropdownModule.forRoot() ],
    exports     : [ TopnavbarComponent ],
})
export class TopnavbarModule {}
