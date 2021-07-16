import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { TreeTableModule } from 'primeng/treetable';

import { TaskComponent } from './task.component';
import { TaskService } from '../../services/task.service';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { DialogModule, MenubarModule } from 'primeng';

@NgModule({
  declarations: [
    TaskComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    ToastModule,
    MessageModule,
    MessagesModule,
    TreeTableModule,
    PanelModule,
    CardModule,
    MenubarModule,
    DialogModule
  ],
  providers: [
    TaskService,
    MessageService
  ]
})

export class TaskModule { }
