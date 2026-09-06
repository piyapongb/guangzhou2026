/**
 * Itinerary Data
 * Common item fields: id, type, time, title, titleZh, thumbnail, icon, details
 * Supported types: activity | restaurant | flight | transfer | other
 *
 * Restaurant items never embed a full restaurant record — they reference
 * restaurants.js by id (restaurantId / nearbyRestaurantIds).
 *
 * Activity details only surface the destination's metroStation / metroExit
 * (no in-between commuting steps) plus entranceFee where relevant.
 */
window.ITINERARY_DATA = [
  {
    id: "day-1",
    dayNumber: 1,
    date: "2026-10-22",
    locationId: "guangzhou",
    weather: {
      forecast: "Partly cloudy",
      temperature: "24–29°C",
      rain: "20%",
      humidity: "70%",
      wind: "10 km/h",
      feelsLike: "29°C",
      uvIndex: 6
    },
    items: [
      {
        id: "d1-flight-in",
        type: "flight",
        time: "01:05",
        title: "Flight to Guangzhou",
        titleZh: "飞往广州",
        icon: "flight",
        airline: "Spring Airlines",
        flightNumber: "9C8934",
        departureAirport: "CNX",
        arrivalAirport: "CAN",
        departureTime: "21:20",
        departureDateNote: "22 Oct 2026",
        arrivalTime: "01:05",
        arrivalDateNote: "23 Oct 2026",
        arrivalTerminal: "Terminal 3"
      }
    ]
  },
  {
    id: "day-2",
    dayNumber: 2,
    date: "2026-10-23",
    locationId: "guangzhou",
    weather: {
      forecast: "Sunny",
      temperature: "25–31°C",
      rain: "10%",
      humidity: "65%",
      wind: "13 km/h",
      feelsLike: "32°C",
      uvIndex: 8
    },
    items: [
      {
        id: "d2-hotel-checkin",
        type: "other",
        time: "02:00",
        title: "Hotel Check-in",
        titleZh: "酒店入住",
        icon: "hotel",
        details: {
          description:
            "เช็คอินที่ Baiyun Airport Konggang Hotel (广东空港大酒店) หลังลงเครื่อง มีรถรับส่งสนามบินฟรีตลอด 24 ชม.",
          location: "Baiyun Airport Konggang Hotel, near Guangzhou Baiyun International Airport"
        }
      },
      {
        id: "d2-hotel-checkout",
        type: "other",
        time: "09:00",
        title: "Hotel Check-out",
        titleZh: "退房",
        icon: "hotel",
        details: {
          description: "เช็คเอาท์จาก Baiyun Airport Konggang Hotel นั่งรถรับส่งฟรีเข้าเมือง",
          location: "Baiyun Airport Konggang Hotel, near Guangzhou Baiyun International Airport"
        }
      },
      {
        id: "d2-luggage-drop",
        type: "other",
        time: "10:30",
        title: "Luggage Drop-off",
        titleZh: "寄存行李",
        icon: "hotel",
        details: {
          description:
            "ฝากกระเป๋าที่ City Comfort Inn (麓苑路淘金地铁站店) ก่อนถึงเวลาเช็คอินจริง แล้วออกไปเที่ยวตัวเบา",
          location: "City Comfort Inn, Luyuan Road, near Taojin Metro Station"
        }
      },
      {
        id: "d2-cafe-hopping",
        type: "restaurant",
        time: "11:30",
        title: "Cafe Hopping",
        titleZh: "探店咖啡",
        icon: "food",
        restaurantId: "restaurant-017",
        nearbyRestaurantIds: ["restaurant-017", "restaurant-011", "restaurant-012"]
      },
      {
        id: "d2-lunch",
        type: "restaurant",
        time: "13:30",
        title: "Lunch",
        titleZh: "午餐",
        icon: "food",
        restaurantId: "restaurant-010",
        nearbyRestaurantIds: ["restaurant-010", "restaurant-001"]
      },
      {
        id: "d2-chen-clan",
        type: "activity",
        time: "15:00",
        title: "Chen Clan Ancestral Hall",
        titleZh: "陈家祠",
        thumbnail: "assets/images/activities/d2-chen-clan.png",
        icon: "museum",
        details: {
          description:
            "ศาลาบรรพบุรุษตระกูลเฉินที่มีงานแกะสลักไม้และปูนปั้นสวยงามที่สุดแห่งหนึ่งของกวางตุ้ง",
          location: "34 Enlong Li, Liwan District",
          metroStation: "Chen Clan Academy",
          metroExit: "D",
          entranceFee: "¥10"
        }
      },
      {
        id: "d2-dinner",
        type: "restaurant",
        time: "17:30",
        title: "Dinner",
        titleZh: "晚餐",
        icon: "food",
        restaurantId: "restaurant-016",
        nearbyRestaurantIds: ["restaurant-016", "restaurant-006"]
      },
      {
        id: "d2-beijing-road",
        type: "activity",
        time: "19:00",
        title: "Beijing Road Pedestrian Street",
        titleZh: "北京路步行街",
        thumbnail: "assets/images/activities/d2-beijing-road.png",
        icon: "shopping",
        details: {
          description:
            "ถนนคนเดินเก่าแก่ใจกลางเมือง มีร่องรอยถนนโบราณให้ชมใต้กระจก และร้านค้าสองฝั่งถนนคึกคักยามค่ำ",
          location: "Beijing Road, Yuexiu District",
          metroStation: "Gongyuanqian",
          metroExit: "B"
        }
      }
    ]
  },
  {
    id: "day-3",
    dayNumber: 3,
    date: "2026-10-24",
    locationId: "guangzhou",
    weather: {
      forecast: "Light rain",
      temperature: "23–27°C",
      rain: "60%",
      humidity: "80%",
      wind: "16 km/h",
      feelsLike: "27°C",
      uvIndex: 4
    },
    items: [
      {
        id: "d3-haixin-bridge",
        type: "activity",
        time: "09:00",
        title: "Haixin Bridge",
        titleZh: "海心桥",
        thumbnail: "assets/images/activities/d3-haixin-bridge.png",
        icon: "landmark",
        details: {
          description:
            "สะพานคนเดินข้ามแม่น้ำจูเจียงที่ออกแบบทันสมัย เชื่อมสองฝั่งเมืองพร้อมวิวหอคอยแคนตัน",
          location: "Pearl River, Tianhe District, near Haixinsha",
          entranceFee: "Free"
        }
      },
      {
        id: "d3-hongcheng-park",
        type: "activity",
        time: "10:30",
        title: "Hongcheng Park",
        titleZh: "宏城公园",
        thumbnail: "assets/images/activities/d3-hongcheng-park.png",
        icon: "park",
        details: {
          description: "สวนสาธารณะเงียบสงบ เหมาะกับเดินเล่นพักผ่อนก่อนไปต่อจุดถัดไป",
          location: "Tianhe District, Guangzhou",
          entranceFee: "Free"
        }
      },
      {
        id: "d3-parc-central",
        type: "activity",
        time: "12:00",
        title: "Parc Central",
        titleZh: "天环广场",
        thumbnail: "assets/images/activities/d3-parc-central.png",
        icon: "shopping",
        details: {
          description:
            "ห้างสรรพสินค้าใจกลางย่านจูเจียงนิวทาวน์ มีร้านอาหารและคาเฟ่ให้เลือกหลากหลายสำหรับมื้อเที่ยง",
          location: "Zhujiang New Town, Tianhe District",
          metroStation: "Zhujiang New Town"
        }
      },
      {
        id: "d3-opera-house",
        type: "activity",
        time: "15:00",
        title: "Guangzhou Opera House",
        titleZh: "广州大剧院",
        thumbnail: "assets/images/activities/d3-opera-house.png",
        icon: "landmark",
        details: {
          description:
            "สถาปัตยกรรมล้ำสมัยรูปทรงก้อนหินคู่ ออกแบบโดย Zaha Hadid จุดถ่ายรูปสวยริมแม่น้ำจูเจียง",
          location: "1 Zhujiang West Road, Zhujiang New Town, Tianhe District",
          metroStation: "Zhujiang New Town",
          metroExit: "B1",
          entranceFee: "Free to view exterior; show tickets vary"
        }
      },
      {
        id: "d3-canton-tower",
        type: "activity",
        time: "17:00",
        title: "Canton Tower",
        titleZh: "广州塔",
        thumbnail: "assets/images/activities/d3-canton-tower.png",
        icon: "landmark",
        details: {
          description:
            "หอคอยสัญลักษณ์ของกวางโจว ขึ้นชมวิวเมืองและแม่น้ำจูเจียงแบบพาโนรามา",
          location: "222 Yuejiang West Road, Haizhu District",
          metroStation: "Canton Tower",
          metroExit: "B1",
          entranceFee: "¥150",
          ticketUrl: "https://www.cantontower.com/"
        }
      },
      {
        id: "d3-liede-bridge",
        type: "activity",
        time: "19:00",
        title: "Liede Bridge",
        titleZh: "猎德大桥",
        thumbnail: "assets/images/activities/d3-liede-bridge.png",
        icon: "night-view",
        details: {
          description:
            "จุดชมวิวสะพานยามค่ำคืน มองเห็นแสงไฟหอคอยแคนตันและตึกสูงย่านจูเจียงนิวทาวน์แบบพาโนรามา",
          location: "Liede, Tianhe District",
          metroStation: "Liede",
          entranceFee: "Free"
        }
      }
    ]
  },
  {
    id: "day-4",
    dayNumber: 4,
    date: "2026-10-25",
    locationId: "guangzhou",
    weather: {
      forecast: "Sunny",
      temperature: "24–30°C",
      rain: "10%",
      humidity: "68%",
      wind: "12 km/h",
      feelsLike: "31°C",
      uvIndex: 7
    },
    items: [
      {
        id: "d4-sacred-heart",
        type: "activity",
        time: "09:00",
        title: "Guangzhou Sacred Heart Cathedral",
        titleZh: "石室圣心大教堂",
        thumbnail: "assets/images/activities/d4-sacred-heart.png",
        icon: "landmark",
        details: {
          description:
            "โบสถ์คาทอลิกสไตล์กอทิกที่สร้างจากหินแกรนิตทั้งหลัง หนึ่งในโบสถ์หินแบบกอทิกที่ใหญ่ที่สุดในเอเชีย",
          location: "Yide Road, Yuexiu District",
          metroStation: "Haizhu Square",
          entranceFee: "Free"
        }
      },
      {
        id: "d4-liurong-temple",
        type: "activity",
        time: "10:30",
        title: "Liurong Temple",
        titleZh: "六榕寺",
        thumbnail: "assets/images/activities/d4-liurong-temple.png",
        icon: "landmark",
        details: {
          description:
            "วัดพุทธเก่าแก่กว่าพันปี ขึ้นชื่อเรื่องเจดีย์ดอกไม้สีสันสดใสที่มองเห็นได้แต่ไกล",
          location: "87 Liurong Road, Yuexiu District",
          metroStation: "Ximenkou",
          entranceFee: "¥10"
        }
      },
      {
        id: "d4-teemall",
        type: "activity",
        time: "12:00",
        title: "Teemall",
        titleZh: "天汇广场",
        thumbnail: "assets/images/activities/d4-teemall.png",
        icon: "shopping",
        details: {
          description:
            "ห้างสรรพสินค้าบนถนนปักกิ่ง เหมาะแวะพักกินมื้อเที่ยงและช้อปปิ้ง มีร้าน Hakka Yu ชั้น 7 และ Tao Tao Ju สาขาชั้น 6 ให้เลือก",
          location: "Beijing Road, Yuexiu District",
          metroStation: "Gongyuanqian"
        }
      },
      {
        id: "d4-dafo-temple",
        type: "activity",
        time: "15:00",
        title: "Dafo Temple",
        titleZh: "大佛寺",
        thumbnail: "assets/images/activities/d4-dafo-temple.png",
        icon: "landmark",
        details: {
          description: "วัดพุทธใจกลางเมืองใกล้ถนนปักกิ่ง มีพระพุทธรูปทองขนาดใหญ่เป็นจุดเด่น",
          location: "Huifu East Road, Yuexiu District, near Beijing Road",
          metroStation: "Gongyuanqian",
          entranceFee: "¥10"
        }
      },
      {
        id: "d4-yong-qing-fang",
        type: "activity",
        time: "17:00",
        title: "Yong Qing Fang",
        titleZh: "永庆坊",
        thumbnail: "assets/images/activities/d4-yong-qing-fang.png",
        icon: "landmark",
        details: {
          description:
            "ย่านเก่าที่บูรณะใหม่ อาคารสไตล์ซีกวนดั้งเดิมผสมร้านค้าโมเดิร์น เหมาะเดินเล่นถ่ายรูปยามเย็น",
          location: "Enning Road, Liwan District",
          metroStation: "Huangsha",
          entranceFee: "Free"
        }
      },
      {
        id: "d4-beijing-road",
        type: "activity",
        time: "19:00",
        title: "Beijing Road Pedestrian Street",
        titleZh: "北京路步行街",
        thumbnail: "assets/images/activities/d4-beijing-road.png",
        icon: "shopping",
        details: {
          description:
            "แวะเดินเล่นชอปปิ้งรอบสุดท้ายก่อนกลับ ถนนคนเดินคึกคักที่สุดแห่งหนึ่งของกวางโจวยามค่ำ",
          location: "Beijing Road, Yuexiu District",
          metroStation: "Gongyuanqian",
          metroExit: "B"
        }
      },
      {
        id: "d4-airport-transfer",
        type: "other",
        time: "22:30",
        title: "Travel to Airport",
        titleZh: "前往机场",
        icon: "flight",
        details: {
          description:
            "ออกเดินทางจากที่พักไปยังสนามบินนานาชาติกวางโจวไป๋หวิน เผื่อเวลาเช็คอินสำหรับเที่ยวบินเช้ามืดวันถัดไป",
          location: "Guangzhou Baiyun International Airport"
        }
      }
    ]
  },
  {
    id: "day-5",
    dayNumber: 5,
    date: "2026-10-26",
    locationId: "guangzhou",
    weather: {
      forecast: "Partly cloudy",
      temperature: "23–28°C",
      rain: "15%",
      humidity: "70%",
      wind: "14 km/h",
      feelsLike: "28°C",
      uvIndex: 6
    },
    items: [
      {
        id: "d5-flight-out",
        type: "flight",
        time: "05:55",
        title: "Flight to Chiang Mai",
        titleZh: "飞往清迈",
        icon: "flight",
        airline: "Spring Airlines",
        flightNumber: "9C8933",
        departureAirport: "CAN",
        arrivalAirport: "CNX",
        departureTime: "05:55",
        departureDateNote: "26 Oct 2026",
        departureTerminal: "Terminal 3",
        arrivalTime: "08:00",
        arrivalDateNote: "26 Oct 2026"
      }
    ]
  }
];
