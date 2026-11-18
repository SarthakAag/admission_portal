const prisma = require("../prisma/client");
const { profileSchema } = require("../validators/profile.validator");

const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        profile: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      profile: user,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const validation = profileSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid profile information",
        errors: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const data = validation.data;
    const userId = req.user.userId;

    // Convert optional empty values into null
    const nullable = (value) => value === undefined ? null : value;

    const dateOfBirth = data.dateOfBirth
      ? new Date(data.dateOfBirth)
      : null;

    if (dateOfBirth && Number.isNaN(dateOfBirth.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date of birth",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName: data.fullName,
        phone: data.phone,
        profile: {
          upsert: {
            create: {
              dateOfBirth,
              gender: nullable(data.gender),
              nationality: nullable(data.nationality),
              address: nullable(data.address),
              city: nullable(data.city),
              state: nullable(data.state),
              postalCode: nullable(data.postalCode),

              tenthBoard: nullable(data.tenthBoard),
              tenthYear: nullable(data.tenthYear),
              tenthPercentage: nullable(data.tenthPercentage),

              twelfthBoard: nullable(data.twelfthBoard),
              twelfthYear: nullable(data.twelfthYear),
              twelfthStream: nullable(data.twelfthStream),
              twelfthPercentage: nullable(data.twelfthPercentage),
            },
            update: {
              dateOfBirth,
              gender: nullable(data.gender),
              nationality: nullable(data.nationality),
              address: nullable(data.address),
              city: nullable(data.city),
              state: nullable(data.state),
              postalCode: nullable(data.postalCode),

              tenthBoard: nullable(data.tenthBoard),
              tenthYear: nullable(data.tenthYear),
              tenthPercentage: nullable(data.tenthPercentage),

              twelfthBoard: nullable(data.twelfthBoard),
              twelfthYear: nullable(data.twelfthYear),
              twelfthStream: nullable(data.twelfthStream),
              twelfthPercentage: nullable(data.twelfthPercentage),
            },
          },
        },
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        profile: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

module.exports = { getProfile, updateProfile };