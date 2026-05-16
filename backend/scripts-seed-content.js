const mongoose = require('mongoose');
const Movie = require('./models/movie.model');
const Cinema = require('./models/cinema.model');
const Room = require('./models/room.model');
const Showtime = require('./models/showtime.model');
const Post = require('./models/post.model');

async function seedShowtimes() {
  const movies = await Movie.find({ status: 'now-showing' }).limit(6);
  const cinemas = await Cinema.find().limit(2);
  const rooms = await Room.find({ cinemaId: { $in: cinemas.map(c => c._id) } });

  const startBase = new Date();
  startBase.setHours(9, 0, 0, 0);

  for (const movie of movies) {
    for (const cinema of cinemas) {
      const cinemaRooms = rooms.filter(room => String(room.cinemaId) === String(cinema._id));
      if (!cinemaRooms.length) continue;

      const room = cinemaRooms[0];
      await Showtime.deleteMany({ movieId: movie._id, cinemaId: cinema._id, roomId: room._id });

      const docs = [];
      for (let day = 0; day < 5; day++) {
        for (const hour of [9, 13, 17, 20]) {
          const start = new Date(startBase);
          start.setDate(start.getDate() + day);
          start.setHours(hour, 0, 0, 0);
          const end = new Date(start.getTime() + (movie.duration || 120) * 60000);
          docs.push({
            movieId: movie._id,
            cinemaId: cinema._id,
            roomId: room._id,
            startTime: start,
            endTime: end,
            basePrice: cinema.name.includes('Sala') ? 90000 : 75000,
            bookedSeats: day === 0 && hour === 9 ? ['A1', 'A2'] : [],
            lockedSeats: [],
            format: room.name.includes('IMAX') ? 'IMAX' : room.name.includes('3D') ? '3D' : '2D',
            language: movie.languages?.includes('Lồng Tiếng Việt') ? 'Lồng tiếng' : 'Phụ đề',
            status: 'scheduled',
          });
        }
      }
      await Showtime.insertMany(docs);
    }
  }
}

async function seedPosts() {
  await Post.deleteMany({});
  await Post.insertMany([
    {
      title: 'Mua 2 vé tặng 1 combo bắp nước mỗi tối thứ 4',
      content: 'Ưu đãi áp dụng cho tất cả suất chiếu sau 18:00 tại Galaxy Nguyễn Du và Galaxy Sala. Tặng ngay 1 combo bắp nước cỡ vừa khi thanh toán 2 vé online.',
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop',
      type: 'promotion',
      likes: 248,
      views: 3200,
    },
    {
      title: 'Thẻ thành viên mới: tích điểm x2 cho mọi giao dịch online',
      content: 'Khi đăng ký tài khoản thành viên và đặt vé online trong tuần này, khách hàng được nhân đôi điểm thưởng và nhận voucher giảm 15% cho lần mua kế tiếp.',
      image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200&auto=format&fit=crop',
      type: 'promotion',
      likes: 180,
      views: 2870,
    },
    {
      title: 'Cuối tuần gia đình: phim hoạt hình đồng giá từ 65K',
      content: 'Áp dụng cho các phim hoạt hình, gia đình và thiếu nhi trước 17:00 vào thứ 7, chủ nhật. Số lượng chỗ ngồi ưu đãi có hạn.',
      image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1200&auto=format&fit=crop',
      type: 'promotion',
      likes: 312,
      views: 4150,
    },
    {
      title: 'Dune: Phần Hai có xứng đáng với kỳ vọng bom tấn sci-fi?',
      content: 'Bộ phim mở rộng thế giới Arrakis một cách choáng ngợp, cân bằng giữa chính trị, tín ngưỡng và cảm xúc cá nhân. Một trải nghiệm điện ảnh rất đáng xem ở rạp.',
      image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1200&auto=format&fit=crop',
      type: 'review',
      likes: 530,
      views: 6900,
    },
    {
      title: '5 lý do nên xem phim bằng định dạng IMAX ít nhất một lần',
      content: 'Từ âm thanh, độ sáng, khung hình đến cảm giác nhập vai, IMAX tạo nên một trải nghiệm vượt xa việc xem trên màn hình thông thường.',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop',
      type: 'blog',
      likes: 214,
      views: 3540,
    },
    {
      title: 'Khán giả trẻ đang thay đổi thói quen mua vé online như thế nào?',
      content: 'Tốc độ đặt vé, chọn ghế trực quan và thanh toán không tiền mặt đang trở thành tiêu chuẩn mới của trải nghiệm đi xem phim hiện đại.',
      image: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=1200&auto=format&fit=crop',
      type: 'blog',
      likes: 156,
      views: 2210,
    }
  ]);
}

mongoose.connect('mongodb://localhost:27017/movie-booking')
  .then(async () => {
    await seedShowtimes();
    await seedPosts();
    console.log('seeded_showtimes_and_posts');
    await mongoose.disconnect();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
