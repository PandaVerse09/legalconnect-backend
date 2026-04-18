const mongoose = require("mongoose");

const lawyerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: Number,
      required: true,
      min: 0,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    specialization: {
      type: [String],
      default: [],
    },
    about: {
      type: String,
      default: "",
      trim: true,
    },
    languages: {
      type: [String],
      default: [],
    },
    fee: {
      type: Number,
      default: 0,
      min: 0,
    },
    photo: {
      type: String,
      default: "",
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    cases: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "approved"],
      default: "approved",
      index: true,
    },
  },
  { timestamps: true }
);

const Lawyer = mongoose.models.Lawyer || mongoose.model("Lawyer", lawyerSchema);

function sanitizeLawyer(lawyer) {
  const normalizedName = lawyer.name || lawyer.fullName || "";
  const normalizedTitle = lawyer.title || lawyer.practiceArea || "Advocate";
  const normalizedExperience = lawyer.experience ?? lawyer.yearsOfExperience ?? 0;
  const normalizedLocation = lawyer.location || lawyer.city || "";
  const normalizedSpecialization = Array.isArray(lawyer.specialization) && lawyer.specialization.length > 0
    ? lawyer.specialization
    : [lawyer.practiceArea || normalizedTitle].filter(Boolean);
  const firstSpecialization = normalizedSpecialization[0] || "General Law";

  return {
    id: lawyer._id.toString(),
    name: normalizedName,
    email: lawyer.email,
    phone: lawyer.phone,
    title: normalizedTitle,
    experience: normalizedExperience,
    location: normalizedLocation,
    specialization: normalizedSpecialization,
    about: lawyer.about || "",
    languages: Array.isArray(lawyer.languages) ? lawyer.languages : [],
    fee: lawyer.fee ?? 0,
    photo: lawyer.photo || "",
    rating: lawyer.rating ?? 0,
    reviews: lawyer.reviews ?? 0,
    cases: lawyer.cases ?? 0,
    status: lawyer.status || "approved",
    // Legacy aliases for existing admin consumers.
    fullName: normalizedName,
    practiceArea: firstSpecialization,
    yearsOfExperience: normalizedExperience,
    city: normalizedLocation,
    createdAt: lawyer.createdAt,
    updatedAt: lawyer.updatedAt,
  };
}

function normalizeLawyerPayload(payload = {}, options = { partial: false }) {
  const result = {};
  const isPartial = options.partial === true;

  const resolvedName = payload.name ?? payload.fullName;
  const resolvedTitle = payload.title ?? payload.practiceArea;
  const resolvedExperience = payload.experience ?? payload.yearsOfExperience;
  const resolvedLocation = payload.location ?? payload.city;

  if (resolvedName !== undefined) {
    result.name = String(resolvedName).trim();
  }

  if (payload.email !== undefined) {
    result.email = String(payload.email).toLowerCase().trim();
  }

  if (payload.phone !== undefined) {
    result.phone = String(payload.phone).trim();
  }

  if (resolvedTitle !== undefined) {
    result.title = String(resolvedTitle).trim();
  }

  if (resolvedLocation !== undefined) {
    result.location = String(resolvedLocation).trim();
  }

  if (resolvedExperience !== undefined && resolvedExperience !== null) {
    const experience = Number(resolvedExperience);
    if (Number.isNaN(experience) || experience < 0) {
      return { error: "Years of experience must be a valid non-negative number." };
    }
    result.experience = experience;
  }

  if (payload.specialization !== undefined) {
    if (!Array.isArray(payload.specialization)) {
      return { error: "Specialization must be an array of strings." };
    }
    result.specialization = payload.specialization
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (payload.languages !== undefined) {
    if (!Array.isArray(payload.languages)) {
      return { error: "Languages must be an array of strings." };
    }
    result.languages = payload.languages
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (payload.about !== undefined) {
    result.about = String(payload.about).trim();
  }

  if (payload.fee !== undefined && payload.fee !== null) {
    const fee = Number(payload.fee);
    if (Number.isNaN(fee) || fee < 0) {
      return { error: "Fee must be a valid non-negative number." };
    }
    result.fee = fee;
  }

  if (payload.photo !== undefined) {
    result.photo = String(payload.photo).trim();
  }

  if (payload.rating !== undefined && payload.rating !== null) {
    const rating = Number(payload.rating);
    if (Number.isNaN(rating) || rating < 0 || rating > 5) {
      return { error: "Rating must be between 0 and 5." };
    }
    result.rating = rating;
  }

  if (payload.reviews !== undefined && payload.reviews !== null) {
    const reviews = Number(payload.reviews);
    if (Number.isNaN(reviews) || reviews < 0) {
      return { error: "Reviews must be a valid non-negative number." };
    }
    result.reviews = reviews;
  }

  if (payload.cases !== undefined && payload.cases !== null) {
    const cases = Number(payload.cases);
    if (Number.isNaN(cases) || cases < 0) {
      return { error: "Cases must be a valid non-negative number." };
    }
    result.cases = cases;
  }

  if (payload.status !== undefined) {
    const status = String(payload.status).trim().toLowerCase();
    if (!["pending", "approved"].includes(status)) {
      return { error: "Status must be either pending or approved." };
    }
    result.status = status;
  }

  if (!isPartial) {
    const required = ["name", "email", "phone", "experience", "location"];
    for (const field of required) {
      if (result[field] === undefined || result[field] === null || result[field] === "") {
        return { error: "Name, email, phone, experience, and location are required." };
      }
    }

    if (!result.title) {
      result.title = "Advocate";
    }

    if (!Array.isArray(result.specialization) || result.specialization.length === 0) {
      result.specialization = [String(payload.practiceArea || result.title).trim()].filter(Boolean);
    }

    if (result.about === undefined) {
      result.about = "Profile details will be updated soon.";
    }

    if (!Array.isArray(result.languages)) {
      result.languages = [];
    }

    if (result.fee === undefined) {
      result.fee = 0;
    }
  }

  if (isPartial && Object.keys(result).length === 0) {
    return { error: "At least one field is required for update." };
  }

  return { data: result };
}

async function createLawyer(payload, options = {}) {
  const normalized = normalizeLawyerPayload(payload, { partial: false });
  if (normalized.error) {
    return { error: normalized.error };
  }

  const creationData = { ...normalized.data };
  const forceStatus = options.forceStatus;
  if (forceStatus) {
    const normalizedStatus = String(forceStatus).trim().toLowerCase();
    if (!["pending", "approved"].includes(normalizedStatus)) {
      return { error: "Invalid force status provided." };
    }
    creationData.status = normalizedStatus;
  }

  const lawyer = await Lawyer.create(creationData);

  return { lawyer: sanitizeLawyer(lawyer) };
}

async function getAllLawyers(options = {}) {
  const query = {};

  if (options.status) {
    const normalizedStatus = String(options.status).trim().toLowerCase();
    if (normalizedStatus === "approved") {
      query.$or = [{ status: "approved" }, { status: { $exists: false } }, { status: null }];
    } else {
      query.status = normalizedStatus;
    }
  }

  const lawyers = await Lawyer.find(query).sort({ createdAt: -1 });
  return lawyers.map(sanitizeLawyer);
}

async function getLawyerById(id) {
  if (!mongoose.isValidObjectId(id)) {
    return { error: "Invalid lawyer id." };
  }

  const lawyer = await Lawyer.findById(id);
  if (!lawyer) {
    return { notFound: true };
  }

  return { lawyer: sanitizeLawyer(lawyer) };
}

async function updateLawyerById(id, payload) {
  if (!mongoose.isValidObjectId(id)) {
    return { error: "Invalid lawyer id." };
  }

  const normalized = normalizeLawyerPayload(payload, { partial: true });
  if (normalized.error) {
    return { error: normalized.error };
  }

  const lawyer = await Lawyer.findByIdAndUpdate(id, normalized.data, {
    new: true,
    runValidators: true,
  });

  if (!lawyer) {
    return { notFound: true };
  }

  return { lawyer: sanitizeLawyer(lawyer) };
}

async function deleteLawyerById(id) {
  if (!mongoose.isValidObjectId(id)) {
    return { error: "Invalid lawyer id." };
  }

  const lawyer = await Lawyer.findByIdAndDelete(id);
  if (!lawyer) {
    return { notFound: true };
  }

  return { lawyer: sanitizeLawyer(lawyer) };
}

module.exports = {
  createLawyer,
  getAllLawyers,
  getLawyerById,
  updateLawyerById,
  deleteLawyerById,
};
