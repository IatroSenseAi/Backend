import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minlength: 6,
    },
    faculty: {
      type: String,
      required: true,
      enum: [
        "Faculté de Médecine Dr Ben Zerjeb – Université Abou Bekr Belkaïd – Tlemcen",
        "Faculté de Médecine – Université Djillali Liabès – Sidi Bel Abbès",
        "Faculté de Médecine Ahmed Ben Zerguine – Université d'Oran 1 Ahmed Ben Bella – Oran",
        "Faculté de Médecine Moulay Driss Mansouri – Université des Sciences et de la Technologie d'Oran Mohamed Boudiaf (USTO-MB) – Oran",
        "Faculté de Médecine – Université d'Alger 1 Benyoucef Benkhedda – Alger",
        "Faculté de Médecine – Université Saâd Dahlab – Blida",
        "Faculté de Médecine – Université Ferhat Abbas Sétif 1 – Sétif",
        "Faculté de Médecine – Université Mouloud Mammeri – Tizi Ouzou",
        "Faculté de Médecine – Université Constantine 3 Salah Boubnider – Constantine",
        "Faculté de Médecine – Université Badji Mokhtar – Annaba",
        "Faculté de Médecine – Université Abderrahmane Mira – Béjaïa",
        "Faculté de Médecine – Université Kasdi Merbah – Ouargla",
        "Faculté de Médecine – Université Tahar Moulay – Béchar",
        "Faculté de Médecine – Université Amar Telidji – Laghouat",
        "Faculté de Médecine – Université de Batna 2 Mostefa Ben Boulaïd – Batna",
        "Faculté de Médecine – Université Abdelhamid Ibn Badis – Mostaganem",
      ],
    },
    specialty: {
      type: String,
      required: true,
      enum: ["medecine", "pharmacie", "dentaire"],
    },
    year: {
      type: String,
      required: true,
      enum: ["1", "2", "3", "4", "5", "6", "7"],
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    authMethod: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
