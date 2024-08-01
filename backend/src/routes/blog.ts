import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from 'hono/jwt'
import { createBlogInput,updateBlogInput } from '@srijanpathak/blog-common'

//this is needed to remove the ts error in accessing env variables
export const blogRouter = new Hono<{
	Bindings: {
		DATABASE_URL: string
        JWT_SECRET : string
	},
    Variables: {
        userId: string
    }
}>();

interface AuthenticatedUser {
    id: string; // Ensure the user has an id of type string.
  }
//auth middlewere
blogRouter.use("/*", async (c, next) => {
    const authHeader = c.req.header("authorization") || "";
    // const token = header.split(" ")[1];  //for Barer token
    const user = await verify(authHeader, c.env.JWT_SECRET) as unknown as AuthenticatedUser
    if(user){
        c.set("userId",user.id);
        await next();
    }else{
      c.status(404);
      return c.json({error : "Not logged in"})
    }
  });

  blogRouter.post('/', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const authorId = c.get("userId");
    const body = await c.req.json();
    const { success } = createBlogInput.safeParse(body);
    if (!success) {
      c.status(411);
      return c.json({
        message: "Inputs are not correct"
      })
    }
    const blog = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: parseInt(authorId),
        imageUrl: body.imageUrl // Add this line to handle the imageUrl
      }
    })
    return c.json({ id: blog.id })
  });
  
  blogRouter.put('/', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const body = await c.req.json();
    const { success } = updateBlogInput.safeParse(body);
    if (!success) {
      c.status(411);
      return c.json({
        message: "Inputs are not correct"
      })
    }
    const blog = await prisma.post.update({
      where: {
        id: body.id
      },
      data: {
        title: body.title,
        content: body.content,
        imageUrl: body.imageUrl // Add this line to handle the imageUrl
      }
    })
    return c.json({ id: blog.id });
  });

  blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    
    try {
      const blogs = await prisma.post.findMany({
        select: {
          id: true,
          title: true,
          content: true,
          imageUrl: true,
          createdAt: true, // Include createdAt
          author: {
            select: {
              name: true
            },
          },
          _count: {
            select: {
              likes: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc' // Sort by createdAt in descending order
        }
      });
      
      const transformedBlogs = blogs.map(blog => ({
        id: blog.id,
        title: blog.title,
        content: blog.content,
        authorName: blog.author.name,
        likesCount: blog._count.likes,
        imageUrl: blog.imageUrl,
        createdAt: blog.createdAt // Include createdAt in the response
      }));
      
      return c.json({ blogs: transformedBlogs });
    } catch (error) {
      console.error('Error fetching blogs:', error);
      c.status(500);
      return c.json({ error: 'Internal Server Error' });
    }
  });
  
  blogRouter.get('/:id', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const id = c.req.param("id");
    try {
      const blog = await prisma.post.findFirst({
        where: {
          id: id
        },
        select: {
          id: true,
          title: true,
          content: true,
          imageUrl: true,
          createdAt: true, // Include createdAt
          author: {
            select: {
              name: true
            }
          },
          comments: {
            select: {
              id: true,
              content: true,
              createdAt: true,
              author: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      });
      
      if (!blog) {
        c.status(404);
        return c.json({ error: "Blog not found" });
      }
      
      return c.json({ 
        blog: {
          ...blog,
          authorName: blog.author.name
        }
      });
    }
    catch (e) {
      console.error('Error fetching blog:', e);
      c.status(500);
      return c.json({ error: "Internal Server Error" });
    }
  });

// Route to like a post
blogRouter.post('/like', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    // const postId = c.req.param('id');
    const { postId } = await c.req.json();
    try {
      // Create a like entry for the post
      await prisma.like.create({
        data: {
          postId: postId,
        },
      });
      const likesCount = await prisma.like.count({
        where: { postId: postId },
      });
      c.header('Content-Type', 'application/json');// Ensure the response is JSON
      return c.json({ likes: likesCount });
    } catch (error) {
      console.error('Error liking the post:', error);
      c.status(500);
      return c.json({ error: 'Internal Server Error' });
    }
  });
  
  // Route to unlike a post
  blogRouter.post('/unlike', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    // const postId = c.req.param('id');
    const { postId } = await c.req.json();
  
    // Find the most recent like for this post to remove it (unlike)
    const like = await prisma.like.findFirst({
      where: { postId: postId },
      orderBy: { createdAt: 'desc' },
    });
  
    if (like) {
      await prisma.like.delete({
        where: { id: like.id },
      });
    }
  
    // Get the updated like count
    const likesCount = await prisma.like.count({
      where: { postId: postId },
    });
  
    return c.json({ likes: likesCount });
  });
  
  // Route to get the number of likes for a post
  blogRouter.get('/likes', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const postId = c.req.param('id');
  
    const likesCount = await prisma.like.count({
      where: { postId: postId },
    });
  
    return c.json({ likes: likesCount });
});
  

// Route to delete a blog
blogRouter.delete('/:id', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const blogId = c.req.param('id');
  const authorId = c.get("userId");

  // Check if the blog belongs to the user
  const existingBlog = await prisma.post.findFirst({
    where: {
      id: blogId,
      authorId: parseInt(authorId)
    }
  });

  if (!existingBlog) {
    c.status(403);
    return c.json({ error: "You do not have permission to delete this blog" });
  }

  try {
    await prisma.post.delete({
      where: {
        id: blogId,
      },
    });

    return c.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    c.status(500);
    return c.json({ error: 'Internal Server Error' });
  }
});

blogRouter.post('/comments', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  
  const { postId, content } = await c.req.json();
  const authorId = c.get("userId");

  if (!content) {
    c.status(400);
    return c.json({ error: "Content is required" });
  }

  try {
    const newComment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: parseInt(authorId),
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return c.json(newComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    c.status(500);
    return c.json({ error: 'Internal Server Error' });
  }
});
