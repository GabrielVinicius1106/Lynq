export class NoAttemptsLeftError extends Error {
    constructor(){ super("There are No More Attempts Left. Try to Recover Later.") }
}