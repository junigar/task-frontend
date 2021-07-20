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
    this.getTasks();
    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'titulo', header: 'Título' },
      { field: 'fechaCreacion', header: 'Fecha' },
      { field: 'descripcion', header: 'Descripción' },
      { field: 'nivelPrioridad', header: 'Prioridad' },
      { field: 'status', header: 'Estado' },
    ];
    this.toolBarItems = [{ label: 'Nuevo', icon: 'pi pi-fw pi-plus', command: ()=> this.showDialogPanel(null) }];
    this.resetInsertTask();
  }

  showDialogPanel(formTask: Task | null) {
    if(!formTask)
      this.resetInsertTask();
    else{
      this.insertTask = formTask;
    }
    this.showDialog = true;
  }
  hideDialog() {
    this.showDialog = false;
    this.resetInsertTask();
  }

  submitForm() {
    // console.log(this.insertTask);
    if(!this.insertTask['id']){
      this.handleInsert(this.insertTask);
    }
    else{
      this.handleEdit(this.insertTask);
    }
  }

  resetInsertTask() {
    this.insertTask = {
      titulo: '',
      descripcion: '',
      fechaCreacion: '',
      nivelPrioridad: NivelPrioridad.BAJA,
      status: Status.INACTIVA,
      tareaDeRequisitoId: null
    };
  }

  handleInsert(toInsertTask: Task): void{
    this.taskService.postTask(toInsertTask).subscribe((res)=>{
      console.log(res);
      this.tasks = insertNode([...this.tasks], res[0].data);
    this.showMessage('success', 'Sistema', 'Tarea Insertada');
    }, err => {
      console.error(err);
      this.showMessage('error', 'Sistema', 'Error del sistema')
    },()=>{
      this.hideDialog();
    });
  }

  handleEdit(toEditTask: Task): void {
    this.taskService.putTask(toEditTask).subscribe((res: TreeNode)=>{
      this.tasks = updateNode(this.tasks, res);
      this.showMessage('success', 'Sistema', 'Tarea editada');
    },
    err => console.error(err),
    ()=> this.hideDialog())
  }
  handleDelete(id:number ):void{
    this.taskService.deleteTask(id).subscribe((res)=>{
      this.tasks = deleteNode(this.tasks, id);
      this.showMessage('success', 'Sistema', 'Tarea eliminada');
    })
  }
  showMessage(severity:string, summary:string, detail:string): void{
    this.messageService.add({
      severity,
      summary,
      detail
    })
  }
   getTasks(){
    this.taskService.getTreeTask().then(res => {
      this.tasks = res;
    })
  }
  subTask(task: Task){
    this.insertTask.tareaDeRequisitoId = <number>task.id;
    // console.log(this.insertTask)
    this.showDialog = true;
  }
}

function deleteNode(deleteTree: any, id: number): TreeNode[] {
  // let hasBeenDeleted: boolean = false;
  function scanNodes(node: any, sub: number): TreeNode[] {
    // let toReturn;
    for (let i = 0; i < node.length; i++) {
      // if (hasBeenDeleted) break;
      const item = node[i];
      if (item["data"]["id"] == sub) {
        // hasBeenDeleted = true;
        // toReturn = node.filter((item: any, index: number) => index != i);
        node = node.filter((item: any, index: number) => index != i);
        break;
      } else {
        if (item["children"].length > 0) {
          item["children"] = scanNodes(item["children"], sub);
        }
      }
    }
    return node;
    // return toReturn;
  }
  return scanNodes(deleteTree, id);
}

function insertNode(tree: TreeNode[], toInsertNode: Task): TreeNode[] {
  let treeNode: TreeNode= {}
  treeNode.data = toInsertNode;
  treeNode.children = [];
  if (!toInsertNode["tareaDeRequisitoId"]) {
    let toReturn = [...tree];
    toReturn.push(treeNode);
    return toReturn;
  }
  // let hasBeenInserted = false;
  function scanNodes(node: any[], sub: TreeNode) {
    for (let i = 0; i < node.length; i++) {
      // if (hasBeenInserted) break;
      const item = node[i];
      if (item["data"]["id"] == sub["data"]["tareaDeRequisitoId"]) {
        // hasBeenInserted = true;
        item["children"]?.push(treeNode);
        break;
      } else {
        if (item["children"].length > 0) {
          item["children"] = scanNodes(item["children"], sub);
        }
      }
    }
    return node;
  }
  return scanNodes(tree, treeNode);
}

function updateNode(updateTree:TreeNode[], toUpdateNode: TreeNode) {
  const { id, tareaDeRequisitoId } = toUpdateNode["data"];
  if (id === tareaDeRequisitoId) return updateTree;
  let deletedNode = deleteNode(updateTree, id);
  let insertedTree = insertNode(deletedNode, toUpdateNode["data"]);
  return insertedTree;
}