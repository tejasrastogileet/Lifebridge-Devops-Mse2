const Allocation = require("../models/Allocation");
const { validateAllocationTransition } = require("./allocationStateService");

class AllocationService {
  /**
   * Create a new allocation
   */
  async createAllocation(allocationData) {
    try {
      // Create allocation in database
      const allocation = new Allocation({
        organId: allocationData.organId,
        requestId: allocationData.requestId,
        hospitalId: allocationData.hospitalId,
        status: "PENDING_CONFIRMATION",
        matchScore: allocationData.matchScore,
        dispatchedBy: allocationData.dispatchedBy,
        statusHistory: []
      });

      await allocation.save();

      allocation.statusHistory.push({
        status: "PENDING_CONFIRMATION",
        timestamp: new Date()
      });
      await allocation.save();

      console.log("✅ Allocation created successfully:", allocation._id);
      return {
        success: true,
        allocation
      };
    } catch (error) {
      console.error("❌ Error creating allocation:", error.message);
      throw error;
    }
  }

  /**
   * Update allocation status
   */
  async updateAllocationStatus(allocationId, newStatus, updatedBy) {
    try {
      const allocation = await Allocation.findById(allocationId);
      if (!allocation) {
        throw new Error("Allocation not found");
      }

      const currentStatus = allocation.status;

      // Validate state transition
      validateAllocationTransition(currentStatus, newStatus);

      // Update status in database
      allocation.status = newStatus;

      if (newStatus === "COMPLETED") {
        allocation.completionTime = new Date();
        allocation.completedBy = updatedBy;
      } else if (newStatus === "FAILED") {
        allocation.completionTime = new Date();
      }

      allocation.statusHistory.push({
        status: newStatus,
        timestamp: new Date()
      });

      await allocation.save();

      console.log(
        `✅ Allocation status updated: ${currentStatus} → ${newStatus}`
      );
      return {
        success: true,
        allocation
      };
    } catch (error) {
      console.error("❌ Error updating allocation status:", error.message);
      throw error;
    }
  }

  /**
   * Get allocation
   */
  async getAllocation(allocationId) {
    try {
      const allocation = await Allocation.findById(allocationId)
        .populate("organId")
        .populate("requestId")
        .populate("hospitalId")
        .populate("dispatchedBy")
        .populate("completedBy");

      if (!allocation) {
        throw new Error("Allocation not found");
      }

      return {
        success: true,
        allocation
      };
    } catch (error) {
      console.error("❌ Error fetching allocation:", error.message);
      throw error;
    }
  }

  /**
   * Get allocation history
   */
  async getAllocationHistory(allocationId) {
    try {
      const allocation = await Allocation.findById(allocationId);
      if (!allocation) {
        throw new Error("Allocation not found");
      }

      return {
        success: true,
        statusHistory: allocation.statusHistory || []
      };
    } catch (error) {
      console.error("❌ Error fetching allocation history:", error.message);
      throw error;
    }
  }

  /**
   * List all allocations with pagination
   */
  async listAllocations(page = 1, limit = 10, filters = {}) {
    try {
      const query = {};

      if (filters.status) {
        query.status = filters.status;
      }

      const total = await Allocation.countDocuments(query);
      const allocations = await Allocation.find(query)
        .populate("organId")
        .populate("requestId")
        .populate("hospitalId")
        .populate("dispatchedBy")
        .populate("completedBy")
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

      return {
        success: true,
        allocations,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error("❌ Error listing allocations:", error.message);
      throw error;
    }
  }
}

module.exports = AllocationService;
