import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'
import { userRouter } from './routes/user'
import { blogRouter } from './routes/blog'
import { cors } from 'hono/cors'

//this is needed to remove the ts error in accessing env variables
const app = new Hono<{
	Bindings: {
		DATABASE_URL: string
    JWT_SECRET : string
	}
}>();
app.use('/api/*', cors());
app.route("/api/v1/user",userRouter);
app.route("/api/v1/blog",blogRouter);

//auth middlewere
// app.use('/api/v1/blog/*', async (c, next) => {
//   const header = c.req.header("authorization") || "";
//   const token = header.split(" ")[1];  //for Barer token
  
//   const response = await verify(token , c.env.JWT_SECRET)
//   if(response.id){
//     await next();
//   }else{
//     c.status(404);
//     return c.json({error : "Unauthorized"})
//   }
// });


export default app;
