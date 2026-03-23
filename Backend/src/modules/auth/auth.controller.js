const authService = require('./auth.service');

exports.register = async(req,res) =>{
    try{
        const user = await authService.register(req.body);
        res.status(201).json(user);
    }catch(err){
        res.status(400).json({
            error: err.message
        })
    }
}

exports.login = async(req,res) =>{
    try{
        const data = await authService.login(req.body);
        res.json(data);
    }catch(err){
        res.status(400).json({
            error: err.message
        })
    }
}


exports.getMyProfile = async (req, res, next) => {
  try {
    const userId = req.user.id; 
    const profile = await authService.getUserProfile(userId);

    if (!profile) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(profile);

  } catch (err) {
    next(err);
  }
};