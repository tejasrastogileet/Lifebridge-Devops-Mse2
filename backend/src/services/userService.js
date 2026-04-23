const UserRepository = require("../repository/userRepo");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/serverConfig");
const Hospital = require("../models/Hospital");
const GeocodingService = require("./geocodingService");

class UserService {

  constructor() {
    this.userRepository = new UserRepository();
    this.geocodingService = new GeocodingService();
  }

  async createUser(data) {
    const locationText = (data.address || data.city || "").trim();

    let coordinates = null;
    if (locationText) {
      try {
        coordinates = await this.geocodingService.getCoordinates(locationText);
      } catch (error) {
        // Do not block signup if geocoding service fails.
        coordinates = null;
      }
    }

    if (data.role === "DONOR") {
      const user =  await this.userRepository.createUser({
        ...data,
        location: coordinates
      });
      return jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          JWT_SECRET,
          { expiresIn: "1h" }
        );
    }

    const normalizedHospitalName = (data.hospitalName || "").trim();
    if (!normalizedHospitalName) {
      throw new Error("Hospital name is required for doctor signup");
    }

    const hospitalLocation = (data.address || data.city || "").trim();

    let hospitalObj = await Hospital.findOne({
      name: { $regex: `^${normalizedHospitalName}$`, $options: "i" },
      address: { $regex: `^${hospitalLocation}$`, $options: "i" }
    }).select("_id");

    // If hospital is not pre-seeded, create it so doctor onboarding is not blocked.
    if (!hospitalObj) {
      hospitalObj = await Hospital.create({
        name: normalizedHospitalName,
        address: hospitalLocation
      });
    }

    const user = await this.userRepository.createUser({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      hospitalId: hospitalObj._id,
      phoneNumber: data.phoneNumber || data.phone,
      address: hospitalLocation,
      location: coordinates
    });

    return jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          JWT_SECRET,
          { expiresIn: "1h" }
        );
  }

  async login(data) {

    const user = await this.userRepository.findUser(data);

    if (!user) throw new Error("Email does not exist");

    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) throw new Error("Invalid Password!");

    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
  }
}

module.exports = UserService;
