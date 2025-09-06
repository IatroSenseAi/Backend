import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
  const { credential } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name: username } = payload;

    let user = await User.findOne({
      $or: [{ googleId }, { email }],
    });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        user.authMethod = "google";
        await user.save();
      }

      generateToken(user._id, res);

      return res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        faculty: user.faculty,
        specialty: user.specialty,
        year: user.year,
        authMethod: user.authMethod,
      });
    }

    // Create a temporary user with only basic info
    // Use a valid enum value for faculty instead of "Temporaire - À compléter"
    const newUser = new User({
      username,
      email,
      googleId,
      authMethod: "google",
      // Use the first valid enum value as a placeholder
      faculty:
        "Faculté de Médecine Dr Ben Zerjeb – Université Abou Bekr Belkaïd – Tlemcen",
      specialty: "medecine",
      year: "1",
      // Add a flag to indicate this is a temporary profile
      isTemporaryProfile: true,
    });

    await newUser.save();
    generateToken(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      faculty: newUser.faculty,
      specialty: newUser.specialty,
      year: newUser.year,
      authMethod: newUser.authMethod,
      needsProfileCompletion: true,
    });
  } catch (error) {
    console.log("Error in googleAuth controller", error.message);
    res.status(500).json({ message: "Erreur serveur interne" });
  }
};

export const completeGoogleProfile = async (req, res) => {
  const { faculty, specialty, year } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    if (user.authMethod !== "google") {
      return res
        .status(400)
        .json({ message: "Méthode d'authentification invalide" });
    }

    user.faculty = faculty;
    user.specialty = specialty;
    user.year = year;
    user.isTemporaryProfile = false; // Remove the temporary flag

    await user.save();

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      faculty: user.faculty,
      specialty: user.specialty,
      year: user.year,
      authMethod: user.authMethod,
    });
  } catch (error) {
    console.log("Error in completeGoogleProfile controller", error.message);
    res.status(500).json({ message: "Erreur serveur interne" });
  }
};
