import { http } from "../config/http";

export abstract class UsersApi {
    static getUsers = async (): Promise<any> => {
        const response = await http.get("/users").catch((_err) => {
            return null;
        });

        if (response && response.status === 200) {
            return response.data;
        }
        return null;
    };
}
