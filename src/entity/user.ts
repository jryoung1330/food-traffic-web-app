import { Vendor } from "./vendor";

export class User {
    id: number;
    email: string;
    username: string;
    passwordHash: string;
    joinDate: Date;
    employeeId: number;
    isOwner: boolean;
    hasAdminPrivileges: boolean;
    vendorId: number;
    favorites: Array<Vendor>;
}