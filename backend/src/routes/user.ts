import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'
import { signupInput, signinInput } from '@srijanpathak/blog-common'

//this is needed to remove the ts error in accessing env variables
export const userRouter = new Hono<{
	Bindings: {
		DATABASE_URL: string
    JWT_SECRET : string
	}
}>();


userRouter.post('/signup', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  
    const body = await c.req.json();
    const {success} = signupInput.safeParse(body);//zod validation
    if (!success){
        c.status(411);
        return c.json({
            message:"Inputs are not correct"
        })
    }
    try{
      const user = await prisma.user.create({
        data:{
          email: body.email,
          password: body.password,
          name: body.name
        }
      })
      const jwt = await sign({id: user.id} ,c.env.JWT_SECRET);
      // return c.text(jwt);
      return c.json({ jwt, userId: user.id })
        // return c.text("Hello");
      }
    catch(e){
      console.log(e);
      c.status(403);
      return c.json({error: "problem in signup"});
    }
  });
  
userRouter.post('/signin',async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
    const body = await c.req.json();
    const {success} = signupInput.safeParse(body);//zod validation
    if (!success){
      c.status(411);
      return c.json({
          message:"Inputs are not correct"
      })
    }
    try{
      const user = await prisma.user.findFirst({
        where: {
          email: body.email,
          password: body.password
        } 
      });
      if(!user){
        return c.json({error: "User does not exist"});
      }
      const jwt = await sign({id: user.id},c.env.JWT_SECRET);
      // return c.json({jwt})
      return c.json({ jwt, userId: user.id })
    }
    catch(e){
      console.log(e);
      c.status(403);
      return c.json({error: "Invalid creds"});
    }
});

//use authmdw here
userRouter.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10); // Convert id to number

  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        posts: {
          where: {
            published: true,
          },
        },
      },
    });

    console.log(user);

    return c.json({
      user,
    });
  } catch (error) {
    console.log("Error: " + error);

    c.status(403);
    return c.json({
      message: "Internal Server Error",
    });
  }
});

