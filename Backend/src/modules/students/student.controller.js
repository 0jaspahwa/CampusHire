const studentService = require('../students/student.service');

exports.getMyUpcomingSlots = async(req, res, next) => {
    try{
        const studentId = req.user.id;
        const slots = await studentService.getUpcomingSlots(studentId);

        res.status(200).json({
            count: slots.length,
            slots
        });
    }catch(err){
        next(err);
    }
};