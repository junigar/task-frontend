import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { Task } from '../../models/task.model';
import { SelectItem, TreeNode } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { NivelPrioridad } from '../../models/enums/prioridad';
import { Status } from '../../models/enums/status';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
})
export class TaskComponent implements OnInit {
  public tasks: TreeNode[] = [];
  public cols: any[] = [];
  public toolBarItems: object[] = [];
  public showDialog: boolean = false;
  public insertTask: Task = new Task();

  constructor(
    private taskService: TaskService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.taskService.getTreeTask().then((data) => {
      this.tasks = data;
    });
    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'titulo', header: 'Título' },
      { field: 'fechaCreacion', header: 'Fecha' },
      { field: 'descripcion', header: 'Descripción' },
      { field: 'nivelPrioridad', header: 'Prioridad' },
      { field: 'status', header: 'Estado' },
    ];
    this.toolBarItems = [{ label: 'Nuevo', icon: 'pi pi-fw pi-plus' }];
    this.resetInsertTask();
  }

  showDialogPanel(id: any) {
    if(!id)
      this.resetInsertTask();
    else{
      this.insertTask = id;
    }
    this.showDialog = true;
    console.log(this.insertTask);
  }
  hideDialog() {
    this.showDialog = false;
    this.resetInsertTask();
  }

  submitForm() {
    if(!this.insertTask['id']){
      let res = this.taskService.postTask(this.insertTask).subscribe(res => res);
    }
    else{
      this.taskService.putTask(this.insertTask).subscribe(console.log);
    }
  }

  resetInsertTask() {
    this.insertTask = {
      id: null,
      titulo: '',
      descripcion: '',
      fechaCreacion: '',
      nivelPrioridad: NivelPrioridad.BAJA,
      status: Status.INACTIVA,
      tareaDeRequisitoId: null
    };
  }
}
