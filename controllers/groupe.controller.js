const groupeModel = require("../models/groupe.model");
const userModel = require("../models/users.model");
const Groupe = require("../models/groupe.model");
const calendarModel = require("../models/calendar.model");
const { authController } = require("./auth.router");
const mongoose = require("mongoose");

const groupCreation = async (req, res) => {
  try {
    const { NomDeGroupe, Abbreviation, enseignant } = req.body;
    const groupe = new Groupe({ NomDeGroupe, Abbreviation, enseignant });
    await groupe.save();
    res.json({ message: "Groupe créé avec succès", groupe });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur serveur lors de la création du groupe" });
  }
};

const addUserToGroup = async (req, res) => {
  try {
    const { userId, groupId } = req.body;

    // Find the group by its ID
    const group = await Groupe.findById(groupId);

    if (!group) {
      return res.status(404).send({ error: "Group not found" });
    }

    // Check if the group already has the maximum number of users
    if (group.users.length >= 10) {
      return res.status(400).send({ error: "Ce groupe est plein" });
    }

    // Add the user to the group's users array if not already present
    if (!group.users.includes(userId)) {
      group.users.push(userId);
    }

    // Save the updated group document
    await group.save();

    return res.send({ group });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur serveur lors de l'ajout d'eleve à la groupe" });
  }
};

const findAllGroupe = async (req, res) => {
  const groupe = await groupeModel.find();
  return res.send(groupe);
};

const deleteGroupe = async (req, res) => {
  const groupe = await groupeModel.deleteOne({ _id : req.params.id });
  return res.send(groupe);
};

const addCalendarEntriesForGroup = async (req, res) => {
  try {
    // Parse request data
    const { groupId, specialiteId, start, durationInMinutes } = req.body;
    const validObjectId = new mongoose.Types.ObjectId(specialiteId);

    // Fetch group
    const group = await groupeModel.findById(groupId);

    // Check if group exists
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Calculate end time based on start time and duration
    const endDate = new Date(start);
    endDate.setMinutes(endDate.getMinutes() + durationInMinutes);

    // Fetch existing calendar entries for the group and time range
    const existingEntries = await calendarModel.find({
      specialityId: validObjectId,
      $or: [
        { startDate: { $lt: start }, endDate: { $gt: start } }, // New event starts during existing event
        { startDate: { $lt: endDate }, endDate: { $gt: endDate } }, // New event ends during existing event
        { startDate: { $gte: start }, endDate: { $lte: endDate } }, // Existing event falls completely within new event
      ],
    });

    // If there are existing entries, return error
    if (existingEntries.length > 0) {
      return res
        .status(400)
        .json({ error: "Group is already studying a specialite at this time" });
    }

    // Fetch users in the group
    const users = group.users;

    // Create calendar entries for each user
    await Promise.all(
      users.map(async (user) => {
        // Create calendar entry
        const calendarEntry = new calendarModel({
          userId: user._id,
          specialityId: validObjectId,
          startDate: start,
          endDate: endDate,
          durationInMinutes: durationInMinutes,
        });

        // Save calendar entry
        await calendarEntry.save();
      })
    );

    // Send success response
    res.status(201).json({ message: "Calendar entries added successfully" });
  } catch (error) {
    console.error("Error adding calendar entries:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};




const getCalendarEventsByUserId = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; 
    const user = await authController.getUserFromToken(token);

    if (!user) {
      return res.status(401).send("Unauthorized: Invalid token");
    }

    const calendarEvents = await calendarModel.find({ userId: user._id });

    res.send(calendarEvents);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
};

const getAllCalendarEvents = async (req, res) => {
  try {
    // Retrieve all calendar events
    const calendarEvents = await calendarModel.find();

    res.send(calendarEvents);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
};

const deleteCalendarEventById = async (req, res) => {
  try {
    const eventId = req.params.id;

    // Check if the provided ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ error: "Invalid event ID" });
    }

    // Find the calendar event by ID and delete it
    const deletedEvent = await calendarModel.findByIdAndDelete(eventId);

    // If event doesn't exist, return error
    if (!deletedEvent) {
      return res.status(404).json({ error: "Calendar event not found" });
    }

    // Send success response
    res.json({ message: "Calendar event deleted successfully" });
  } catch (error) {
    console.error("Error deleting calendar event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};





module.exports.groupeController = {
  groupCreation,
  addUserToGroup,
  findAllGroupe,
  deleteGroupe,
  addCalendarEntriesForGroup,
  getCalendarEventsByUserId,
  getAllCalendarEvents,
  deleteCalendarEventById
};
