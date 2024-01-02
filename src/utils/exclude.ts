// Got this from Prisma docs: https://www.prisma.io/docs/concepts/components/prisma-client/excluding-fields#excluding-the-password-field

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