import { NivelPrioridad } from "./enums/prioridad";
import { Status } from "./enums/status";

export class Task {
    "id": number | null;
    "titulo": string;
    "fechaCreacion": string;
    "descripcion": string;
    "nivelPrioridad": NivelPrioridad;
    "status": Status;
    "tareaDeRequisitoId": number | null;
}