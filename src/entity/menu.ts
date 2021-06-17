import { MenuItem } from "./menuItem";

export class Menu {
    id: number;
    vendorId: number;
    description: String;
    menuItems: Array<MenuItem>;
}