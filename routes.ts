import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema, insertContactMessageSchema } from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all cars
  app.get("/api/cars", async (req, res) => {
    try {
      const cars = await storage.getCars();
      res.json(cars);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cars" });
    }
  });

  // Get cars by brand
  app.get("/api/cars/brand/:brand", async (req, res) => {
    try {
      const { brand } = req.params;
      const cars = await storage.getCarsByBrand(brand);
      res.json(cars);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cars by brand" });
    }
  });

  // Get car by id
  app.get("/api/cars/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid car ID" });
      }

      const car = await storage.getCarById(id);
      if (!car) {
        return res.status(404).json({ message: "Car not found" });
      }

      res.json(car);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch car" });
    }
  });

  // Create booking
  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      
      // Verify car exists and is available
      const car = await storage.getCarById(bookingData.carId);
      if (!car) {
        return res.status(404).json({ message: "Car not found" });
      }
      
      if (!car.isAvailable) {
        return res.status(400).json({ message: "Car is not available for booking" });
      }
      
      // Convert string dates to actual Date objects if they're not already
      if (typeof bookingData.pickupDate === 'string') {
        bookingData.pickupDate = new Date(bookingData.pickupDate);
      }
      
      if (typeof bookingData.returnDate === 'string') {
        bookingData.returnDate = new Date(bookingData.returnDate);
      }
      
      // Basic validation
      if (bookingData.pickupDate >= bookingData.returnDate) {
        return res.status(400).json({ 
          message: "Return date must be after pickup date" 
        });
      }
      
      // Create booking
      const booking = await storage.createBooking(bookingData);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  // Get bookings for a car
  app.get("/api/cars/:id/bookings", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid car ID" });
      }

      const bookings = await storage.getBookingsByCarId(id);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Create contact message
  app.post("/api/contact", async (req, res) => {
    try {
      const messageData = insertContactMessageSchema.parse(req.body);
      const contactMessage = await storage.createContactMessage(messageData);
      res.status(201).json(contactMessage);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
