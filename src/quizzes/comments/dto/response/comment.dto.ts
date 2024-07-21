import { Comment, User } from "@prisma/client";

export class CommentDto {
    id: number;
    createUserName: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(comment: Comment & { user: User }) {
        this.id = comment.id;
        this.createUserName = comment.user.name;
        this.content = comment.content;
        this.createdAt = comment.createdAt;
        this.updatedAt = comment.updatedAt;
    }
}
