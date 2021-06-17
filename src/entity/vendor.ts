import { Tag } from "./tag";

export class Vendor {
    id: number;
    userName: string;
    displayName: string;
    company: string;
    longitude: number;
    latitude: number;
    streetAddress: string;
    city: string;
    state: string;
    county: string;
    zipCode: number;
    locationDetails: string;
    description: string;
    profileImage: string;
    tags: Array<Tag>
}