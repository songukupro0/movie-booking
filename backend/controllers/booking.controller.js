const Booking = require('../models/booking.model');
const Showtime = require('../models/showtime.model');
const Room = require('../models/room.model');
const Movie = require('../models/movie.model');
const Cinema = require('../models/cinema.model');

const HOLD_MINUTES = 10;

function generateBookingCode() {
  return `MB${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 900 + 100)}`;
}

function getSeatPrice(basePrice, seatCode) {
  const row = seatCode.charAt(0).toUpperCase();
  if (['A', 'B'].includes(row)) return Math.round(basePrice * 1.5);
  if (['C', 'D', 'E'].includes(row)) return Math.round(basePrice * 1.2);
  return basePrice;
}

function cleanupExpiredLocks(showtime) {
  const now = new Date();
  showtime.lockedSeats = (showtime.lockedSeats || []).filter(lock => new Date(lock.lockedUntil) > now);
}

exports.getSeatMap = async (req, res) => {
  try {
    const { showtimeId } = req.params;
    const showtime = await Showtime.findById(showtimeId).populate('movieId cinemaId roomId');

    if (!showtime) {
      return res.status(404).json({ message: 'Không tìm thấy suất chiếu.' });
    }

    cleanupExpiredLocks(showtime);
    await showtime.save();

    const room = await Room.findById(showtime.roomId);
    if (!room) {
      return res.status(404).json({ message: 'Không tìm thấy phòng chiếu.' });
    }

    const lockedSeatCodes = new Set((showtime.lockedSeats || []).map(lock => lock.seatCode));
    const bookedSeatCodes = new Set(showtime.bookedSeats || []);

    const seats = room.seatLayout.map(seat => ({
      id: seat.code,
      type: seat.type,
      price: getSeatPrice(showtime.basePrice, seat.code),
      status: bookedSeatCodes.has(seat.code) || lockedSeatCodes.has(seat.code)
        ? 'occupied'
        : seat.status === 'maintenance'
          ? 'maintenance'
          : 'available'
    }));

    return res.json({
      showtime: {
        id: showtime._id,
        startTime: showtime.startTime,
        endTime: showtime.endTime,
        format: showtime.format,
        language: showtime.language,
        basePrice: showtime.basePrice,
      },
      movie: showtime.movieId ? {
        id: showtime.movieId._id,
        title: showtime.movieId.title,
        image: showtime.movieId.image,
        ageRating: showtime.movieId.ageRating,
      } : null,
      cinema: showtime.cinemaId ? {
        id: showtime.cinemaId._id,
        name: showtime.cinemaId.name,
        address: showtime.cinemaId.address,
      } : null,
      room: {
        id: room._id,
        name: room.name,
        capacity: room.capacity,
      },
      seats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const { showtimeId, seats, paymentMethod } = req.body;

    if (!showtimeId || !Array.isArray(seats) || seats.length === 0 || !paymentMethod) {
      return res.status(400).json({ message: 'Thiếu dữ liệu đặt vé.' });
    }

    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) {
      return res.status(404).json({ message: 'Không tìm thấy suất chiếu.' });
    }

    cleanupExpiredLocks(showtime);

    const room = await Room.findById(showtime.roomId);
    if (!room) {
      return res.status(404).json({ message: 'Không tìm thấy phòng chiếu.' });
    }

    const seatSet = new Set(room.seatLayout.map(seat => seat.code));
    const alreadyBooked = new Set(showtime.bookedSeats || []);
    const alreadyLocked = new Set((showtime.lockedSeats || []).map(lock => lock.seatCode));

    for (const seatCode of seats) {
      if (!seatSet.has(seatCode)) {
        return res.status(400).json({ message: `Ghế ${seatCode} không tồn tại trong phòng.` });
      }
      if (alreadyBooked.has(seatCode) || alreadyLocked.has(seatCode)) {
        return res.status(409).json({ message: `Ghế ${seatCode} đã được người khác chọn.` });
      }
    }

    const seatDetails = seats.map(seatCode => {
      const roomSeat = room.seatLayout.find(seat => seat.code === seatCode);
      return {
        seatCode,
        seatType: roomSeat?.type || 'standard',
        price: getSeatPrice(showtime.basePrice, seatCode),
      };
    });

    const totalAmount = seatDetails.reduce((sum, seat) => sum + seat.price, 0);
    const expiresAt = new Date(Date.now() + HOLD_MINUTES * 60 * 1000);

    showtime.lockedSeats.push(
      ...seatDetails.map(seat => ({
        seatCode: seat.seatCode,
        lockedUntil: expiresAt,
      }))
    );
    await showtime.save();

    try {
      const booking = await Booking.create({
        showtimeId: showtime._id,
        movieId: showtime.movieId,
        cinemaId: showtime.cinemaId,
        seats: seatDetails,
        totalAmount,
        paymentMethod,
        paymentStatus: 'pending',
        bookingCode: generateBookingCode(),
        expiresAt,
      });

      return res.status(201).json(booking);
    } catch (createError) {
      showtime.lockedSeats = (showtime.lockedSeats || []).filter(lock => !seats.includes(lock.seatCode));
      await showtime.save();
      throw createError;
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate('movieId', 'title image ageRating')
      .populate('cinemaId', 'name address')
      .populate('showtimeId', 'startTime endTime format language roomId');

    if (!booking) {
      return res.status(404).json({ message: 'Không tìm thấy đơn đặt vé.' });
    }

    const room = booking.showtimeId?.roomId ? await Room.findById(booking.showtimeId.roomId) : null;

    res.json({
      ...booking.toObject(),
      room: room ? { id: room._id, name: room.name } : null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.payBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { paymentMethod } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Không tìm thấy đơn đặt vé.' });
    }

    if (booking.paymentStatus === 'success') {
      return res.json(booking);
    }

    const showtime = await Showtime.findById(booking.showtimeId);
    if (!showtime) {
      return res.status(404).json({ message: 'Không tìm thấy suất chiếu.' });
    }

    cleanupExpiredLocks(showtime);

    const seatCodes = booking.seats.map(seat => seat.seatCode);
    showtime.bookedSeats = Array.from(new Set([...(showtime.bookedSeats || []), ...seatCodes]));
    showtime.lockedSeats = (showtime.lockedSeats || []).filter(lock => !seatCodes.includes(lock.seatCode));
    await showtime.save();

    booking.paymentStatus = 'success';
    booking.paymentMethod = paymentMethod || booking.paymentMethod;
    booking.ticketBarcode = `TICKET-${booking.bookingCode}`;
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.seedBookingData = async (_req, res) => {
  try {
    const movie = await Movie.findOne({ status: 'now-showing' });
    const cinema = await Cinema.findOne();

    if (!movie || !cinema) {
      return res.status(400).json({ message: 'Cần có ít nhất 1 movie now-showing và 1 cinema trong database.' });
    }

    let room = await Room.findOne({ cinemaId: cinema._id });
    if (!room) {
      const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
      const cols = Array.from({ length: 12 }, (_, index) => index + 1);
      const seatLayout = rows.flatMap(row =>
        cols.map(col => ({
          code: `${row}${col}`,
          type: row <= 'B' ? 'sweetbox' : row <= 'E' ? 'vip' : 'standard',
          status: 'available',
        }))
      );

      room = await Room.create({
        name: 'Phòng 1',
        cinemaId: cinema._id,
        capacity: seatLayout.length,
        seatLayout,
      });
    }

    const existingShowtime = await Showtime.findOne({ movieId: movie._id, cinemaId: cinema._id, roomId: room._id });
    if (existingShowtime) {
      return res.json({ message: 'Dữ liệu booking đã tồn tại.', showtimeId: existingShowtime._id });
    }

    const now = new Date();
    now.setMinutes(0, 0, 0);
    now.setHours(now.getHours() + 2);
    const end = new Date(now.getTime() + (movie.duration || 120) * 60000);

    const showtime = await Showtime.create({
      movieId: movie._id,
      cinemaId: cinema._id,
      roomId: room._id,
      startTime: now,
      endTime: end,
      basePrice: 75000,
      bookedSeats: ['H1', 'H2', 'H3'],
      lockedSeats: [],
      format: '2D',
      language: 'Phụ đề',
      status: 'scheduled',
    });

    res.status(201).json({ message: 'Đã seed dữ liệu booking mẫu.', showtimeId: showtime._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
