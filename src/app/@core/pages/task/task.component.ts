import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { FormControl, FormGroup, NgForm} from '@angular/forms'
import { Task } from '../../models/task.model';
import { SelectItem, TreeNode } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { NivelPrioridad } from '../../models/enums/prioridad';
import { Status } from '../../models/enums/status';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

    public tasks: TreeNode[] = [];
    public cols: any[] = [];
    public toolBarItems: object[] = [];
    public showDialog: boolean = true;
    public insertTask: Task = new Task();
  
  constructor(
    private taskService: TaskService,
    private messageService: MessageService,
    ) { }

  ngOnInit() {
    this.taskService.getTreeTask().then( data => {
      this.tasks = data;
    });
    this.cols = [
      {field: "id", header: "ID"},
      {field: "titulo", header: "Título"},
      {field: "fechaCreacion", header: "Fecha"},
      {field: "descripcion", header: "Descripción"},
      {field: "nivelPrioridad", header: "Prioridad"},
      {field: "status", header: "Estado"},
    ];
    this.toolBarItems = [
      { label: "Nuevo", icon: "pi pi-fw pi-plus" }];
    this.resetInsertTask();
  }

  showDialogPanel(){
    this.showDialog = true;
  }
  hideDialog(){
    this.showDialog = false;
    this.resetInsertTask();
  }

  submitForm(){
    let response = this.taskService.postTask(this.insertTask).subscribe(
      (res) => {
        console.log(res);
      }
    )
  }

  resetInsertTask(){
    this.insertTask = {
      id: 0,
      titulo: '',
      descripcion: '',
      fechaCreacion: '',
      nivelPrioridad: NivelPrioridad.BAJA,
      status: Status.INACTIVA
    }
  }
}
