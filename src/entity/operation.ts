import { OperationItem } from "./operationItem";

export class Operation {
    id: number;
    vendorId: number;
    operationItems: Array<OperationItem>;
}