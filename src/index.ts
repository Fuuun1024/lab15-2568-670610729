import express , {
  type Request,
  type Response,
} from "express";
import morgan from 'morgan';

const app: any = express();

//Middleware
app.use(express.json());
app.use(morgan('dev'));

import studentRouter from "./routes/studentRoutes.js";
import courseRouter from "./routes/courseRoutes.js";

app.get("/", (req: Request, res: Response) => {
  res.send("API services for Student Data");
});

app.get("/me", (req: Request, res: Response) => {

  return res.status(200).json({
        success: true,
        message: "Student Information",
        data:{
          studentId: "670610729",
          firstname: "Worapop",
          lastname: "Kerdtongsook",
          program: "CPE",
          section: "001"
        }
      });
});

app.use("/api/v2/students", studentRouter);
app.use("/api/v2/courses", courseRouter);


app.listen(3000, () =>
  console.log("🚀 Server running on http://localhost:3000")
);


export default app;
