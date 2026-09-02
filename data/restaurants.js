/**
 * Restaurant Master Data
 * Single source of truth for every restaurant. Itinerary items reference
 * these records by id only (restaurantId / nearbyRestaurantIds) and must
 * never embed a duplicate copy of a restaurant object.
 *
 * Fields: id, zone, name, nameZh, image, gallery, cuisine, description,
 * address, price, recommendedDishes, links
 *
 * `links` is an array of { label, url, type: "review"|"website", rating? }
 * rendered as a "Reviews & Links" list — use it to attach one or many
 * review sites / official sites per restaurant. Mock data below; replace
 * with real links and ratings when available.
 */
window.RESTAURANTS_DATA = [
  {
    id: "restaurant-001",
    zone: "Liwan",
    name: "Tao Tao Ju",
    nameZh: "陶陶居",
    image: "assets/images/restaurants/tao-tao-ju.svg",
    gallery: [
      "assets/images/restaurants/tao-tao-ju.svg",
      "assets/images/restaurants/dimsum-alt.svg"
    ],
    cuisine: ["Cantonese", "Dim Sum"],
    description:
      "ร้านติ่มซำเก่าแก่ที่เปิดมานานกว่าร้อยปี บรรยากาศแบบจีนโบราณ ขึ้นชื่อเรื่องซาลาเปาและขนมจีบ",
    address: "20 Dishifu Road, Liwan District, Guangzhou",
    price: "¥60–120",
    recommendedDishes: ["Char Siu Bun", "Shrimp Dumpling", "Egg Tart"],
    links: [
      { label: "TripAdvisor", url: "https://www.tripadvisor.com/", type: "review", rating: "4.5" },
      { label: "Dianping (大众点评)", url: "https://www.dianping.com/", type: "review", rating: "4.6" },
      { label: "Official Website", url: "https://www.taotaoju.com/", type: "website" }
    ]
  },
  {
    id: "restaurant-002",
    zone: "Liwan",
    name: "Panxi Restaurant",
    nameZh: "泮溪酒家",
    image: "assets/images/restaurants/panxi.svg",
    gallery: ["assets/images/restaurants/panxi.svg"],
    cuisine: ["Cantonese", "Dim Sum"],
    description:
      "ภัตตาคารริมน้ำสไตล์สวนจีนโบราณ ใหญ่ที่สุดแห่งหนึ่งในกวางโจว เหมาะสำหรับมื้อกลางวันแบบติ่มซำ",
    address: "151 Longjin West Road, Liwan District, Guangzhou",
    price: "¥80–150",
    recommendedDishes: ["Steamed Rice Rolls", "Lotus Paste Pastry", "BBQ Pork Puff"],
    links: []
  },
  {
    id: "restaurant-003",
    zone: "Tianhe",
    name: "Haidilao Hot Pot",
    nameZh: "海底捞火锅",
    image: "assets/images/restaurants/haidilao.svg",
    gallery: ["assets/images/restaurants/haidilao.svg"],
    cuisine: ["Hotpot"],
    description:
      "หม้อไฟชื่อดังระดับประเทศ บริการดีเยี่ยม มีเมนูน้ำซุปให้เลือกหลากหลาย เหมาะกับมื้อเย็น",
    address: "228 Tianhe Road, Tianhe District, Guangzhou",
    price: "¥100–180",
    recommendedDishes: ["Sliced Beef", "Hand-pulled Noodles", "Mushroom Platter"],
    links: [
      { label: "Official Site", url: "https://www.haidilao.com/", type: "website" },
      { label: "Dianping (大众点评)", url: "https://www.dianping.com/", type: "review", rating: "4.8" }
    ]
  },
  {
    id: "restaurant-004",
    zone: "Tianhe",
    name: "Shunfeng Seafood",
    nameZh: "顺风海鲜舫",
    image: "assets/images/restaurants/shunfeng.svg",
    gallery: [],
    cuisine: ["Seafood", "Cantonese"],
    description:
      "ร้านอาหารทะเลสไตล์กวางตุ้ง เลือกวัตถุดิบสดจากตู้ปลาได้เอง เหมาะกับมื้อพิเศษ",
    address: "1 Huacheng Avenue, Tianhe District, Guangzhou",
    price: "¥150–300",
    recommendedDishes: ["Steamed Garoupa", "Salt-baked Prawns", "Typhoon Shelter Crab"],
    links: []
  },
  {
    id: "restaurant-005",
    zone: "Yuexiu",
    name: "Guangzhou Restaurant",
    nameZh: "广州酒家",
    image: "assets/images/restaurants/guangzhou-restaurant.svg",
    gallery: ["assets/images/restaurants/guangzhou-restaurant.svg"],
    cuisine: ["Cantonese", "Dim Sum"],
    description:
      "หนึ่งในภัตตาคารที่มีชื่อเสียงที่สุดของกวางโจว รสชาติต้นตำรับกวางตุ้งดั้งเดิม",
    address: "2 Wenchang South Road, Liwan District, Guangzhou",
    price: "¥90–160",
    recommendedDishes: ["Roast Goose", "Pan-fried Radish Cake", "Almond Cream"],
    links: []
  },
  {
    id: "restaurant-006",
    zone: "Yuexiu",
    name: "Beijing Road Snack Alley",
    nameZh: "北京路小食街",
    image: "assets/images/restaurants/street-food.svg",
    gallery: [],
    cuisine: ["Street Food"],
    description:
      "ตรอกของกินริมถนนปักกิ่ง สายเดินเล่นตอนกลางคืน มีของว่างท้องถิ่นให้ลองหลายอย่าง",
    address: "Beijing Road Pedestrian Street, Yuexiu District, Guangzhou",
    price: "¥15–40",
    recommendedDishes: ["Stinky Tofu", "Rice Noodle Rolls", "Sugar Cane Juice"],
    links: []
  },
  {
    id: "restaurant-007",
    zone: "Liwan",
    name: "Shamian Riverside Cafe",
    nameZh: "沙面江畔咖啡",
    image: "assets/images/restaurants/shamian-cafe.svg",
    gallery: ["assets/images/restaurants/shamian-cafe.svg"],
    cuisine: ["Cafe", "Western"],
    description:
      "คาเฟ่บรรยากาศยุโรปบนเกาะซาเหมี่ยน เหมาะกับมื้อเช้าหรือพักดื่มกาแฟระหว่างเดินเที่ยว",
    address: "Shamian Street, Liwan District, Guangzhou",
    price: "¥40–90",
    recommendedDishes: ["French Toast", "Iced Latte", "Egg Waffle"],
    links: []
  },
  {
    id: "restaurant-008",
    zone: "Haizhu",
    name: "Litchi Bay Seafood House",
    nameZh: "荔湾海鲜楼",
    image: "assets/images/restaurants/litchi-bay.svg",
    gallery: [],
    cuisine: ["Seafood"],
    description:
      "ร้านอาหารทะเลใกล้แม่น้ำจูเจียง เหมาะสำหรับมื้อเย็นก่อนหรือหลังล่องเรือ",
    address: "18 Binjiang Road, Haizhu District, Guangzhou",
    price: "¥120–220",
    recommendedDishes: ["Steamed Scallops", "Black Pepper Squid", "Congee"],
    links: []
  },
  {
    id: "restaurant-009",
    zone: "Tianhe",
    name: "Tianhe Noodle Bar",
    nameZh: "天河面馆",
    image: "assets/images/restaurants/noodle-bar.svg",
    gallery: [],
    cuisine: ["Noodles"],
    description:
      "ร้านบะหมี่เกี๊ยวสไตล์กวางตุ้งเล็ก ๆ เหมาะกับมื้อเที่ยงเร็ว ๆ ระหว่างช้อปปิ้ง",
    address: "5 Zhongshan Avenue, Tianhe District, Guangzhou",
    price: "¥25–45",
    recommendedDishes: ["Wonton Noodles", "Beef Brisket Noodles"],
    links: []
  }
];
