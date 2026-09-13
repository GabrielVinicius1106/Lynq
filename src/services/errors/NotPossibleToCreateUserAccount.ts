// User Email ALREADY Exists

export class NotPossibleToCreateUserAccountError extends Error {
    // super("Email Already Exists.") => INICIALIZA a classe EXTENDIDA (Error)  
    constructor(){ super("It was Not Possible to Create User Account.") }
}