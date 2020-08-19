import { todoRepository } from "../datalayer/todoRepository";
import { TodoItem } from "../models/TodoItem";
import * as uuid from 'uuid';
import { TodoUpdate } from "../models/TodoUpdate";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";
import { getUserId } from "../lambda/utils";
import { APIGatewayProxyEvent } from "aws-lambda";

const todoRepo = new todoRepository();

export async function getAllTodos(userId: string): Promise<TodoItem[]> {
    return todoRepo.getAllItems(userId);
}

export async function createTodo(
    createGroupRequest: CreateTodoRequest,
    userId: string
): Promise<TodoItem> {

    const todoId = uuid.v4();
    return await todoRepo.createItem({
        todoId: todoId,
        userId: userId,
        name: createGroupRequest.name,
        createdAt: new Date().toISOString(),
        dueDate: createGroupRequest.dueDate,
        done: false,
        attachmentUrl: null
    })
}

export async function updateTodoItem(userId: string, todoId: string, todoUpdate: TodoUpdate): Promise<UpdateTodoRequest> {
    return await todoRepo.updateItem(userId, todoId, todoUpdate);
}

export async function deleteTodoItem(userId: string, todoId: string) {
    return await todoRepo.deleteItem(userId, todoId)
}

export async function generateUploadUrl( event: APIGatewayProxyEvent ): Promise<string> {
    const todoId = event.pathParameters.todoId;
    const userId = getUserId(event);
    const generatedUrl = await todoRepo.generateUploadUrl(todoId, userId);
    return generatedUrl
}

