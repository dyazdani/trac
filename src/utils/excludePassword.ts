// TODO: Use this function recommended by Prisma docs instead: 
// Got this from Prisma docs: https://www.prisma.io/docs/concepts/components/prisma-client/excluding-fields#excluding-the-password-field

// function exclude<User, Key extends keyof User>(
//   user: User,
//   keys: Key[]
// ): Omit<User, Key> {
//   return Object.fromEntries(
//     Object.entries(user).filter(([key]) => !keys.includes(key))
//   )
// }

// function main() {
//   const user = await prisma.user.findUnique({ where: 1 })
//   const userWithoutPassword = exclude(user, ['password'])
// }




// Exclude keys from user
function excludePassword<User>(
  user: User,
): Omit<User, "password"> {
  return {
      ...user,
      password: undefined
  }
}

export default excludePassword;