const DoctorRepository = require('../repository/doctorRepo');
const Allocation = require("../models/Allocation");
const DonatedOrgan = require("../models/DonatedOrgan");
const RequestedOrgan = require("../models/RequestedOrgan");
const Notification = require("../models/Notification");
const DistanceService = require("./distanceService");
const User = require("../models/User");
const MatchScoreService = require("./matchScoreService");
const { validateAllocationTransition } = require("./allocationStateService");

class DoctorService {

  constructor() {
    this.DoctorRepository = new DoctorRepository();
    this.distanceService = new DistanceService();
    this.matchScoreService = new MatchScoreService();
  }

  normalizeOrganName(organName) {
    if (!organName) return organName;

    const mapping = {
      heart: "Heart",
      liver: "Liver",
      lungs: "Lungs",
      lung: "Lungs",
      kidney: "Kidney",
      eye: "Eye",
      eyes: "Eye"
    };

    const normalized = String(organName).trim().toLowerCase();
    return mapping[normalized] || organName;
  }

  normalizeBloodGroup(bloodGroup) {
    if (!bloodGroup) return bloodGroup;

    const normalized = String(bloodGroup).trim().toUpperCase();
    const mapping = {
      A: "A",
      "A+": "A_POS",
      A_POS: "A_POS",
      "A-": "A_NEG",
      A_NEG: "A_NEG",
      B: "B",
      "B+": "B_POS",
      B_POS: "B_POS",
      "B-": "B_NEG",
      B_NEG: "B_NEG",
      AB: "AB",
      "AB+": "AB_POS",
      AB_POS: "AB_POS",
      "AB-": "AB_NEG",
      AB_NEG: "AB_NEG",
      O: "O",
      "O+": "O_POS",
      O_POS: "O_POS",
      "O-": "O_NEG",
      O_NEG: "O_NEG"
    };

    return mapping[normalized] || normalized;
  }

  getBloodGroupSearchValues(bloodGroup) {
    const normalized = this.normalizeBloodGroup(bloodGroup);

    if (normalized === "A") return ["A_POS", "A_NEG"];
    if (normalized === "B") return ["B_POS", "B_NEG"];
    if (normalized === "AB") return ["AB_POS", "AB_NEG"];
    if (normalized === "O") return ["O_POS", "O_NEG"];

    return [normalized];
  }

  async requestOrgan(data) {
    data.organName = this.normalizeOrganName(data.organName);
    data.bloodGroup = this.normalizeBloodGroup(data.bloodGroup);
    return await this.DoctorRepository.createRequest(data);
  }

  async findAllAvailable(data, doctorId) {

    // Only normalize if the values are provided
    if (data.organName && data.organName.trim() !== "") {
      data.organName = this.normalizeOrganName(data.organName);
    } else {
      data.organName = "";
    }

    if (data.bloodGroup && data.bloodGroup.trim() !== "") {
      data.bloodGroup = this.getBloodGroupSearchValues(data.bloodGroup);
    } else {
      data.bloodGroup = null; // Don't filter by blood group if empty
    }

    const organs =
      await this.DoctorRepository.findAllAvailable(data);

    const doctor = await User.findById(doctorId);

    if (!doctor || !doctor.location)
      throw new Error("Doctor location missing");

    const enrichedOrgans = await Promise.all(
      organs.map(async (organ) => {

        if (!organ.location) {
          return {
            ...organ.toObject(),
            distance: null,
            duration: null,
            distanceKm: null,
            matchScore: 0,
            riskLevel: "UNKNOWN",
            recommendation: "INSUFFICIENT_DATA"
          };
        }

        const route =
          await this.distanceService.getDistance(
            doctor.location,
            organ.location
          );

        const distanceKm =
          route.distance ? parseFloat(route.distance) : null;

        const scoreData =
          this.matchScoreService.calculateScore({
            organName: organ.organName,
            urgencyScore: Number(data.urgencyScore || 5),
            distanceKm
          });

        const response = {
          ...organ.toObject(),
          distance: route.distance,
          duration: route.duration,
          distanceKm,
          matchScore: scoreData.matchScore,
          riskLevel: scoreData.riskLevel,
          recommendation: scoreData.recommendation
        };
        console.log(response);
        return response;
      })
    );

    enrichedOrgans.sort((a, b) => b.matchScore - a.matchScore);

    return enrichedOrgans;
  }

  async acceptOrgan({ organId, requestId ,user}) {

    const organ =
      await DonatedOrgan.findById(organId).populate("consentId");
    console.log(organ);
    if (!organ) throw new Error("Organ not found");
    if (organ.status !== "AVAILABLE")
      throw new Error("Organ not available");

    if (!organ.consentId ||
      organ.consentId.status !== "VERIFIED")
      throw new Error("Consent not verified");

    let request =
      await RequestedOrgan.findById(requestId);
    

    if (!request){
      request={};
      request.hospitalId = user.hospitalId;
    }
    // if (request.status !== "WAITING")
    //   throw new Error("Request not valid");

    const allocation = await Allocation.create({
      organId,
      requestId,
      hospitalId: request.hospitalId,
      matchScore: 100,
      status: "PENDING_CONFIRMATION"
    });
    
    organ.allocationId = allocation._id;
    organ.status = "RESERVED";
    request.status = "PENDING_CONFIRMATION";
    request.allocationId = allocation._id;

    await organ.save();
    // await request.save();

    await Notification.create({
      userId: organ.donorId,
      message: "Hospital has requested transplant. Confirm or reject.",
      allocationId: allocation._id
    });

    return allocation;
  }

  async getDoctorAllocations(doctorId, status) {
    return await this.DoctorRepository
      .getDoctorAllocations(doctorId, status);
  }

  async validateDoctorOwnership(allocationId, doctorId) {

    const allocation = await Allocation.findById(allocationId);
    if (!allocation) throw new Error("Allocation not found");

    const doctor = await User.findById(doctorId);
    if (!doctor) throw new Error("Doctor not found");

    if (doctor.role !== "DOCTOR")
      throw new Error("Only doctors allowed");

    if (
      !doctor.hospitalId ||
      allocation.hospitalId.toString() !==
      doctor.hospitalId.toString()
    ) {
      throw new Error("Unauthorized hospital access");
    }

    return allocation;
  }

  async completeAllocation(allocationId, doctorId) {

    const allocation =
      await this.validateDoctorOwnership(allocationId, doctorId);

    validateAllocationTransition(
      allocation.status,
      "COMPLETED"
    );

    const organ =
      await DonatedOrgan.findById(allocation.organId);

    const request =
      await RequestedOrgan.findById(allocation.requestId);

    allocation.status = "COMPLETED";
    allocation.completionTime = new Date();
    allocation.completedBy = doctorId;

    organ.status = "TRANSPLANTED";
    request.status = "TRANSPLANTED";

    await allocation.save();
    await organ.save();
    await request.save();

    allocation.statusHistory.push({
      status: "COMPLETED",
      timestamp: new Date()
    });

    await allocation.save();

    return allocation;
  }

  async failAllocation(allocationId, reason, doctorId) {

    const allocation =
      await this.validateDoctorOwnership(allocationId, doctorId);

    validateAllocationTransition(
      allocation.status,
      "FAILED"
    );

    const organ =
      await DonatedOrgan.findById(allocation.organId);

    const request =
      await RequestedOrgan.findById(allocation.requestId);

    allocation.status = "FAILED";
    allocation.failureReason = reason;

    organ.status = "AVAILABLE";
    request.status = "WAITING";
    request.allocationId = null;

    await allocation.save();
    await organ.save();
    await request.save();

    allocation.statusHistory.push({
      status: "FAILED",
      timestamp: new Date()
    });

    await allocation.save();

    return allocation;
  }

  async doctorDashboard(doctorId) {
    const myRequests =
      await this.DoctorRepository.getDoctorRequests(doctorId);

    const hospitalRequests =
      await this.DoctorRepository.getHospitalRequests(doctorId);

    const counts =
      await this.DoctorRepository.getDoctorDashboardCounts(doctorId);

    return {
      ...counts,
      myRequests,
      hospitalRequests
    };
  }
}

module.exports = DoctorService;
