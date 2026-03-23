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

exports.getliveSlot = async(req,res,next) => {
    try{
        const studentId = req.user.id;
        const result = await studentService.getLiveSlot(studentId);
        res.json(result);
    } catch(err){
        next(err);
    }
};

exports.getDrives = async(req, res) =>{
    try{
        const drives = await studentService.getAvailableDrives();
        res.json({
            count : drives.length,
            drives
        });
    }catch(err){
        console.error(err);
        res.status(500).json({
            error: "Failed to fetch drives"
        });
    }
};

exports.getMyResults = async (req, res, next) => {
  try {
    const studentId = req.user.id; 

    const results = await studentService.getMyResults(studentId);
    
    res.status(200).json(results);
  } catch (err) {
    console.error("Controller Error:", err);
    next(err);
  }
};

