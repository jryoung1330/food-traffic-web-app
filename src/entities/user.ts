import { Employee } from "./employee";
import { Vendor } from "./vendor";

export class User {
    id: number;
    email: string;
    username: string;
    passwordHash: string;
    joinDate: Date;
    employee: Employee;
    favorites: Array<Vendor>;
}