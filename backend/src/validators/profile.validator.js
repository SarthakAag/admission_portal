const { z } = require("zod");

const optionalText = (max = 200) =>
  z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().trim().max(max).optional()
  );

const optionalYear = z.preprocess(
  (value) => (value === "" || value === null ? undefined : Number(value)),
  z.number().int().min(1950).max(2100).optional()
);

const optionalPercentage = z.preprocess(
  (value) => (value === "" || value === null ? undefined : Number(value)),
  z.number().min(0).max(100).optional()
);

const profileSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  phone: z.string().trim().regex(/^[0-9]{10}$/, "Phone must be 10 digits"),
  dateOfBirth: optionalText(30),
  gender: optionalText(30),
  nationality: optionalText(100),

  address: optionalText(500),
  city: optionalText(100),
  state: optionalText(100),
  postalCode: optionalText(20),

  tenthBoard: optionalText(150),
  tenthYear: optionalYear,
  tenthPercentage: optionalPercentage,

  twelfthBoard: optionalText(150),
  twelfthYear: optionalYear,
  twelfthStream: optionalText(100),
  twelfthPercentage: optionalPercentage,
});

module.exports = { profileSchema };