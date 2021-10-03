import { MenuItem } from "./menuItem";

export class Menu {
    id: number;
    vendorId: number;
    name: String;
    description: String;
    displayOrder: number;
    menuItems: Array<MenuItem>;
}