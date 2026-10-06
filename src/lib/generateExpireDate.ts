
type seconds = number

// Retorna um objeto Date com uma data de expiração com base no TTL
function generateExpireDate(TTL: seconds): Date {

    const expires_at = new Date(Date.now() + 1000 * TTL)

    return expires_at
}

export { generateExpireDate }