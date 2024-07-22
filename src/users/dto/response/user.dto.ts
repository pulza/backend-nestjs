import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
    id: number;
    email: string;
    name: string;
    role: number;

    constructor(user: any) {
        this.id = user.id;
        this.email = user.email;
        this.name = user.name;
        this.role = user.role;
    }
}
