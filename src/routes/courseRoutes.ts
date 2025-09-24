import { Router, type Request, type Response } from "express";

import { courses } from "../db/db.js";

import {
  zCourseId,
  zCourseIdV2,
  zCoursePostBody,
  zCoursePutBody,
  zCourseDeleteBody,
} from "../schemas/courseValidator.js";
import type { Course } from "../libs/types.js";

const router: Router = Router();

// READ all
router.get("/", (req: Request, res: Response) => {
    try {
        return res.status(200).json({
            success: true,
            message: `Get all courses successfully`,
            data: courses,
        });
    } catch (err) {
        return res.status(500).json({
        success: false,
        message: "Something is wrong, please try again",
        error: err,
        });
  }
});

// Params URL 
router.get("/:courseId", (req: Request, res: Response) => {
    try{
        const strcourseId = req.params.courseId;
        const courseId = Number(strcourseId);
        const result = zCourseIdV2.safeParse(courseId);

        if (!result.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: result.error.issues[0]?.message,
            });
        }

        const foundIndex = courses.findIndex(
            (course) => course.courseId === courseId
        );

        if (foundIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Course does not exists",
            });
        }


        return res.status(200).json({
            success: true,
            message: `Get courses ${strcourseId} successfully`,
            data: courses[foundIndex] 
        });

    }catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something is wrong, please try again",
            error: err,
    });
    }



});

router.post("/", (req: Request, res: Response) => {
    try {
    const body = req.body as Course;

    // validate req.body with predefined validator
    const result = zCoursePostBody.safeParse(body); // check zod
    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues[0]?.message,
      });
    }

    //check duplicate courseId
    const found = courses.find(
      (course) => course.courseId === body.courseId
    );

    if (found) {
      return res.status(409).json({
        success: false,
        message: "Course Id already exists",
      });
    }

    // add new 
    const new_course = body;
    courses.push(new_course);

    // add response header 'Link'
    res.set("Link", `/${new_course.courseId}`);

    return res.status(201).json({
      success: true,
       message: `Course ${new_course.courseId} has been added successfully`,
      data: new_course,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Somthing is wrong, please try again",
      error: err,
    });
  }
});

router.put("/", (req: Request, res: Response) => {
    try {
    const body = req.body as Course;


    const result = zCoursePutBody.safeParse(body); // check zod
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues[0]?.message,
      });
    }

    const foundIndex = courses.findIndex(
            (course) => course.courseId === body.courseId
        );

    if (foundIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "Course does not exists",
        });
    }

    //update course
    courses[foundIndex] = { ...courses[foundIndex], ...body };

    res.set("Link", `/${body.courseId}`);

    return res.status(200).json({
      success: true,
      message: `course ${body.courseId} has been updated successfully`,
      data: courses[foundIndex],
    });


    }catch (err) {
    return res.status(500).json({
      success: false,
      message: "Somthing is wrong, please try again",
      error: err,
    });
  }
});

router.delete("/",(req: Request, res: Response) => {
    try {
    const body = req.body as Course;


    const result = zCourseDeleteBody.safeParse(body); // check zod
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues[0]?.message,
      });
    }

    const foundIndex = courses.findIndex(
        (course) => course.courseId === body.courseId
    );

    if (foundIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "Course does not exists",
        });
    }

    
    res.status(200).json({
      success: true,
      message: `Course ${body.courseId} has been deleted successfully`,
       data: courses[foundIndex],
    });
    //delete found course from array
    courses.splice(foundIndex, 1);

    }catch (err) {
    return res.status(500).json({
      success: false,
      message: "Somthing is wrong, please try again",
      error: err,
    });
  }

});

export default router;
