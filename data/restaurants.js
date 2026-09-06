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
  },
  {
    id: "restaurant-010",
    zone: "Liwan",
    name: "Dian Dou De (Xinghuan / Big Treehouse Branch)",
    nameZh: "点都德(星寰店/大树下总店)",
    image: "assets/images/restaurants/dian-dou-de.svg",
    gallery: ["assets/images/restaurants/dian-dou-de.svg"],
    cuisine: ["Cantonese", "Dim Sum"],
    description:
      "ติ่มซำเชนดังของกวางโจว สาขานี้ใกล้เขตเมืองเก่าซีกวน เมนูหลากหลายและคิวมักยาวช่วงเที่ยง",
    address: "Xinghuan / Big Treehouse Branch, Liwan District, Guangzhou (confirm exact address on Amap before visiting)",
    price: "¥70–140",
    recommendedDishes: ["Steamed Pork Ribs", "BBQ Pork Puff", "Rice Noodle Rolls"],
    links: [
      { label: "Dianping (大众点评)", url: "https://www.dianping.com/", type: "review", rating: "4.6" }
    ]
  },
  {
    id: "restaurant-011",
    zone: "Yuexiu",
    name: "HEYTEA Lab",
    nameZh: "喜茶 LAB",
    image: "assets/images/restaurants/heytea-lab.svg",
    gallery: ["assets/images/restaurants/heytea-lab.svg"],
    cuisine: ["Cafe", "Tea"],
    description:
      "ร้านชาสไตล์โมเดิร์นสาขาพิเศษ ตกแต่งเป็นธีมเฉพาะ เหมาะกับการแวะถ่ายรูปและจิบชาผลไม้ระหว่างเดินเที่ยว",
    address: "Yuexiu District, Guangzhou (check current branch location on Amap)",
    price: "¥25–45",
    recommendedDishes: ["Cheese Tea", "Fruit Tea", "Soft Serve"],
    links: [
      { label: "Dianping (大众点评)", url: "https://www.dianping.com/", type: "review", rating: "4.5" }
    ]
  },
  {
    id: "restaurant-012",
    zone: "Yuexiu",
    name: "Nap Cafe Lab",
    nameZh: "Nap Cafe Lab",
    image: "assets/images/restaurants/nap-cafe-lab.svg",
    gallery: ["assets/images/restaurants/nap-cafe-lab.svg"],
    cuisine: ["Cafe"],
    description:
      "คาเฟ่บรรยากาศเรียบง่าย มินิมอล เหมาะกับพักดื่มกาแฟและทำงานเบา ๆ ระหว่างวัน",
    address: "Yuexiu District, Guangzhou (check current branch location on Amap)",
    price: "¥30–60",
    recommendedDishes: ["Specialty Coffee", "Cold Brew", "Pastries"],
    links: []
  },
  {
    id: "restaurant-013",
    zone: "Yuexiu",
    name: "Wentong's",
    nameZh: "Wentong's",
    image: "assets/images/restaurants/wentongs.svg",
    gallery: ["assets/images/restaurants/wentongs.svg"],
    cuisine: ["Cafe"],
    description: "คาเฟ่ขนาดกะทัดรัด บรรยากาศสบาย ๆ เหมาะเป็นจุดพักระหว่างเดินเที่ยวย่านนี้",
    address: "Yuexiu District, Guangzhou (check current branch location on Amap)",
    price: "¥30–60",
    recommendedDishes: ["Coffee", "Brunch Set"],
    links: []
  },
  {
    id: "restaurant-014",
    zone: "Yuexiu",
    name: "Hakka Yu",
    nameZh: "客家渔",
    image: "assets/images/restaurants/hakka-yu.svg",
    gallery: ["assets/images/restaurants/hakka-yu.svg"],
    cuisine: ["Local Cuisine", "Hakka"],
    description:
      "ร้านอาหารฮากกา (จีนแคะ) รสชาติเข้มข้นแบบดั้งเดิม อยู่ในห้าง Teemall ชั้น 7 ใกล้ถนนปักกิ่ง",
    address: "7F Teemall, Beijing Road, Yuexiu District, Guangzhou",
    price: "¥60–120",
    recommendedDishes: ["Hakka Salt-baked Chicken", "Stuffed Tofu", "Preserved Vegetable Pork"],
    links: []
  },
  {
    id: "restaurant-015",
    zone: "Yuexiu",
    name: "Tao Tao Ju (Teemall Beijing Lu Branch)",
    nameZh: "陶陶居(北京路天汇店)",
    image: "assets/images/restaurants/tao-tao-ju-teemall.svg",
    gallery: ["assets/images/restaurants/tao-tao-ju-teemall.svg"],
    cuisine: ["Cantonese", "Dim Sum"],
    description:
      "สาขาของติ่มซำชื่อดังโบราณ อยู่ในห้าง Teemall ชั้น 6 ใกล้ถนนปักกิ่ง สะดวกกว่าสาขาดั้งเดิมที่ซีกวน",
    address: "6F Teemall, Beijing Road, Yuexiu District, Guangzhou",
    price: "¥60–120",
    recommendedDishes: ["Char Siu Bun", "Shrimp Dumpling", "Egg Tart"],
    links: [
      { label: "Dianping (大众点评)", url: "https://www.dianping.com/", type: "review", rating: "4.5" }
    ]
  },
  {
    id: "restaurant-016",
    zone: "Yuexiu",
    name: "Da Ge Fan (Beijing Road Branch)",
    nameZh: "大鸽饭(北京路店)",
    image: "assets/images/restaurants/da-ge-fan.svg",
    gallery: ["assets/images/restaurants/da-ge-fan.svg"],
    cuisine: ["Local Cuisine", "Cantonese"],
    description:
      "ร้านขึ้นชื่อเรื่องนกพิราบย่าง (乳鸽) แบบกวางตุ้งดั้งเดิม เมนูซิกเนเจอร์ของย่านถนนปักกิ่ง",
    address: "Near Beijing Road Pedestrian Street, Yuexiu District, Guangzhou",
    price: "¥50–100",
    recommendedDishes: ["Roast Pigeon", "Claypot Rice", "Stir-fried Greens"],
    links: [
      { label: "Dianping (大众点评)", url: "https://www.dianping.com/", type: "review", rating: "4.6" }
    ]
  },
  {
    id: "restaurant-017",
    zone: "Yuexiu",
    name: "The raw",
    nameZh: "The raw",
    image: "assets/images/restaurants/the-raw.svg",
    gallery: ["assets/images/restaurants/the-raw.svg"],
    cuisine: ["Cafe"],
    description:
      "คาเฟ่สายสุขภาพ เมนูเบา ๆ และเครื่องดื่มปั่นสด เหมาะกับมื้อเช้าหรือพักระหว่างเดินเที่ยวย่านนี้",
    address: "Yuexiu District, Guangzhou (near Taojin Metro Station — check current branch on Amap)",
    price: "¥40–80",
    recommendedDishes: ["Smoothie Bowl", "Cold-pressed Juice", "Avocado Toast"],
    links: []
  }
];
