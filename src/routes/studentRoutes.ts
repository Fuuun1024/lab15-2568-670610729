import { Router, type Request, type Response } from "express";
import { zStudentId } from "../schemas/studentValidator.js";
import { students } from "../db/db.js";
import { courses } from "../db/db.js";
//import type { Student } from "../libs/types.js";

const router = Router();

router.get("/:studentId/courses",(req: Request, res: Response) => {
    try{
        const studentId = req.params.studentId;
        const result = zStudentId.safeParse(studentId);

        if (!result.success) {
            return res.status(400).json({
                //success: false,
                message: "Validation failed",
                errors: result.error.issues[0]?.message,
            });
        }

        const foundIndex = students.findIndex(
        (student) => student.studentId === studentId
        );


        if (foundIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Student does not exists",
            });
        }

//--------------------------------------------------------------------------------//
        const studentCourses = students[foundIndex]?.courses?.map(courseId => { // นำรหัสวิชาที่นักศึกษาลงมา map // courseId เป็นค่าปัจจุบันที่กำลังประมวลผล
            const course = courses.find(c => c.courseId === courseId); // find คือเมทอดของอาเรย์ที่ค้นหา element แรกที่เงื่อนไขเป็นจริง แล้วคืนค่านั้น
            // course จะเป็นออบเจกต์วิชา 
                return { //สร้างออบเจกต์ใหม่ที่มีแค่สองฟิลด์ตามที่เราต้องการ
                    courseId: course?.courseId,
                    courseTitle: course?.courseTitle,
                };
        });

        return res.status(200).json({
            success: true,
            message: `Get courses detail of student ${studentId}`,
            data: {
                studentId: students[foundIndex]?.studentId,
                studentCourses
            }
    });
//--------------------------------------------------------------------------------//
        // let courses_data = {
        //     studentId: students[foundIndex].studentId,
        //     courses: //filtered_courses
        //     students[foundIndex].courses
        // }

        // return res.json({
        //     success: true,
        //     message: `successfully`,
        //     data: 
        //     courses_data,
    // });
//--------------------------------------------------------------------------------//

    }catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something is wrong, please try again",
            error: err,
    });

    }
});

export default router;
