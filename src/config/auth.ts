export default {
  jwt: {
    //secret: process.env.JWT_SECRET as string,
    secret: process.env.JWT_SECRET || 'default',
    expiresIn: '1d'
  }
}
