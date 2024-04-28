import { UserType } from "./Types/userType";

export class User {
  userData: UserType = {
    id: crypto.randomUUID(),
    name: "",
    surname: "",
    userRole: "ADMIN",
  };
  constructor(
    name: string,
    surname: string,
    userRole: "ADMIN" | "DEVOPS" | "DEVELOPER"
  ) {
    this.userData.name = name;
    this.userData.surname = surname;
    this.userData.userRole = userRole;
  }
}
