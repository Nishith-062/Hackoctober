import { getAuth } from "@clerk/express";
import { User } from "../models/user.model.js"; // ensure .js if using ES modules



export const getUser=async (req,res) => {
  try {
        const { userId } = getAuth(req)

        const user=User.find({clerkId:userId})

        if(!user){
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

            res.status(200).json({ success: true, user });

    
  } catch (error) {
    
  }
  
}

export const authCallBack = async (req, res) => {
  try {
    const { userId } = getAuth(req)
    const { fullName, imageUrl ,email} = req.body;

    if (!userId || !fullName) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      user = new User({
        clerkId: userId,
        fullName: fullName,
        imageUrl: imageUrl || null,
        email:email
      });
      await user.save();
    }
    res.status(200).json({ success: true, user:user });
  } catch (error) {
    console.error("Error in auth callback:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
