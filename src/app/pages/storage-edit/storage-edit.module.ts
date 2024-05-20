import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StorageEditPageRoutingModule } from './storage-edit-routing.module';

import { StorageEditPage } from './storage-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StorageEditPageRoutingModule
  ],
  declarations: [StorageEditPage]
})
export class StorageEditPageModule {}
