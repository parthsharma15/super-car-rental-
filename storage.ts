import { 
  Car, InsertCar, 
  Booking, InsertBooking, 
  ContactMessage, InsertContactMessage,
  User, InsertUser
} from "@shared/schema";

// Define the storage interface
export interface IStorage {
  // Car operations
  getCars(): Promise<Car[]>;
  getCarsByBrand(brand: string): Promise<Car[]>;
  getCarById(id: number): Promise<Car | undefined>;
  createCar(car: InsertCar): Promise<Car>;
  updateCar(id: number, car: Partial<Car>): Promise<Car | undefined>;
  updateCarAvailability(id: number, isAvailable: boolean): Promise<Car | undefined>;
  
  // Booking operations
  getBookings(): Promise<Booking[]>;
  getBookingById(id: number): Promise<Booking | undefined>;
  getBookingsByCarId(carId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  
  // Contact message operations
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private cars: Map<number, Car>;
  private bookings: Map<number, Booking>;
  private contactMessages: Map<number, ContactMessage>;
  private users: Map<number, User>;
  private carCurrentId: number;
  private bookingCurrentId: number;
  private messageCurrentId: number;
  private userCurrentId: number;

  constructor() {
    this.cars = new Map();
    this.bookings = new Map();
    this.contactMessages = new Map();
    this.users = new Map();
    this.carCurrentId = 1;
    this.bookingCurrentId = 1;
    this.messageCurrentId = 1;
    this.userCurrentId = 1;
    
    // Initialize with some sample car data
    this.initializeSampleCars();
  }

  // Car operations
  async getCars(): Promise<Car[]> {
    return Array.from(this.cars.values());
  }

  async getCarsByBrand(brand: string): Promise<Car[]> {
    return Array.from(this.cars.values()).filter(
      car => car.brand.toLowerCase() === brand.toLowerCase()
    );
  }

  async getCarById(id: number): Promise<Car | undefined> {
    return this.cars.get(id);
  }

  async createCar(car: InsertCar): Promise<Car> {
    const id = this.carCurrentId++;
    const newCar: Car = { ...car, id };
    this.cars.set(id, newCar);
    return newCar;
  }

  async updateCar(id: number, carUpdate: Partial<Car>): Promise<Car | undefined> {
    const car = this.cars.get(id);
    if (!car) return undefined;
    
    const updatedCar = { ...car, ...carUpdate };
    this.cars.set(id, updatedCar);
    return updatedCar;
  }

  async updateCarAvailability(id: number, isAvailable: boolean): Promise<Car | undefined> {
    return this.updateCar(id, { isAvailable });
  }

  // Booking operations
  async getBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async getBookingById(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getBookingsByCarId(carId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      booking => booking.carId === carId
    );
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const id = this.bookingCurrentId++;
    const createdAt = new Date();
    const newBooking: Booking = { ...booking, id, createdAt };
    this.bookings.set(id, newBooking);
    
    // Update car availability
    await this.updateCarAvailability(booking.carId, false);
    
    return newBooking;
  }

  // Contact message operations
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const id = this.messageCurrentId++;
    const createdAt = new Date();
    const newMessage: ContactMessage = { ...message, id, createdAt };
    this.contactMessages.set(id, newMessage);
    return newMessage;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      user => user.username === username
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const newUser: User = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }

  // Initialize sample car data
  private initializeSampleCars() {
    const sampleCars: InsertCar[] = [
      {
        name: "Lamborghini Aventador",
        brand: "Lamborghini",
        topSpeed: 350,
        horsepower: 740,
        acceleration: 2.9,
        engineType: "V12, 6.5L",
        transmission: "7-speed Automated Manual",
        fuelType: "Petrol",
        dailyRate: 175000,
        imageUrl: "https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=800&q=80",
        interiorImageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=800&q=80",
        isAvailable: true,
        isNewArrival: true,
        description: "The Lamborghini Aventador is a mid-engine sports car produced by the Italian automotive manufacturer Lamborghini."
      },
      {
        name: "Ferrari 488 GTB",
        brand: "Ferrari",
        topSpeed: 330,
        horsepower: 670,
        acceleration: 3.0,
        engineType: "V8, 3.9L Twin-Turbo",
        transmission: "7-speed Dual-Clutch",
        fuelType: "Petrol",
        dailyRate: 155000,
        imageUrl: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=800&q=80",
        isAvailable: true,
        description: "The Ferrari 488 GTB is a mid-engine sports car produced by the Italian automobile manufacturer Ferrari."
      },
      {
        name: "McLaren 720S",
        brand: "McLaren",
        topSpeed: 341,
        horsepower: 720,
        acceleration: 2.8,
        engineType: "V8, 4.0L Twin-Turbo",
        transmission: "7-speed Dual-Clutch",
        fuelType: "Petrol",
        dailyRate: 160000,
        imageUrl: "https://images.unsplash.com/photo-1614162692292-7ac56d7f373e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=800&q=80",
        isAvailable: false,
        description: "The McLaren 720S is a British mid-engine sports car designed and manufactured by McLaren Automotive."
      },
      {
        name: "Porsche 911 GT3",
        brand: "Porsche",
        topSpeed: 318,
        horsepower: 502,
        acceleration: 3.2,
        engineType: "Flat-6, 4.0L",
        transmission: "7-speed PDK",
        fuelType: "Petrol",
        dailyRate: 125000,
        imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=800&q=80",
        isAvailable: true,
        description: "The Porsche 911 GT3 is a high-performance homologation model of the Porsche 911 sports car."
      },
      {
        name: "Aston Martin Vantage",
        brand: "Aston Martin",
        topSpeed: 314,
        horsepower: 503,
        acceleration: 3.5,
        engineType: "V8, 4.0L Twin-Turbo",
        transmission: "8-speed Automatic",
        fuelType: "Petrol",
        dailyRate: 135000,
        imageUrl: "https://images.unsplash.com/photo-1580274455191-1c62238fa333?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=800&q=80",
        isAvailable: true,
        description: "The Aston Martin Vantage is a two-seater sports car manufactured by British luxury car manufacturer Aston Martin."
      },
      {
        name: "Audi R8",
        brand: "Audi",
        topSpeed: 329,
        horsepower: 562,
        acceleration: 3.1,
        engineType: "V10, 5.2L",
        transmission: "7-speed Dual-Clutch",
        fuelType: "Petrol",
        dailyRate: 120000,
        imageUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=800&q=80",
        isAvailable: true,
        description: "The Audi R8 is a mid-engine, 2-seater sports car which uses Audi's trademark quattro permanent all-wheel drive system."
      },
      {
        name: "Ferrari LaFerrari",
        brand: "Ferrari",
        topSpeed: 349,
        horsepower: 950,
        acceleration: 2.4,
        engineType: "V12 Hybrid, 6.3L",
        transmission: "7-speed Dual-Clutch",
        fuelType: "Petrol-Electric",
        dailyRate: 250000,
        imageUrl: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=800&q=80",
        isAvailable: true,
        description: "LaFerrari, project name F150, is a limited production hybrid sports car built by Italian automotive manufacturer Ferrari."
      },
      {
        name: "Bugatti Chiron",
        brand: "Bugatti",
        topSpeed: 420,
        horsepower: 1500,
        acceleration: 2.4,
        engineType: "W16 Quad-Turbo, 8.0L",
        transmission: "7-speed Dual-Clutch",
        fuelType: "Petrol",
        dailyRate: 300000,
        imageUrl: "https://images.unsplash.com/photo-1545061371-c3cb2b83f510?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=800&q=80",
        isAvailable: true,
        isNewArrival: true,
        description: "The Bugatti Chiron is a mid-engine two-seater sports car developed and manufactured by Bugatti Automobiles S.A.S."
      }
    ];

    // Add sample cars to storage
    sampleCars.forEach(car => {
      const id = this.carCurrentId++;
      const newCar: Car = { ...car, id };
      this.cars.set(id, newCar);
    });
  }
}

export const storage = new MemStorage();
