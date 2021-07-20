import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Task } from '../models/task.model'; 
import { TreeNode } from 'primeng/api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  URL = environment.URL_API;
  task: Task;

  constructor(private http: HttpClient) { 
    this.task = new Task();
  }

  /* 
    Conexión con la base de datos para crear el CRUD
    'C: Create (crear)'; 'R: Read (leer)'; 'U: Update (actualizar)'; 'R: Remove (borrar)'  
    el crud utiliza en este caso el protocolo http por lo cual se aplican metodos los http correspondientes
  */

  // Crear Tarea
  postTask(task: Task): Observable<TreeNode[]> {
    return this.http.post<TreeNode[]>(this.URL, task);
  }

  getTasks() {
    return this.http.get<any>(this.URL)
    .toPromise()
    .then(res => <Task[]>res.data)
    .then(data => { return data; });
}

  // Obtener una sola tarea
  getTask(task: Task, id: number) {
    return this.http.get<Task[]>(this.URL + `/${id}`)
  } 

  // Actualizar datos de la tarea
  putTask(task: Task) {
    return this.http.put(this.URL + `/${task.id}`, task);
  }


  // Eliminar tarea
  deleteTask(id: number) {
    return this.http.delete(this.URL + `/${id}`);
  }

  getTreeTask(){
    return this.http.get(this.URL + "/tree")
                    .toPromise()
                    .then(res =><TreeNode[]>res);
  }

}
